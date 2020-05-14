import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SchedulingComponent } from './scheduling.component';
import { SchedulingRoutingModule } from './scheduling-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MirrortechCommonModule } from '../../../common/common.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ENgxPrintModule } from 'e-ngx-print';

@NgModule({
  imports: [
    SchedulingRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [SchedulingComponent]
})
export class SchedulingModule {}
