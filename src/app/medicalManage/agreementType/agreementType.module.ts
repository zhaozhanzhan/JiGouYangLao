/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 14:16:35
 * @Description:
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AgreementRoutingModule } from './agreementType-routing.module';
import { AgreementTypeComponent } from './agreementType.component';
import { CustomFormModule } from 'src/app/common/custom-form/customForm.module';

@NgModule({
  imports: [
    AgreementRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CustomFormModule
  ],
  providers: [],
  declarations: [AgreementTypeComponent],
})
export class AgreementTypeModule { }
