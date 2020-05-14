import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../../common/common.module";
import { BedCardPrintModuleRoutingModule } from "./bedCardPrint-routing.module";
import { BedCardPrintComponent } from "./bedCardPrint.component";
import { ENgxPrintModule } from "e-ngx-print";

@NgModule({
  imports: [
    NgbModule,
    BedCardPrintModuleRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,ENgxPrintModule
  ],
  providers: [],
  declarations: [BedCardPrintComponent]
})
export class BedCardPrintModule {}
