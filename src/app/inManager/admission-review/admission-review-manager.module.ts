import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AdmissionReviewRoutingModule } from "./admission-review-manager-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReviewComponent } from "./review/review.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { AdmissionReviewManagerComponent } from "./list/admission-review-manager.component";
import { CheckComponent } from "./check/check.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { AuditComponent } from "./audit/audit.component";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AdmissionReviewRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    AdmissionReviewManagerComponent,
    ReviewComponent,
    CheckComponent,
    AuditComponent
  ]
})
export class AdmissionReviewManagerModule {}
