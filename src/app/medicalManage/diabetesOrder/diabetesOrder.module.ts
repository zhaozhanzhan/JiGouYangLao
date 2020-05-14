import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { DiabetesOrderRoutingModule } from "./diabetesOrder-routing.module";
import { DiabetesOrderComponent } from "./diabetesOrder.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    DiabetesOrderRoutingModule
  ],
  providers: [],
  declarations: [DiabetesOrderComponent],
  exports: [DiabetesOrderComponent]
})
export class DiabetesOrderModule {}
