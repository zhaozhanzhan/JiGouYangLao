import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LeaveOutComponent } from "./leaveOut.component";
const routes: Routes = [
  {
    path: "",
    component: LeaveOutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveOutRoutingModule {}
