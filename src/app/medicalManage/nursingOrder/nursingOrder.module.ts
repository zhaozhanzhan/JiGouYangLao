import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { NursingOrderRoutingModule } from "./nursingOrder-routing.module";
import { NursingOrderComponent } from "./nursingOrder.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    NursingOrderRoutingModule
  ],
  providers: [],
  declarations: [NursingOrderComponent],
  exports: [NursingOrderComponent]
})
export class NursingOrderModule {}
