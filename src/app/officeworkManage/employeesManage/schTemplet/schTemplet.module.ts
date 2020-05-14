import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SchTempletComponent } from './list/schTemplet.component';
import { SchTempletRoutingModule } from './schTemplet-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchTempletAddComponent } from './add/schTemplet-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    SchTempletRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [SchTempletComponent, SchTempletAddComponent]
})
export class SchTempletModule {}
