import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";

import { MedicalDicRoutingModule } from './medical-dic-routing.module';
import { MedicalDicComponent } from './medical-dic.component';
import { DictionaryDataComponent } from './dictionaryData/dictionaryData.component';
import { AddDigitalDictionaryComponent } from './addDigitalDictionary/addDigitalDictionary.component';
import { AddDictionaryDataComponent } from './dictionaryData/addDictionaryData/addDictionaryData.component';
@NgModule({
  imports: [
    CommonModule,
    MedicalDicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  declarations: [MedicalDicComponent,DictionaryDataComponent,AddDigitalDictionaryComponent,AddDictionaryDataComponent]
})
export class MedicalDicModule { }
