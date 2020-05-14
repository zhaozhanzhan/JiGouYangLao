import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ResCaseTypeComponent } from "./resCaseType.component";

const routes: Routes = [
  {
    path: "",
    component: ResCaseTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResCaseTypeRoutingModule {}
