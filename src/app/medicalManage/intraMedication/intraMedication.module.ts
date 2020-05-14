import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { IntraMedicationRoutingModule } from "./intraMedication-routing.module";
import { IntraMedicationComponent } from "./intraMedication.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    IntraMedicationRoutingModule
  ],
  providers: [],
  declarations: [IntraMedicationComponent],
  exports: []
})
export class IntraMedicationModule {}
