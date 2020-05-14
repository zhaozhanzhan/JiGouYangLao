import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { PersonalEffectsComponent } from './list/personalEffects.component';
import { PersonalEffectsRoutingModule } from './personalEffects-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MirrortechCommonModule } from '../../common/common.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    PersonalEffectsRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MirrortechCommonModule,
    NgZorroAntdModule
  ],
  providers: [
  ],
  declarations: [
    PersonalEffectsComponent
  ]
})
export class PersonalEffectsModule { }
