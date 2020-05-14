import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserAddComponent } from "./add/user-add.component";
import { UserComponent } from "./user.component";
import { UserRoutingModule } from "./user-routing.module";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { PasswordEditComponent } from "./editPassword/password-edit.component";
import { InfoEditComponent } from "./editInfo/info-edit.component";

@NgModule({
  imports: [
    NgbModule,
    UserRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    UserComponent,
    UserAddComponent,
    PasswordEditComponent,
    InfoEditComponent
  ]
})
export class UserModule {}
