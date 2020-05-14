import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { NursingOrderYGRoutingModule } from "./nursingOrderYG-routing.module";
import { NursingOrderYGComponent } from "./nursingOrderYG.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    NursingOrderYGRoutingModule
  ],
  providers: [],
  declarations: [NursingOrderYGComponent],
  exports: []
})
export class NursingOrderYGModule {}
