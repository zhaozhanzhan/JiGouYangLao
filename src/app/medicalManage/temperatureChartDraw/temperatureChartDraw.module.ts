import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { ChartDrawComponent } from "./chartDraw/chartDraw.component";
import { ENgxPrintModule } from "e-ngx-print";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [ChartDrawComponent],
  entryComponents: [ChartDrawComponent],
  exports: [ChartDrawComponent]
})
export class TemperatureChartDrawModule {}
