import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";

import { ServicePlanRoutingModule } from './service-plan-routing.module';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanDayComponent } from './plan-day/plan-day.component';
import { PlanWeekComponent } from './plan-week/plan-week.component';
import { PlanMonthComponent } from './plan-month/plan-month.component';

@NgModule({
  imports: [
    CommonModule,
    ServicePlanRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule
  ],
  declarations: [PlanListComponent, PlanDayComponent, PlanWeekComponent, PlanMonthComponent]
})
export class ServicePlanModule { }
