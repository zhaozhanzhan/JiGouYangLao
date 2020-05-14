import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { AdministrativeOfficesComponent } from "./administrativeOffices.component";
import { AdministrativeOfficesRoutingModule } from "./administrativeOffices-routing.module";
import { AddEditComponent } from "./addEdit/addEdit.component";
import { CheckComponent } from "./check/check.component";


@NgModule({
  imports: [
    NgbModule,
    AdministrativeOfficesRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [
    AddEditComponent,
    CheckComponent
  ],
  declarations: [
    AdministrativeOfficesComponent,
    AddEditComponent,
    CheckComponent
  ]
})
export class AdministrativeOfficesModule {}
