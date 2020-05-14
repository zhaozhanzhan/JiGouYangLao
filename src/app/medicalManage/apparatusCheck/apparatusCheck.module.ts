import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { ApparatusCheckRoutingModule } from "./apparatusCheck-routing.module";
import { ApparatusCheckComponent } from "./apparatusCheck.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    ApparatusCheckRoutingModule
  ],
  providers: [],
  declarations: [ApparatusCheckComponent],
  exports: []
})
export class ApparatusCheckModule {}
