import {
  Component,
  Input,
  Output,
  EventEmitter,
  
} from '@angular/core';
import { StatusTreeNode } from './status-tree-node.interface';

@Component({
  selector: 'sm-status-tree',
  template: `
    <sm-status-tree-node 
      *ngIf="!!root"
      [node]="root" 
      [isRoot]="true" 
      [siblings]=""
      (nodeClick)="nodeClick.emit($event)"
      [componentType]="componentType"
    ></sm-status-tree-node>
  `
})
export class StatusTreeComponent {
  @Input()
  public root: StatusTreeNode;

  @Input()
  public componentType: any; // component type

  @Output()
  public nodeClick: EventEmitter<StatusTreeNode> = new EventEmitter();
}
