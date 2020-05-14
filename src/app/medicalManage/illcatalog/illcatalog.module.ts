import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CustomFormModule } from 'src/app/common/custom-form/customForm.module';
import { ENgxPrintModule } from "e-ngx-print";
import { IllcatalogRoutingModule } from './illcatalog-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { PrintAllComponent } from './print-all/print-all.component';
import { FirstCareModule } from '../first-care/first-care.module';
import { MedicalRecordModule } from '../medicalRecord/medicalRecord.module';
import { TemperatureChartModule } from '../temperatureChart/temperatureChart.module';
import { DiabetesOrderModule } from '../diabetesOrder/diabetesOrder.module';
import { BloodPressureRecordModule } from '../bloodPressureRecord/bloodPressureRecord.module';
import { StandingOrderModule } from '../standingOrder/standingOrder.module';
import { TemporaryOrderModule } from '../temporaryOrder/temporaryOrder.module';
import { NursingOrderModule } from '../nursingOrder/nursingOrder.module';
import { MedicalScoreModule } from '../medicalScore/medicalScore.module';

@NgModule({
  imports: [
    CommonModule,
    IllcatalogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CustomFormModule,
    ENgxPrintModule,
    FirstCareModule,
    MedicalRecordModule,
    TemperatureChartModule,
    DiabetesOrderModule,
    BloodPressureRecordModule,
    StandingOrderModule,
    TemporaryOrderModule,
    NursingOrderModule,
    MedicalScoreModule
  ],
  declarations: [ListComponent, DetailComponent, PrintAllComponent]
})
export class IllcatalogModule { }
