import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { PatientFilesRoutingModule } from "./patientFiles-routing.module";
import { RightContentComponent } from "./rightContent/rightContent.component";
import { PatientFilesComponent } from "./patientFiles.component";
import { ReuseTabService, AdReuseTabModule } from "@delon/abc";

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    PatientFilesRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule,
    AdReuseTabModule
  ],
  providers: [],
  declarations: [PatientFilesComponent, RightContentComponent],
  entryComponents: [PatientFilesComponent]
})
export class PatientFilesModule {}
