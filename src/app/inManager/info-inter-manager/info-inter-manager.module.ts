import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfoInterRoutingModule } from "./info-inter-manager-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { InfoInterManagerComponent } from "./list/info-inter-manager.component";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InfoInterRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [InfoInterManagerComponent, AddComponent, CheckComponent]
})
export class InfoInterManagerModule {}
