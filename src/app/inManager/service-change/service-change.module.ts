import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfoInterviewRoutingModule } from "./service-change-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckComponent } from "./check/check.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ServiceChangeComponent } from "./list/service-change.component";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InfoInterviewRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [ServiceChangeComponent, CheckComponent]
})
export class ServiceChangeModule {}
