import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { EmployeesComponent } from "./list/employees.component";
import { EmployeesRoutingModule } from "./employees-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmployeesAddComponent } from "./add/employees-add.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LinkGroupComponent } from "./linkGroup/linkGroup.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../../common/common.module";

@NgModule({
  imports: [
    EmployeesRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [EmployeesComponent, EmployeesAddComponent, LinkGroupComponent]
})
export class EmployeesModule {}
