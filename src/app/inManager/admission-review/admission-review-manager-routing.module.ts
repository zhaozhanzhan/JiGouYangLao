import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdmissionReviewManagerComponent } from "./list/admission-review-manager.component";
import { ReviewComponent } from "./review/review.component";
import { CheckComponent } from "./check/check.component";
import { AuditComponent } from "./audit/audit.component";

const routes: Routes = [
  {
    path: "",
    component: AdmissionReviewManagerComponent
  },
  {
    path: "review",
    component: ReviewComponent
  },
  {
    path: "check/:id",
    component: CheckComponent
  },
  {
    path: "audit/:id",
    component: AuditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionReviewRoutingModule {}
