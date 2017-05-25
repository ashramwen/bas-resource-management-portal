import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { BasArea } from './models/area.interface';
import { BasMarker } from './models/marker.interface';
import { MapUtils } from './utils';
import { LayerControlService } from './services/layer-control.service';
import { OnChanges, SimpleChanges } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { BMLocation } from './models/location.interface';
import { Observable } from 'rxjs/Observable';
import { MarkerControlService } from './services/marker-control.service';
import { Location } from '../../models/location.interface';
import { BMThing } from './models/thing.interface';

@Component({
  selector: 'bm-map-view',
  template: `
    <div class="bas-map-target" #mapTarget></div>
  `,
  styleUrls: ['./map-view.component.scss'],
  providers: [LayerControlService, MarkerControlService]
})
export class MapViewCmp implements OnInit, AfterViewInit {
  @Output()
  public layerClick: EventEmitter<BMLocation> = new EventEmitter();

  @Output()
  public markerClick: EventEmitter<BMThing> = new EventEmitter();

  @Output()
  public mapInit: EventEmitter<L.Map> = new EventEmitter();

  @Input()
  public set locations(value: BMLocation[]) {
    if (this._locations === value) { return; }
    this._locations = value;
    this._locationChanged.next(this._locations);
  }

  @Input()
  public set zoom(value) {
    if (this._zoom === value) { return; }
    this._zoom = value;
    this._mapViewChanged.next(void 0);
  }

  @Input()
  public set devices(value: BMThing[]) {
    if (this._devices === value) { return; }
    this._devices = value;
    this._devicesChanged.next(this._devices);
  }

  @ViewChild('mapTarget')
  public mapTarget: ElementRef;

  private _locations: BMLocation[] = [];
  private _devices: BMThing[] = [];
  private _zoom: number;
  private _map: L.Map;
  private _mapInited: Subject<boolean> = new Subject();
  private _locationChanged: BehaviorSubject<BMLocation[]> = new BehaviorSubject<BMLocation[]>([]);
  private _devicesChanged: BehaviorSubject<BMThing[]> = new BehaviorSubject([]);
  private _mapViewChanged: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  constructor(
    private _layerControl: LayerControlService,
    private _markerControl: MarkerControlService
  ) { }

  /**
   * update view when window is resized
   * 
   * 
   * @memberOf MapViewCmp
   */
  @HostListener('window:resize')
  public windowResize() {
    let opt: L.ZoomPanOptions = {
      animate: true
    };
    this._map.invalidateSize(opt);
  }

  public ngOnInit() {
    this._mapInited.subscribe(() => {
      this._locationChanged.subscribe((result) => {
        this._loadLocations(result);
      });
      this._mapViewChanged.subscribe(() => {
        this._updateView();
      });
      this._devicesChanged.subscribe((result) => {
        this._loadMarkers(result);
      });
    });
  }

  public ngAfterViewInit() {
    this._initMap();
  }

  public updateView() {
    let newMarkers = this._markerControl.updateMarkers(this._map);
    let newLayers = this._layerControl.updateLayers(this._map);
    this._initLayers(newLayers);
    this._initMarkers(newMarkers);
  }

  /**
   * clear & load location layers on map
   * 
   * @private
   * @param {BMLocation[]} locations 
   * 
   * @memberOf MapViewCmp
   */
  private _loadLocations(locations: BMLocation[]) {
    this._layerControl.clearLayers();
    if (!locations) { return; }
    let layers = this._layerControl.loadBuildingFeatures(locations, this._map);
    this._initLayers(layers);
  }

  /**
   * init map
   * 
   * @private
   * 
   * @memberOf MapViewCmp
   */
  private _initMap() {
    this._map = L.map(this.mapTarget.nativeElement, {
      center: [
        30.28084740214,
        120.02401130217
      ],
      zoom: 18,
      maxZoom: 23,
      minZoom: 17
    });
    this._map.removeControl(this._map['zoomControl']);

    L.tileLayer(this.tileUrl, {
      maxZoom: 18,
      attribution: '',
      id: 'mapbox.streets'
    }).addTo(this._map);

    this._mapInited.next(true);
    this.mapInit.emit(this._map);
  }

  private _initLayers(layers: BasArea[]) {
    layers.forEach((l) => {
      l.addEventListener('click', () => {
        this.layerClick.emit(l.location);
      });
    });
  }

  private _initMarkers(markers: BasMarker[]) {
    markers.forEach((marker) => {
      marker.addEventListener('click', () => {
        this.markerClick.emit(marker.device);
      });
    });
  }

  private _loadMarkers(devices: BMThing[]) {
    let markers = this._markerControl
      .loadMarkers(devices, this._map);
    this._initMarkers(markers);
  }

  /**
   * update map view 
   * 
   * @private
   * 
   * @memberOf MapViewCmp
   */
  private _updateView() {
    let bounds = this._layerControl.findBounds(this._map);
    let center: L.LatLngExpression =
      [(bounds.top + bounds.bottom) / 2, (bounds.left + bounds.right) / 2];
    let zoom = this._zoom;
    this._map.setView(center, zoom, {
      animate: true,
      duration: 1000
    });
    // let mapBounds
    //   = new L.LatLngBounds([
    //     bounds.bottom + 0.001,
    //     bounds.left - 0.001
    //   ], [
    //     bounds.top - 0.001,
    //     bounds.right + 0.001
    //   ]);
    // this._map.setMaxBounds(mapBounds);
  }

  /**
   * map tile resource url.
   * subject to be replaced when better resource is found.
   * 
   * @readonly
   * @private
   * @type {string}
   * @memberOf MapViewCmp
   */
  private get tileUrl(): string {
    return 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?'
      + 'access_token=pk.eyJ1IjoieXR5c3p4ZiIsImEiOiJjaXo'
      + '1OHN3OTcwNmJpMzNwaHVycmo5djllIn0.aBzti__T5lS8LDQhjyYsGA';
  }
}
