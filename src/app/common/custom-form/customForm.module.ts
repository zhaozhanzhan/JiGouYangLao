/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-28 15:53:16
 * @Description:
 */
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QRCodeModule } from "angular2-qrcode";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { Ng2ImgToolsModule } from "ng2-img-tools";
import { CustomFormComponent } from "./customForm.component";
import { ENgxPrintModule } from "e-ngx-print";
import { CKEditorModule } from 'ngx-ckeditor';
import { ElectronicSignModule } from "../electronicSign/electronicSign.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QRCodeModule,
    NgZorroAntdModule,
    Ng2ImgToolsModule,
    ENgxPrintModule,
    CKEditorModule,
    ElectronicSignModule,
  ],
  declarations: [CustomFormComponent],
  exports: [CustomFormComponent],
  providers: [],
  entryComponents: [CustomFormComponent]
})
export class CustomFormModule { }
