import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanDayComponent } from './plan-day/plan-day.component';
import { PlanWeekComponent } from './plan-week/plan-week.component';
import { PlanMonthComponent } from './plan-month/plan-month.component';
const routes: Routes = [
  {
    path: '',
    component: PlanListComponent
  },
  {
    path: 'day',
    component: PlanDayComponent
  },
  {
    path: 'week',
    component: PlanWeekComponent
  },
  {
    path: 'month',
    component: PlanMonthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicePlanRoutingModule { }
