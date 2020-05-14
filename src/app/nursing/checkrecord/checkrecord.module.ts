import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CheckRecordComponent } from './list/checkrecord.component';
import { CheckRecordRoutingModule } from './checkrecord-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckRecordCheckComponent } from './check/checkrecord-check.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    CheckRecordRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [CheckRecordComponent, CheckRecordCheckComponent]
})
export class CheckRecordModule {}
