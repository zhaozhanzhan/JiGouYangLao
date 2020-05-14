import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ShpeMemoComponent } from './list/shpememo.component';
import { ShpeMemoRoutingModule } from './shpememo-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
import { JsUtilsService } from '../../common/service/JsUtils.Service';

@NgModule({
  imports: [ShpeMemoRoutingModule, HttpModule, CommonModule, FormsModule, ReactiveFormsModule, NgbModule, NgZorroAntdModule],
  providers: [HttpReqService, JsUtilsService],
  declarations: [ShpeMemoComponent]
})
export class ShpeMemoModule {}
