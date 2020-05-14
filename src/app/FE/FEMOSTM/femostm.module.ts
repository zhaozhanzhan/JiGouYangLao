import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { FEMOSTMRoutingModule } from './femostm-routing.module';
import { ListComponent } from './list/list.component';
import { CloseAccountComponent } from './close-account/close-account.component';
import { FECSMModule } from '../FECSM/FECSM.module';

@NgModule({
  imports: [
    CommonModule,
    FEMOSTMRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    FECSMModule
  ],
  declarations: [ListComponent, CloseAccountComponent]
})
export class FEMOSTMModule { }
