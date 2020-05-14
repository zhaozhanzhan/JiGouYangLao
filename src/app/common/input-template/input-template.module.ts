import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputTemplateComponent } from "./input-template.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
@NgModule({
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  declarations: [InputTemplateComponent],
  exports: [InputTemplateComponent],
  providers: [InputTemplateComponent],
  entryComponents: [InputTemplateComponent]
})
export class InputTemplateComponentModule {}
