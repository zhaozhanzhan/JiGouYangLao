import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { MedicalScoreRoutingModule } from "./medicalScore-routing.module";
import { MedicalScoreComponent } from "./medicalScore.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    MedicalScoreRoutingModule
  ],
  providers: [],
  declarations: [MedicalScoreComponent],
  exports: [MedicalScoreComponent]
})
export class MedicalScoreModule {}
