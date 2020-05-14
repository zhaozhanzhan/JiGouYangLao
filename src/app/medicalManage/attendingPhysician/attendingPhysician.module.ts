import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { AttendingPhysicianComponent } from "./attendingPhysician.component";
import { AttendingPhysicianRoutingModule } from "./attendingPhysician-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    AttendingPhysicianRoutingModule
  ],
  providers: [],
  declarations: [AttendingPhysicianComponent],
  exports: []
})
export class AttendingPhysicianModule {}
