import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
} from '@angular/core';
import { StatusTreeNode } from './status-tree-node.interface';

@Component({
  selector: 'sm-status-tree-node',
  template: `
      <div class="vl"></div>
      <sm-status-tree-node-content 
        [node]="node" 
        (collapse)="whenCollapseChanged($event); "
        (nodeClick)="nodeClick.emit($event)"
        [componentType]="componentType"
      ></sm-status-tree-node-content>
      <div class="tree-children" *ngIf="!node.collapse">
        <sm-status-tree-node
          [componentType]="componentType"
          (nodeClick)="nodeClick.emit($event)"
          [node]="child"
          (collapseChanged)="childCollapseChanged()"
          [siblings]="node.children"
          *ngFor="let child of node.children">
        </sm-status-tree-node>
      </div>
  `,
  styles: [`
    :host {
      min-height: 1.5rem;
      display: flex;
      flex-direction: row;
      position: relative;
    }
    
    :host::before {
      content: " ";
      position: absolute;
      top: 0.75rem;
      left: -30px;
      width: 30px;
      height: 0px;
      border-bottom: dashed 1px #ccc;
      display: block;
    }

    :host .vl {
      content: " ";
      position: absolute;
      top: 0.75rem;
      border-right: dashed 1px #ccc;
      left: -2rem;
      height: 100%;
    }
    :host:last-child > .vl {
      display: none;
    }
  `]
})
export class StatusTreeNodeComponent<T> {
  @Input()
  public node: StatusTreeNode<T>;

  @Input()
  public siblings: Array<StatusTreeNode<T>>;

  @Output()
  public nodeClick: EventEmitter<StatusTreeNode<T>> = new EventEmitter();

  @Input()
  public componentType: any; // component type

  @HostBinding('class.is-root')
  @Input()
  public isRoot: boolean;

  @Output()
  public collapseChanged = new EventEmitter();

  public vlHeight: number = 0;

  constructor(
    private ele: ElementRef
  ) { }

  public whenCollapseChanged(collapse: boolean) {
    this.node.collapse = collapse;
    if (this.node.collapse) {
      this.closeDecendants(this.node);
    }
    this.collapseChanged.emit();
  }

  public childCollapseChanged() {
    this.collapseChanged.emit();
  }

  private closeDecendants(node: StatusTreeNode<T>) {
    node.collapse = true;
    node.children.forEach((c) => {
      this.closeDecendants(c);
    });
  }
}
