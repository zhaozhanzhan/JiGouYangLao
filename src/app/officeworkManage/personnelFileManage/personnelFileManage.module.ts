import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { PersonnelFileManageComponent } from "./personnelFileManage.component";
import { PersonnelFileManageRoutingModule } from "./personnelFileManage-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";


@NgModule({
  imports: [
    NgbModule,
    PersonnelFileManageRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    PersonnelFileManageComponent,
    AddComponent,
    CheckComponent
  ]
})
export class PersonnelFileManageModule {}
