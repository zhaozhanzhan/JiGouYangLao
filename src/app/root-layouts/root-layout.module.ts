import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { RootLayoutRoutingModule } from "./root-layout-routing.module";
import { ChildrenLayoutComponent } from "../children-layouts/children-layout.component";
import { VersionInfoComponent } from "./version/version.component";

@NgModule({
  imports: [
    NgbModule,
    RootLayoutRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  providers: [],

  declarations: [ChildrenLayoutComponent, VersionInfoComponent]
})
export class RootLayoutModule {}
