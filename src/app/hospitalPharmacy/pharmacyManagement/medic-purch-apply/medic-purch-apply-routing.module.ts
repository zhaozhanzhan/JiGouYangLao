import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { AddComponent } from "./add/add.component";
import { InStorehouseComponent } from "./in-storehouse/in-storehouse.component";

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
    path: "inStorehouse",
    component: InStorehouseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicPurchApplyRoutingModule {}
