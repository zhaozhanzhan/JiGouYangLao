import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { AccountRegisterRoutingModule } from './account-register-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { PaidComponent } from './paid/paid.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
  ],
  declarations: [ListComponent, DetailComponent, PaidComponent]
})
export class AccountRegisterModule { }
