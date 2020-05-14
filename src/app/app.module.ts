/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-03 15:32:58
 * @Description:
 */
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  LocationStrategy,
  HashLocationStrategy,
  APP_BASE_HREF
} from "@angular/common";

import { AppComponent } from "./app.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// Routing Module
import { AppRoutingModule } from "./app.routing";
// Layouts
import { RootLayoutComponent } from "./root-layouts/root-layout.component";

/**
 * 拦截器
 */
import { HttpModule } from "@angular/http";
//echart
// import { AngularEchartsModule } from "ngx-echarts";

import { environment } from "../environments/environment";
import { ServiceWorkerModule } from "@angular/service-worker";

import {
  NgZorroAntdModule,
  NZ_I18N,
  zh_CN,
  NZ_MESSAGE_CONFIG
} from "ng-zorro-antd";
/** 配置 angular i18n **/
import { registerLocaleData } from "@angular/common";
import zh from "@angular/common/locales/zh";
import { HeaderFullScreenComponent } from "./root-layouts/fullscreen.component";
registerLocaleData(zh);
import { ChildrenLayoutComponent } from "./children-layouts/children-layout.component";
import { DelonABCModule, ReuseTabStrategy, ReuseTabService } from "@delon/abc";
import { MirrortechCommonModule } from "./common/common.module";
import { HttpClientModule } from "@angular/common/http";
import { VersionInfoComponent } from "./root-layouts/version/version.component";
import { LoginComponent } from "./login/login.component";
import { RouteReuseStrategy } from "@angular/router";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgbModule.forRoot(),
    HttpModule,
    NgZorroAntdModule.forRoot(),
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production
    }),
    DelonABCModule.forRoot(),
    MirrortechCommonModule,
    HttpClientModule
  ],
  declarations: [
    LoginComponent,
    RootLayoutComponent,
    AppComponent,
    HeaderFullScreenComponent
  ],
  entryComponents: [],
  providers: [
    // { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: "/" },
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: NZ_MESSAGE_CONFIG,
      useValue: {
        nzDuration: 3000,
        nzMaxStack: 7,
        nzPauseOnHover: true,
        nzAnimate: true
      }
    },
    {
      //路由复用
      provide: RouteReuseStrategy,
      useClass: ReuseTabStrategy,
      deps: [ReuseTabService]
    },
    ReuseTabService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
