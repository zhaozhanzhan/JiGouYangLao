import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { PharmacyManagementRoutingModule } from "./pharmacy-management-routing.module";
import { DisplayAndSendMedicienComponent } from "./display-and-send-medicien/display-and-send-medicien.component";
import { SummarizatMedicineComponent } from "./summarizat-medicine/summarizat-medicine.component";
import { InHospitolReturnMedicineComponent } from "./in-hospitol-return-medicine/in-hospitol-return-medicine.component";
import {
  GetRelativeInfoService,
  DosageFormPipe
} from "./get-relative-info.service";
import { PharmactConfigComponent } from "./pharmact-config/pharmact-config.component";
import { AddPharmacyComponent } from "./pharmact-config/add-pharmacy/add-pharmacy.component";
import { PharmacyDetailComponent } from "./pharmacy-detail/pharmacy-detail.component";
import { SendMedListComponent } from "./send-med-list/send-med-list.component";
import { InMedListComponent } from "./in-med-list/in-med-list.component";
import { PartiDefListComponent } from "./parti-def-list/parti-def-list.component";
import { MirrortechCommonModule } from "src/app/common/common.module";
import { SplitDrugListComponent } from './split-drug-list/split-drug-list.component';
@NgModule({
  imports: [
    CommonModule,
    MirrortechCommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    PharmacyManagementRoutingModule
  ],
  declarations: [
    DisplayAndSendMedicienComponent,
    SummarizatMedicineComponent,
    InHospitolReturnMedicineComponent,
    PharmactConfigComponent,
    AddPharmacyComponent,
    PharmacyDetailComponent,
    SendMedListComponent,
    DosageFormPipe,
    InMedListComponent,
    PartiDefListComponent,
    SplitDrugListComponent
  ],
  providers: [GetRelativeInfoService]
})
export class PharmacyManagementModule {}
