import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ContractTempRoutingModule } from "./contractTemp-routing.module";
import { ContractTempComponent } from "./editTemp/contractTemp.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { HttpClientModule } from "@angular/common/http";
import { ListComponent } from "./list/list.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { ElectronicSignModule } from "../../common/electronicSign/electronicSign.module";
import { CustomFormModule } from "src/app/common/custom-form/customForm.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContractTempRoutingModule,
    NgZorroAntdModule,
    HttpClientModule,
    MirrortechCommonModule,
    ElectronicSignModule,
    CustomFormModule
  ],
  providers: [],
  declarations: [ContractTempComponent, ListComponent],
  exports: []
})
export class ContractTempModule { }
