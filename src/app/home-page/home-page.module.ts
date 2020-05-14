import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { HomePageModuleRoutingModule } from "./home-page-routing.module";
import { MirrortechCommonModule } from "../common/common.module";
import { HomePageComponent } from "./home-page.component";
import { NgxEchartsModule } from "ngx-echarts";

@NgModule({
  imports: [
    NgbModule,
    HomePageModuleRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    NgxEchartsModule
  ],
  providers: [],
  declarations: [HomePageComponent]
})
export class HomePageModule {}
