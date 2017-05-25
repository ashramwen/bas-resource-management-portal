import { NgModule } from '@angular/core';
import { ORM_SERVIES } from './services/index';
import { BasORM } from './orm.service';

@NgModule({
  providers: [
    BasORM,
    ORM_SERVIES,
  ]
})
export class BasORMModule { }
