import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { MedicalRecordRoutingModule } from "./medicalRecord-routing.module";
import { MedicalRecordComponent } from "./medicalRecord.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    MedicalRecordRoutingModule
  ],
  providers: [],
  declarations: [MedicalRecordComponent],
  exports: [MedicalRecordComponent]
})
export class MedicalRecordModule {}
