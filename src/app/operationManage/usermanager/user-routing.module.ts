import { UserAddComponent } from "./add/user-add.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserComponent } from "./user.component";
import { PasswordEditComponent } from "./editPassword/password-edit.component";
import { InfoEditComponent } from "./editInfo/info-edit.component";

const routes: Routes = [
  {
    path: "",
    component: UserComponent
  },
  {
    path: "add",
    component: UserAddComponent
  },
  {
    path: "edit/:user",
    component: InfoEditComponent
  },
  {
    path: "editPassword/:user",
    component: PasswordEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
