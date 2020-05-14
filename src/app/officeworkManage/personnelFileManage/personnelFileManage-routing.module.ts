import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonnelFileManageComponent } from './personnelFileManage.component';
import { AddComponent } from './add/add.component';
import { CheckComponent } from './check/check.component';


const routes: Routes = [
  {
    path: '',
    component: PersonnelFileManageComponent,
  },
  {
    path: "save",
    component: AddComponent
  },
  {
    path: "check",
    component: CheckComponent
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelFileManageRoutingModule {}
