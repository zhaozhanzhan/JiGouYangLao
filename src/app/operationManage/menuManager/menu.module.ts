import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { MenuComponent } from "./menu.component";
import { MenuRoutingModule } from "./menu-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    NgbModule,
    MenuRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [MenuComponent]
})
export class MenuModule {}
