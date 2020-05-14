import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";

import { EntrustMedicineService } from "./entrust-medicine.service";

import { EntrustMedicineRoutingModule } from "./entrust-medicine-routing.module";
import { DetailTrustComponent } from "./entrust-medicine/detail-trust/detail-trust.component";
import { TakeMedicineRecordComponent } from "./take-medicine-record/take-medicine-record.component";
import { SendMedicineRecordComponent } from "./send-medicine-record/send-medicine-record.component";
import { EntrustMedicineComponent } from "./entrust-medicine/entrust-medicine.component";

@NgModule({
  imports: [
    CommonModule,
    EntrustMedicineRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule
  ],
  declarations: [
    DetailTrustComponent,
    TakeMedicineRecordComponent,
    SendMedicineRecordComponent,
    EntrustMedicineComponent
  ],
  providers: [EntrustMedicineService]
})
export class EntrustMedicineModule {}
