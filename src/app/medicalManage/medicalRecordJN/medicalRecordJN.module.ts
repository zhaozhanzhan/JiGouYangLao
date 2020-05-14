import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { MedicalRecordJNRoutingModule } from "./medicalRecordJN-routing.module";
import { MedicalRecordJNComponent } from "./medicalRecordJN.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    MedicalRecordJNRoutingModule
  ],
  providers: [],
  declarations: [MedicalRecordJNComponent],
  exports: []
})
export class MedicalRecordJNModule {}
