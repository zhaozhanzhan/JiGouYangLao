/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 17:10:47
 * @Description:
 */
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { NzMessageService } from "../../../../node_modules/ng-zorro-antd";
import { ServeConfigService } from "../config/serve-config.service";
import { HttpReqService } from "../service/HttpUtils.Service";
@Component({
  selector: "mirr-electronicSign",
  templateUrl: "electronicSign.component.html",
  styleUrls: ["electronicSign.component.css"]
})
export class ElectronicSignComponent implements OnInit {
  isButtonLoading = false;

  isShowBrCode = false;

  imgUrlValue: string;
  @Output()
  imgUrlChange = new EventEmitter();

  @Input()
  get imgUrl(): any {
    return this.imgUrlValue;
  }
  set imgUrl(val) {
    this.imgUrlValue = val;
    this.imgUrlChange.emit(this.imgUrlValue);
  }

  @Input()
  isShowSign = true;

  @Output()
  refreshUrl = new EventEmitter<any>();

  public qrCode: string;

  //文件上传用的唯一标识
  imgsTaggedTemp: string;
  @Output()
  imgsTaggedChange = new EventEmitter();
  @Input()
  get imgsTagged() {
    return this.imgsTaggedTemp;
  }
  set imgsTagged(val) {
    if (val && val !== null && val.length > 0) {
      this.imgsTaggedTemp = val;
    } else {
      this.imgsTagged = new Date().valueOf().toString();
    }
    this.imgsTaggedChange.emit(this.imgsTaggedTemp);
    this.qrCode = this.serveConfigService.mobileSignUrl + this.imgsTagged;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.imgsTagged = new Date().valueOf().toString();
      this.qrCode = this.serveConfigService.mobileSignUrl + this.imgsTagged;
      this.refreshImgList();
    });
  }
  ngOnInit(): void {

  }

  constructor(
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private serveConfigService: ServeConfigService
  ) {

  }


  doGetImg(thetype: string) {
    const that = this;
    this.isButtonLoading = true;
    that.isButtonLoading = true;
    const param = { thetype: thetype };
    this.httpReq.post("image/showthetype", null, param, data => {
      that.isButtonLoading = false;
      if (data["status"] == 200) {
        let imgData = data["data"];
        let imgObj = imgData[imgData.length - 1];
        if (imgObj) {
          that.imgUrl = imgObj.fileUrl;
          that.isShowBrCode = false;
          that.refreshUrl.emit(that.imgUrl);
        }
      } else {
        that.message.create("error", data["message"]);
      }
    });
  }

  refreshImgList() {
    if (this.imgsTagged && this.imgsTagged !== null && this.imgsTagged.length > 0)
      this.doGetImg(this.imgsTagged);
  }

  showImg(url) {
    window.open(url);
  }
}
