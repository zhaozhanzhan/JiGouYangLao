import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckRecordCheckComponent } from './check/checkrecord-check.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../common/common.module';
import { ItemOutRoutingModule } from './itemOut-routing.module';
import { ItemOutComponent } from './itemOut.component';
import { CheckOutComponent } from './checkOut/checkOut.component';
import { CheckOutList2Component } from './checkOutList2/checkOutList2.component';
import { CheckOutList1Component } from './checkOutList1/checkOutList1.component';


@NgModule({
  imports: [
    ItemOutRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
  ],
  providers: [],
  declarations: [
    ItemOutComponent,
    CheckRecordCheckComponent,
    CheckOutList1Component,
    CheckOutList2Component,
    CheckOutComponent
  ]
})
export class ItemOutModule {}
