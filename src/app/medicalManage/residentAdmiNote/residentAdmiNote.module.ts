/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-21 10:29:24
 * @Description:
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ENgxPrintModule } from "e-ngx-print";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ResidentAdmiNoteComponent } from "./residentAdmiNote.component";
import { ResidentAdmiNoteRoutingModule } from "./residentAdmiNote-routing.module";
import { CKEditorModule } from "ngx-ckeditor";
import { CustomFormModule } from "src/app/common/custom-form/customForm.module";
@NgModule({
  imports: [
    CommonModule,
    ENgxPrintModule,
    ResidentAdmiNoteRoutingModule,
    HttpModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
    NgbModule,
    MirrortechCommonModule,
    NgZorroAntdModule,
    CustomFormModule
  ],
  declarations: [ResidentAdmiNoteComponent]
})
export class ResidentAdmiNoteModule { }
