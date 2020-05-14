/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 17:00:01
 * @Description:
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { AddComponent } from "./add/add.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { CustomFormModule } from "src/app/common/custom-form/customForm.module";
import { FERSRoutingModule } from "./FERS-routing.module";

@NgModule({
  imports: [
    FERSRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    CustomFormModule
  ],
  providers: [],
  declarations: [ListComponent, InfoComponent, AddComponent]
})
export class FERSModule {}
