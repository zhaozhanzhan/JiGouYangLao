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
import { AddComponent } from "./add/add.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { CustomFormModule } from "src/app/common/custom-form/customForm.module";
import { FEBILRoutingModule } from "./FEBIL-routing.module";
import { ENgxPrintModule } from "e-ngx-print";
@NgModule({
  imports: [
    FEBILRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    CustomFormModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [ListComponent, AddComponent]
})
export class FEBILModule {}
