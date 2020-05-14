import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProgressNoteComponent } from "./progressNote.component";
const routes: Routes = [
  {
    path: "",
    component: ProgressNoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressNoteRoutingModule {}
