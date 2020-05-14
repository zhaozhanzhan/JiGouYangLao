import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BedCardPrintComponent } from "./bedCardPrint.component";

const routes: Routes = [
  {
    path: "",
    component: BedCardPrintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BedCardPrintModuleRoutingModule {}
