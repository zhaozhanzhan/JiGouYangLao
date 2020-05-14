import { RootLayoutComponent } from "./root-layouts/root-layout.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  { path: "nursingHome", redirectTo: "nursingHome/homePage" },
  {
    path: "nursingHome/inManager",
    redirectTo: "nursingHome/inManager/guideFlow"
  },
  {
    path: "nursingHome",
    component: RootLayoutComponent,
    loadChildren: "./root-layouts/root-layout.module#RootLayoutModule"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
