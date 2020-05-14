import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ResCaseComponent } from './resCase.component';
import { ResCaseRoutingModule } from './resCase-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    ResCaseRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [ResCaseComponent]
})
export class ResCaseModule {}
