import {
  Component,
  Input,
  HostBinding,
  ViewEncapsulation,
  Output,
  EventEmitter,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  ReflectiveInjector,
  ValueProvider,
  OnInit
} from '@angular/core';
import { StatusTreeNode } from './status-tree-node.interface';

@Component({
  selector: 'sm-status-tree-node-content',
  template: `
    <div class="inner" (click)="!node.disabled && nodeClick.emit(node)">
      <div #template></div>
    </div>
    <md-icon 
      class="collapse-toggle" 
      (click)="collapse.emit(!node.collapse)" 
      *ngIf="!isLeaf"
    >{{node.collapse? 'add': 'remove'}}</md-icon>
  `,
  styleUrls: ['./status-tree-node-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatusTreeNodeContentComponent<T> implements OnInit {
  @Input()
  public node: StatusTreeNode<T>;

  @Input()
  public componentType: any;

  @Output()
  public collapse: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public nodeClick: EventEmitter<StatusTreeNode<T>> = new EventEmitter();

  @ViewChild('template', { read: ViewContainerRef })
  private template: ViewContainerRef;

  @HostBinding('class.is-leaf')
  public get isLeaf() {
    return !this.node.children || this.node.children.length === 0;
  }

  constructor(
    public viewElement: ElementRef,
    private vcRef: ViewContainerRef,
    private _cfr: ComponentFactoryResolver,
  ) { }

  public ngOnInit() {
    this._addCmp(this.componentType, this.node);
  }

  private _addCmp<T>(cmpType: any, data?: StatusTreeNode<T>) {
    let componentFactory = this._cfr.resolveComponentFactory(cmpType);
    let valueProvider: ValueProvider = {
      provide: ComponentRef,
      useValue: new ComponentRef(data)
    };
    let providers = ReflectiveInjector.resolve([valueProvider]);
    let injector = ReflectiveInjector.fromResolvedProviders(providers, this.vcRef.parentInjector);
    this.template.createComponent(componentFactory, 0, injector);
  }
}


export class ComponentRef<T> {
  constructor(
    public data: StatusTreeNode<T>
  ) { }
}
