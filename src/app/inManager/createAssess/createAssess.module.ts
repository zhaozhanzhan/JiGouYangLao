import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { CreateAssessComponent } from "./createAssess.component";
import { CreateAssessRoutingModule } from "./createAssess-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ApplyComponent } from "./apply/apply.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { InputTemplateComponentModule } from "../../common/input-template/input-template.module";

@NgModule({
  imports: [
    CreateAssessRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    InputTemplateComponentModule
  ],
  providers: [],
  declarations: [CreateAssessComponent, ApplyComponent]
})
export class CreateAssessModule {}
