import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QRCodeModule } from "angular2-qrcode";
import { ElectronicSignComponent } from "./electronicSign.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
@NgModule({
  imports: [CommonModule, FormsModule, QRCodeModule, NgZorroAntdModule],
  declarations: [ElectronicSignComponent],
  exports: [ElectronicSignComponent],
  providers: [],
  entryComponents: [ElectronicSignComponent]
})
export class ElectronicSignModule {}
