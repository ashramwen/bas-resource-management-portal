import * as Stomp from 'stompjs';

import { Observable, Observer, Subject, Subscriber } from 'rxjs';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { RootState } from './../redux/index';
import { StateSelectors } from './../redux/selectors';
import { StompThing } from './../models/stomp-thing.interface';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { TokenState } from './../redux/token/reducer';

/** possible states for the STOMP service */
export enum StompState {
  CLOSED,
  TRYING,
  CONNECTED,
  DISCONNECTING
};

/**
 * Angular2 STOMP Service using stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into a Subject observable.
 */
@Injectable()
export class StompService {

  /* Service parameters */

  // State of the STOMPService
  private state: BehaviorSubject<StompState>;

  // Publishes new messages to Observers
  private messages: Subject<StompThing>;

  // STOMP Client from stomp.js
  private client: Stomp.Client;

  // Timer
  private timer: number;

  private subscription: any[];

  private token$: Subscription;

  constructor(
    private store: Store<RootState>
  ) {
    this.messages = new Subject<StompThing>();
    this.state = new BehaviorSubject<StompState>(StompState.CLOSED);
    this.subscription = [];
  }

  /**
   * Init STOMP Client
   *
   * @returns {Promise<{}>}
   *
   * @memberOf StompService
   */
  public init(): Promise<{}> {
    if (this.state.getValue() !== StompState.CLOSED) {
      throw Error('STOMP Already running!');
    }

    this.client = Stomp.client(BASE_CONFIG.wsUrl);

    this.client.heartbeat.outgoing = 20000;
    this.client.heartbeat.incoming = 0;
    this.client.debug = null;

    return this.try_connect();
  }

  /**
   * Disconnect the STOMP client and clean up
   *
   *
   * @memberOf StompService
   */
  public disconnect(): void {
    this._unsubscribe();

    // Notify observers that we are disconnecting!
    this.state.next(StompState.DISCONNECTING);

    // Abort reconnecting if in progress
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client && this.client.connected) {
      this.client.disconnect(() => this.state.next(StompState.CLOSED));
    }

    this.debug('STOMP Disconnected.');
  }

  /**
   * Send a message to a destination
   *
   * @param {string} destination
   * @param {string} message
   *
   * @memberOf StompService
   */
  public send(destination: string, message: string): void {
    this.client.send(destination, {}, message);
  }

  /**
   * Subscribe to a destination
   *
   * @param {string} destination
   * @returns {*}
   *
   * @memberOf StompService
   */
  public on(destination: string): Observable<any> {
    let subscription;
    let callback$ = new Observable((observer) => {
      if (this.state.getValue() === StompState.CONNECTED) {
        subscription = this.on_subscribe(destination, observer);
      } else {
        let stateObserver: Observer<StompState> = {
          next: (stompState: StompState) => {
            if (stompState === StompState.CONNECTED) {
              subscription = this.on_subscribe(destination, observer);
              this.state.unsubscribe();
            }
          },
          error: (error) => console.log('state error: ' + error),
          complete: () => console.log('state complete!')
        };
        this.state.subscribe(stateObserver);
        return () => {
          if (!subscription) {
            subscription.unsubscribe();
          }
        };
      }
    });

    return callback$;
  }

  /**
   * unsubscribe all subscriptions
   *
   *
   * @memberOf StompService
   */
  public unsubscribe(): any {
    this.subscription.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.messages.unsubscribe();
  }

  /**
   * Receive message
   *
   * @param {*} callback
   *
   * @memberOf StompService
   */
  public onMessage(callback: any): void {
    this.messages.subscribe(callback);
  }

  /**
   * Perform connection to STOMP broker
   *
   * @returns {Promise<{}>}
   *
   * @memberOf StompService
   */
  private try_connect(): any {
    if (this.state.getValue() !== StompState.CLOSED) {
      throw Error('STOMP: Can\'t try_connect if not CLOSED!');
    }

    this.token$ = this.store.select(StateSelectors.token)
      .first()
      .map((tokenState: TokenState) => tokenState.token.accessToken)
      .subscribe((accessToken: string) => {
        let option: any = {
          Authorization: `Bearer ${accessToken}`
        };
        // Attempt connection, passing in a callback
        this.client.connect(option,
          this.on_connect.bind(this),
          this.on_error.bind(this)
        );

        this.debug('STOMP Connecting...');
        this.state.next(StompState.TRYING);
      });
    return this.token$;
  }

  /**
   * debug log
   *
   * @param {...any[]} args
   *
   * @memberOf StompService
   */
  private debug(args: any): void {
    console.log(args);
  }

  /**
   * Callback run on successfully connecting to server
   *
   *
   * @memberOf StompService
   */
  private on_connect() {
    this.debug('STOMP Connected.');

    // Indicate our connected state to observers
    this.state.next(StompState.CONNECTED);

    // Clear timer
    this.timer = null;
  }

  /**
   * Handle errors from stomp.js
   *
   * @param {(string | Stomp.Message)} error
   *
   * @memberOf StompService
   */
  private on_error(error: string | Stomp.Message) {

    if (typeof error === 'object') {
      error = (error as Stomp.Message).body;
    }

    console.error(`STOMP Error: ${error}`);

    // Check for dropped connection and try reconnecting
    if (error.indexOf('STOMP Lost connection') !== -1) {

      // Reset state indicator
      this.state.next(StompState.CLOSED);

      // Attempt reconnection
      this.debug('STOMP Reconnecting in 5 seconds...');
      this.timer = window.setTimeout(() => {
        this.init();
      }, 5000);
    }
  }

  /**
   * subscribe
   *
   * @private
   * @param {*} observer
   *
   * @memberOf StompService
   */
  private on_subscribe(destination: string, observer: any): any {
    console.log('STOMP Subscribe:', destination);
    let subscription = this.client.subscribe(
      destination,
      this.on_message.bind(this, observer),
      { ack: 'auto' }
    );
    this.subscription.push(subscription);
    return subscription;
  }

  /**
   * On message RX, notify the Observable with the message object
   *
   * @param {Stomp.Message} message
   *
   * @memberOf StompService
   */
  private on_message(observer: any, message: Stomp.Message) {
    if (message.body) {
      observer.next(JSON.parse(message.body));
    } else {
      console.error('STOMP: Empty message received!');
    }
  }

  private _unsubscribe() {
    if (!this.token$ || this.token$.closed) { return; }
    this.token$.unsubscribe();
  }
}
