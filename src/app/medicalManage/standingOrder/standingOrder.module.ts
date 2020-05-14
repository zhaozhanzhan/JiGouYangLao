import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { StandingOrderRoutingModule } from "./standingOrder-routing.module";
import { StandingOrderComponent } from "./standingOrder.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    StandingOrderRoutingModule
  ],
  providers: [],
  declarations: [StandingOrderComponent],
  exports: [StandingOrderComponent]
})
export class StandingOrderModule {}
