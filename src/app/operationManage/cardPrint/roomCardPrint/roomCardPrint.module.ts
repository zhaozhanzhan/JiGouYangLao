import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../../common/common.module";
import { RoomCardPrintComponent } from "./roomCardPrint.component";
import { RoomCardPrintRoutingModule } from "./roomCardPrint-routing.module";
import { RoomNamePipe } from "./roomname.pipe";
import { ENgxPrintModule } from "e-ngx-print";

@NgModule({
  imports: [
    NgbModule,
    RoomCardPrintRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [RoomCardPrintComponent,RoomNamePipe]
})
export class RoomCardPrintModule {}
