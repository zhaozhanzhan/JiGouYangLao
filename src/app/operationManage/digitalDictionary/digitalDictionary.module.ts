import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { DigitalDictionaryComponent } from "./digitalDictionary.component";
import { DigitalDictionaryRoutingModule } from "./digitalDictionary-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { DictionaryDataComponent } from "./dictionaryData/dictionaryData.component";

import { AddDigitalDictionaryComponent } from "./addDigitalDictionary/addDigitalDictionary.component";
import { AddDictionaryDataComponent } from "./dictionaryData/addDictionaryData/addDictionaryData.component";

@NgModule({
  imports: [
    NgbModule,
    DigitalDictionaryRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    DigitalDictionaryComponent,
    DictionaryDataComponent,
    AddDictionaryDataComponent,
    AddDigitalDictionaryComponent
  ]
})
export class DigitalDictionaryModule {}
