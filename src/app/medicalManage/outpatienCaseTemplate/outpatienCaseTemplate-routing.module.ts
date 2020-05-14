import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DictionaryDataComponent } from "./dictionaryData/dictionaryData.component";
import { AddDictionaryDataComponent } from "./dictionaryData/addDictionaryData/addDictionaryData.component";
import { OutpatienCaseTemplateComponent } from "./outpatienCaseTemplate.component";
const routes: Routes = [
  {
    path: "",
    component: OutpatienCaseTemplateComponent
  },
  {
    path: "dictionaryData",
    component: DictionaryDataComponent
  },
  {
    path: "dictionaryData/addDictionaryData",
    component: AddDictionaryDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutpatienCaseTemplateRoutingModule {}
