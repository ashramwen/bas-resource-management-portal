import { Component } from '@angular/core';
import { StatusTreeNode } from '../../../../shared/components/status-tree/status-tree-node.interface';
import { Location } from '../../../../shared/models/location.interface';
import { LocationService } from '../../../../shared/providers/resource-services/location.service';
import { BRLocationListItemCmp } from './list-item.component';
import { BRLocationListViewService } from './list-view.service';

@Component({
  selector: 'br-listview',
  template: `
    <md-card class="tree-container">
      <sm-status-tree [root]="nodeRoot" [componentType]="itemCmpType"></sm-status-tree>
    </md-card>
    <md-card class="editor-container">
      <md-card-content>
        <br-location-editor></br-location-editor>
      </md-card-content>
    </md-card>
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: row;
      white-space: nowrap;
    }
    .tree-container{
      width: 38.2%;
      overflow: auto;
      border-right: solid 1px #eee;
    }

    sm-status-tree{
      min-width: 100%;
      min-height: 100%;
      z-index: 1;
      position: absolute;
      display:block;
      left: 0px;
      top: 0px;
      background: linear-gradient(0deg, white 25%,
        #eee 25%, #eee 50%, 
        white 50%, white 75%, 
        #eee 75%);
      background-size: 500px 96px;
    }

    .editor-container {
      flex: 1;
    }
  `],
  providers: [BRLocationListViewService]
})
export class BRLocationListViewCmp {

  public nodeRoot: StatusTreeNode = {
    children: [],
    collapse: true,
    data: null,
    disabled: false
  };

  public itemCmpType = BRLocationListItemCmp;

  constructor(
    private _locationService: LocationService,
    private _listViewService: BRLocationListViewService,
  ) {
    this._loadData();
  }

  private _loadData() {
    let root = this._locationService.root;
    this.nodeRoot = this._retrivalTree(root);
    if (this.nodeRoot) {
      this.nodeRoot.collapse = false;
    }
  }

  private _retrivalTree(location: Location) {
    let node = this._createNode(location);
    node.children = location.subLocations.map((l) => this._retrivalTree(l));

    return node;
  }

  private _createNode(location): StatusTreeNode {
    return {
      children: [],
      collapse: true,
      data: location,
      disabled: false
    };
  }
}
