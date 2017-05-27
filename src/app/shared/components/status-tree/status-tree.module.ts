import { NgModule } from '@angular/core';
import { MatCustomModule } from 'kii-universal-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatusTreeNodeComponent } from './status-tree-node.component';
import { StatusTreeNodeContentComponent } from './status-tree-node-content.component';
import { StatusTreeComponent } from './status-tree.component';

@NgModule({
  imports: [
    MatCustomModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    StatusTreeNodeComponent,
    StatusTreeNodeContentComponent,
    StatusTreeComponent
  ],
  exports: [
    StatusTreeComponent
  ]
})
export class StatusTreeModule { }
