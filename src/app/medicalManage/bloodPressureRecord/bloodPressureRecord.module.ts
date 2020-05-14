import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { MirrortechCommonModule } from "../../common/common.module";
import { BloodPressureRecordComponent } from "./bloodPressureRecord.component";
import { BloodPressureRecordRoutingModule } from "./bloodPressureRecord-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    MirrortechCommonModule,
    BloodPressureRecordRoutingModule
  ],
  providers: [],
  declarations: [BloodPressureRecordComponent],
  exports: [BloodPressureRecordComponent]
})
export class BloodPressureRecordModule {}
