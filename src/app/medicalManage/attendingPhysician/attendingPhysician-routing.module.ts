import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AttendingPhysicianComponent } from "./attendingPhysician.component";
const routes: Routes = [
  {
    path: "",
    component: AttendingPhysicianComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendingPhysicianRoutingModule {}
