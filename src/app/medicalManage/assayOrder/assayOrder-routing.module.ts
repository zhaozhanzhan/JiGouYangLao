import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssayOrderComponent } from "./assayOrder.component";
const routes: Routes = [
  {
    path: "",
    component: AssayOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssayOrderRoutingModule {}
