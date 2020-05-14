import { ImageUploadComponent } from "./imageupload.component";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QRCodeModule } from "angular2-qrcode";
import { OcrImageComponent } from "./ocrimage/ocrimage.component";
import { OcrImgService } from "./ocrimage/orcimage.service";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { Ng2ImgToolsModule } from "ng2-img-tools";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QRCodeModule,
    NgZorroAntdModule,
    Ng2ImgToolsModule
  ],
  declarations: [ImageUploadComponent, OcrImageComponent],
  exports: [ImageUploadComponent],
  providers: [OcrImgService],
  entryComponents: [OcrImageComponent]
})
export class ImageUploadModule {}
