import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ResidentAdmiNoteComponent } from "./residentAdmiNote.component";
const routes: Routes = [
  {
    path: "",
    component: ResidentAdmiNoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidentAdmiNoteRoutingModule {}
