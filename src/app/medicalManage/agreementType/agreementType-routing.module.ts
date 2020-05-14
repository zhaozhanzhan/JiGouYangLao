/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 15:08:24
 * @LastEditTime: 2019-08-22 10:42:53
 * @LastEditors: dakui.tian
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementTypeComponent } from './agreementType.component';


const routes: Routes = [
  {
    path: '',
    component: AgreementTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementRoutingModule { }
