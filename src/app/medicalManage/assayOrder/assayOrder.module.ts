import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { AssayOrderRoutingModule } from "./assayOrder-routing.module";
import { AssayOrderComponent } from "./assayOrder.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    AssayOrderRoutingModule
  ],
  providers: [],
  declarations: [AssayOrderComponent],
  exports: []
})
export class AssayOrderModule {}
