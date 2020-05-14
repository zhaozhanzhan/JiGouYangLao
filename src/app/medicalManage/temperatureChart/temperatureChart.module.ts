import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { TemperatureChartComponent } from "./temperatureChart.component";
import { TemperatureChartDrawModule } from "../temperatureChartDraw/temperatureChartDraw.module";
import { TemperatureChartRoutingModule } from "./temperatureChart-routing.module";
import { TemperatureFormComponent } from "./form/form.component";
import { TemperatureTableComponent } from "./table/table.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    TemperatureChartDrawModule,
    TemperatureChartRoutingModule
  ],
  providers: [],
  declarations: [
    TemperatureFormComponent,
    TemperatureChartComponent,
    TemperatureTableComponent
  ],
  exports: [TemperatureChartDrawModule,TemperatureChartComponent]
})
export class TemperatureChartModule {}
