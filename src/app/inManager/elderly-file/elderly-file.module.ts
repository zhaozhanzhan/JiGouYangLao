import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ElderlyFileRoutingModule } from "./elderly-file-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ElderlyFileComponent } from "./list/elderly-file-list.component";
import { ElderInfoComponent } from "./elder-info/elder-info.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { PersonalInfoComponent } from "./personal-info/personal-info.component";
import { AccessoryInfoComponent } from "./accessory-info/accessory-info.component";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ElderlyFileRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    ElderlyFileComponent,
    ElderInfoComponent,
    PersonalInfoComponent,
    AccessoryInfoComponent
  ]
})
export class ElderlyFileModule {}
