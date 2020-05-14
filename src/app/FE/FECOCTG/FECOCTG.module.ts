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
import { FECOCTGRoutingModule } from './FECOCTG-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    FECOCTGRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
  ],
  providers: [],
  declarations: [ListComponent],
})
export class FECOCTGModule { }
