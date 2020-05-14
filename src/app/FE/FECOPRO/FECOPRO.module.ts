/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-03 15:27:33
 * @Description:
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NzIconModule } from 'ng-zorro-antd';
import { FECOPRORoutingModule } from './FECOPRO-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    FECOPRORoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzIconModule
  ],
  providers: [],
  declarations: [ListComponent, AddComponent],
})
export class FECOPROModule { }
