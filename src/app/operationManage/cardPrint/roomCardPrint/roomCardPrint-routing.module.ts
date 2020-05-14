import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoomCardPrintComponent } from "./roomCardPrint.component";

const routes: Routes = [
  {
    path: "",
    component: RoomCardPrintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomCardPrintRoutingModule {}
