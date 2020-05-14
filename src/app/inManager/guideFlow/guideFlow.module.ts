import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { GuideFlowComponent } from "./guideFlow.component";
import { GuideFlowRoutingModule } from "./guideFlow-routing.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    GuideFlowRoutingModule
  ],
  providers: [],
  declarations: [GuideFlowComponent]
})
export class GuideFlowModule {}
