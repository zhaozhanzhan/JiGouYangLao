import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ResCaseBaseComponent } from './resCaseBase.component';
import { ResCaseBaseRoutingModule } from './resCaseBase-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfoComponent } from './info/info.component';
import { MirrortechCommonModule } from '../../../common/common.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    ResCaseBaseRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
  ],
  providers: [],
  declarations: [ResCaseBaseComponent, InfoComponent]
})
export class ResCaseBaseModule {}
