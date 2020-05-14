import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";

import { InfollowService } from './infollow.service'
import { InfollowRoutingModule } from './infollow-routing.module';
import { InfollowComponent } from './infollow/infollow.component';
import { DetailComponent } from './infollow/detail/detail.component';
import { RegisterComponent } from './register/register.component';
import { EverydayComponent } from './everyday/everyday.component';
import { SummaryComponent } from './summary/summary.component';

@NgModule({
  imports: [
    CommonModule,
    InfollowRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule
  ],
  declarations: [InfollowComponent, DetailComponent, RegisterComponent, EverydayComponent, SummaryComponent],
  providers: [InfollowService]
})
export class InfollowModule { }
