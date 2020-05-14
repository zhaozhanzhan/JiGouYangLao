import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { AddComponent } from "./add/add.component";
const routes: Routes = [
  {
    path: "",
    component: ListComponent
  },
  {
    path: "add",
    component: AddComponent
  },
  {
    path: "info",
    component: InfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FECSMRoutingModule {}
