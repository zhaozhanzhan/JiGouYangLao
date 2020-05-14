import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DigitalDictionaryComponent } from './digitalDictionary.component';
import { DictionaryDataComponent } from './dictionaryData/dictionaryData.component';

import { AddDigitalDictionaryComponent } from './addDigitalDictionary/addDigitalDictionary.component';
import { AddDictionaryDataComponent } from './dictionaryData/addDictionaryData/addDictionaryData.component';


const routes: Routes = [
  {
    path: '',
    component: DigitalDictionaryComponent,
  },
  {
    path: 'dictionaryData',
    component: DictionaryDataComponent
  },
  {
    path: 'dictionaryData/addDictionaryData',
    component: AddDictionaryDataComponent
  },
  {
    path: 'addDigitalDictionary',
    component: AddDigitalDictionaryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalDictionaryRoutingModule {}
