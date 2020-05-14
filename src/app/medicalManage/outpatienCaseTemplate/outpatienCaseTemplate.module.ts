import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";

import { DictionaryDataComponent } from "./dictionaryData/dictionaryData.component";
import { AddDictionaryDataComponent } from "./dictionaryData/addDictionaryData/addDictionaryData.component";
import { OutpatienCaseTemplateRoutingModule } from "./outpatienCaseTemplate-routing.module";
import { OutpatienCaseTemplateComponent } from "./outpatienCaseTemplate.component";
@NgModule({
  imports: [
    CommonModule,
    OutpatienCaseTemplateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  declarations: [
    OutpatienCaseTemplateComponent,
    DictionaryDataComponent,
    AddDictionaryDataComponent
  ]
})
export class OutpatienCaseTemplateModule {}
