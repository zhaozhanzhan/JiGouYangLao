import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ENgxPrintModule } from "e-ngx-print";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ProgressNoteRoutingModule } from "./progressNote-routing.module";
import { ProgressNoteComponent } from "./progressNote.component";
import { CKEditorModule } from "ngx-ckeditor";
import { CustomFormModule } from "src/app/common/custom-form/customForm.module";
@NgModule({
  imports: [
    CommonModule,
    ENgxPrintModule,
    ProgressNoteRoutingModule,
    HttpModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
    NgbModule,
    MirrortechCommonModule,
    NgZorroAntdModule,
    CustomFormModule
  ],
  declarations: [ProgressNoteComponent]
})
export class ProgressNoteModule { }
