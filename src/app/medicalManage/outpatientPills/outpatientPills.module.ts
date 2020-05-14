import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { DisplayAndSendMedicienComponent } from "./display-and-send-medicien/display-and-send-medicien.component";
import {  GetRelativeInfoService } from "./get-relative-info.service";
import { OutpatientPillsRoutingModule } from "./outpatientPills-routing.module";
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule,
    OutpatientPillsRoutingModule
  ],
  declarations: [DisplayAndSendMedicienComponent],
  providers: [GetRelativeInfoService]
})
export class OutpatientPillsModule {}
