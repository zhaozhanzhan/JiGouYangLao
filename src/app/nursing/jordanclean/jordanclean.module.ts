import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { JordanCleanComponent } from './list/jordanclean.component';
import { JordanCleanRoutingModule } from './jordanclean-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
import { JsUtilsService } from '../../common/service/JsUtils.Service';

@NgModule({
  imports: [JordanCleanRoutingModule, HttpModule, CommonModule, FormsModule, ReactiveFormsModule, NgbModule, NgZorroAntdModule],
  providers: [HttpReqService, JsUtilsService],
  declarations: [JordanCleanComponent]
})
export class JordanCleanModule {}
