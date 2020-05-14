import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { TemporaryOrderRoutingModule } from "./temporaryOrder-routing.module";
import { TemporaryOrderComponent } from "./temporaryOrder.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    TemporaryOrderRoutingModule
  ],
  providers: [],
  declarations: [TemporaryOrderComponent],
  exports: [TemporaryOrderComponent]
})
export class TemporaryOrderModule {}
