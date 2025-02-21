import { NgModule } from '@angular/core';
import { DstTreeSelectComponent } from './dst-tree-select.component';
import { CommonModule, TitleCasePipe } from '@angular/common';

@NgModule({
  declarations: [
    DstTreeSelectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DstTreeSelectComponent
  ],
  providers:[
    TitleCasePipe
  ]
})
export class DstTreeSelectModule { }
