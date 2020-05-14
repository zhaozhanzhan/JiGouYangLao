import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NursingGradeComponent } from './nursingGrade.component';
import { NursingGradeRoutingModule } from './nursingGrade-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfoComponent } from './info/info.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    NursingGradeRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [NursingGradeComponent, InfoComponent]
})
export class NursingGradeModule {}
