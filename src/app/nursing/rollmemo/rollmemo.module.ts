import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RollMemoComponent } from './list/rollmemo.component';
import { RollMemoRoutingModule } from './rollmemo-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    RollMemoRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [RollMemoComponent]
})
export class RollMemoModule {}
