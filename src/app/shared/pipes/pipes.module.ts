import { NgModule } from '@angular/core';
import { SHARED_PIPES } from './index';

@NgModule({
  declarations: [SHARED_PIPES],
  exports: [SHARED_PIPES],
})
export class PipesModule { }
