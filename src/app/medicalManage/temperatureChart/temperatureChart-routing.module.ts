import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TemperatureChartComponent } from "./temperatureChart.component";
const routes: Routes = [
  {
    path: "",
    component: TemperatureChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemperatureChartRoutingModule {}
