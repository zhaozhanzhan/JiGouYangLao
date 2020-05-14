import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ContractTempComponent } from "./editTemp/contractTemp.component";
import { ListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    component: ListComponent
  },
  {
    path: "template/:info",
    component: ContractTempComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractTempRoutingModule {}
