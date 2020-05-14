import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SchedulesComponent } from './list/schedules.component';
import { SchedulesRoutingModule } from './schedules-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulesAddComponent } from './add/schedules-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    SchedulesRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [SchedulesComponent, SchedulesAddComponent]
})
export class SchedulesModule {}
