import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Location } from '../../../../shared/models/location.interface';
import {
  StatusTreeNode
} from '../../../../shared/components/status-tree/status-tree-node.interface';

@Injectable()
export class BRLocationListViewService {
  public currentNodeChanged = new BehaviorSubject(null);
  public currentLocation: Location = null;
  private _currentNode: StatusTreeNode<Location>;


  public get currentNode(): StatusTreeNode<Location> {
    return this._currentNode;
  }

  public set currentNode(value: StatusTreeNode<Location>) {
    console.log('222');
    this._currentNode = value;
    this.currentLocation = this._currentNode.data;
    this.currentNodeChanged.next(value);
  }
}
