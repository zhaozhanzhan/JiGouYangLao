/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-11 15:40:47
 * @Description:
 */
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { BuildingCodeComponent } from "./buildingCode.component";
import { BuildingCodeRoutingModule } from "./buildingCode-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { QRCodeModule } from "angular2-qrcode";
import { ENgxPrintModule } from "e-ngx-print";

@NgModule({
  imports: [
    NgbModule,
    BuildingCodeRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    QRCodeModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [BuildingCodeComponent]
})
export class BuildingCodeModule { }
