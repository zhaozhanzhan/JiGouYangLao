import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HandoverSheetRoutingModule } from './handoversheet-routing.module';
import { MirrortechCommonModule } from '../../common/common.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HandoverSheetComponent } from './list/handoversheet.component';
@NgModule({
  imports: [
    HandoverSheetRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [HandoverSheetComponent]
})
export class HandoverSheetModule {}
