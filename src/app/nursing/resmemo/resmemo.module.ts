import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ResMemoComponent } from './list/resmemo.component';
import { ResMemoRoutingModule } from './resmemo-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckComponent } from './check/check.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ResMemoItemPipe } from './resMemoItem_pipe';
import { MirrortechCommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    ResMemoRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [ResMemoComponent, CheckComponent, ResMemoItemPipe]
})
export class ResMemoModule {}
