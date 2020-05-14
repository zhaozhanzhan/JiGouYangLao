import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { RoleManagerComponent } from "./role.component";
import { RoleManagerRoutingModule } from "./role-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    NgbModule,
    RoleManagerRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [RoleManagerComponent]
})
export class RoleManagerModule {}
