import { NgModule } from '@angular/core';
import { DstTreeSelectComponent } from './dst-tree-select.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DstTreeSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    DstTreeSelectComponent
  ],
  providers:[
    TitleCasePipe
  ]
})
export class DstTreeSelectModule { }
