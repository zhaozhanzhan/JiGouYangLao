import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { ServiceCareRoutingModule } from './service-care-routing.module';
import { CarePlanComponent } from './care-plan/care-plan.component';
import { PlanDayComponent } from './plan-day/plan-day.component';
import { PlanWeekComponent } from './plan-week/plan-week.component';
import { PlanMonthComponent } from './plan-month/plan-month.component';
import { PlanImmediateComponent } from './plan-immediate/plan-immediate.component';
@NgModule({
  imports: [
    CommonModule,
    ServiceCareRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule
  ],
  declarations: [CarePlanComponent, PlanDayComponent, PlanWeekComponent, PlanMonthComponent, PlanImmediateComponent]
})
export class ServiceCareModule { }
