import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AdmisRegistRoutingModule } from "./admis-regist-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { AdmisRegistComponent } from "./list/admis-regist.component";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AdmisRegistRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [AdmisRegistComponent, AddComponent, CheckComponent]
})
export class AdmisRegistModule {}
