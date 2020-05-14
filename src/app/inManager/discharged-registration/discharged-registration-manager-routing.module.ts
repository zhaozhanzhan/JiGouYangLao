import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DischargedRegistrationManagerComponent } from "./list/discharged-registration-manager.component";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { LookComponent } from "./look/look.component";
const routes: Routes = [
  {
    path: "",
    component: DischargedRegistrationManagerComponent
  },
  {
    path: "save",
    component: AddComponent
  },
  {
    path: "check/:id",
    component: CheckComponent
  }
  ,
  {
    path: "look/:id",
    component: LookComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DischargedRegistrationRoutingModule {}
