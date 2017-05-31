import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Location } from '../../../../shared/models/location.interface';

@Component({
  selector: 'br-add-sublocation',
  template: `
    <md-input-container>
      <input mdInput placeholder="添加节点数量" 
        type="number"
        [(ngModel)]="nodeNumber" 
      />
    </md-input-container>
    <button color="primary" md-raised-button (click)="submit()">提交</button>
  `
})
export class BRAddSubLocationCmp {

  public nodeNumber: number;

  constructor(
    private _dialogRef: MdDialogRef<Location>
  ) { }

  public submit() {
    this._dialogRef.close(this.nodeNumber);
  }
}
