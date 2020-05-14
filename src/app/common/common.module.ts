/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-14 16:20:33
 * @Description:
 */
import { NgModule } from "@angular/core";
import { HttpReqService } from "./service/HttpUtils.Service";
import { JsUtilsService } from "./service/JsUtils.Service";
import { FormValidService } from "./service/FormValid.Service";
import { GlobalService } from "./service/GlobalService";
import { AgeCountPipe } from "./pipe/age_pipe";
import { ElectronicSignModule } from "./electronicSign/electronicSign.module";
import { ImageUploadModule } from "./imageupload/imageupload.module";
import { ElectronicSignComponent } from "./electronicSign/electronicSign.component";
import { ImageUploadComponent } from "./imageupload/imageupload.component";
import { InputTemplateComponentModule } from "./input-template/input-template.module";
import { ServeConfigService } from "./config/serve-config.service";
import { LocalStorage } from "./service/local.storage";
import { RoleBtnDirective } from "./directive/roleBtnDirective";
import { ObliqueLineDirective } from "./directive/obliqueLine.directive";
import { HtmlPipe } from "./pipe/html.pipe";
import { SliceStrPipe } from "./pipe/slice-str.pipe";
import { DictPipe } from "./pipe/dictPipe";

@NgModule({
  imports: [
    ElectronicSignModule,
    ImageUploadModule,
    InputTemplateComponentModule
  ],
  declarations: [
    AgeCountPipe,
    HtmlPipe,
    RoleBtnDirective,
    ObliqueLineDirective,
    SliceStrPipe,
    DictPipe
  ],
  exports: [
    AgeCountPipe,
    HtmlPipe,
    ElectronicSignModule,
    ImageUploadModule,
    InputTemplateComponentModule,
    ElectronicSignComponent,
    ImageUploadComponent,
    RoleBtnDirective,
    ObliqueLineDirective,
    SliceStrPipe,
    DictPipe,
  ],
  providers: [
    HttpReqService,
    JsUtilsService,
    FormValidService,
    GlobalService,
    ServeConfigService,
    LocalStorage
  ]
})
export class MirrortechCommonModule { }
