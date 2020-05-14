/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 14:18:36
 * @Description:
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AgreementTemplateRoutingModule } from './agreementTemplate-routing.module';
import { InfoComponent } from './info/info.component';
import { CustomFormModule } from 'src/app/common/custom-form/customForm.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    AgreementTemplateRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CustomFormModule
  ],
  providers: [],
  declarations: [ListComponent, InfoComponent],
})
export class AgreementTemplateModule { }
