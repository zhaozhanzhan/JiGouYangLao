/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-06 15:13:19
 * @Description:
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ContractTempComponent } from "./editTemp/contractTemp.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { HttpClientModule } from "@angular/common/http";
import { ListComponent } from "./list/list.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { ElectronicSignModule } from "../../common/electronicSign/electronicSign.module";
import { MedicalEditorTempRoutingModule } from "./medicalEditorTemp-routing.module";
import { CKEditorModule } from "ngx-ckeditor";
import { CustomFormModule } from "src/app/common/custom-form/customForm.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgZorroAntdModule,
    HttpClientModule,
    MirrortechCommonModule,
    ElectronicSignModule,
    MedicalEditorTempRoutingModule,
    CustomFormModule
  ],
  providers: [],
  declarations: [ContractTempComponent, ListComponent],
  exports: []
})
export class MedicalEditorTempModule { }
