/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 15:08:24
 * @LastEditTime: 2019-08-22 15:41:33
 * @LastEditors: dakui.tian
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'info/:info',
    component: InfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementTemplateRoutingModule { }
