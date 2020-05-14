/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 15:08:24
 * @LastEditTime: 2019-09-03 14:18:50
 * @LastEditors: dakui.tian
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';


const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  }, {
    path: 'edit/:info',
    component: AddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FECOPRORoutingModule { }
