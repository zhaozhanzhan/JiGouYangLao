import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DisplayAndSendMedicienComponent } from "./display-and-send-medicien/display-and-send-medicien.component";
const routes: Routes = [
  {
    path: "DsMedicien",
    component: DisplayAndSendMedicienComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutpatientPillsRoutingModule {}
