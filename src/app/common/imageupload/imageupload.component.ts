/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-26 17:18:24
 * @Description:
 */
import { OcrImgService } from "./ocrimage/orcimage.service";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Ng2ImgToolsService } from "ng2-img-tools";
import { HttpReqService } from "../service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { ServeConfigService } from "../config/serve-config.service";
@Component({
  selector: "mirr-image",
  templateUrl: "imageupload.component.html",
  styleUrls: ["imageupload.component.css"]
})
export class ImageUploadComponent implements OnInit {
  //图像识别对话框
  ocrImageDialog = false;
  ocrImageLoading = false;
  //图像识别后的内容
  ocrData = [];
  //本地上传按钮loading状态
  localUploadLoading = false;
  //刷新按钮loading状态
  updateLoading = false;

  //控件标题
  @Input()
  title: string;

  //需要展示的图片列表
  @Input()
  imageUrls: Array<string>;
  @Input()
  imageUrlStr: string = "";
  //控制是否需要显示上传按钮
  @Input()
  isShowUploadBtn: any = "true";
  //控制是否需要显示OCR识别按钮
  @Input()
  isShowOcrBtn: any = "true";
  //控制是否需要显示删除图片按钮
  @Input()
  isShowDelBtn: any = "true";
  //是否显示本地上传按钮,升级Angular6.0后原先压缩图片的插件不能使用了，所以先禁掉本地上传
  @Input()
  isShowLocalUploadBtn: string = "true";
  //图片识别结果回调
  @Output()
  onAnalysis = new EventEmitter<string>();

  /**
   * 页面显示的图片路径
   */
  public showImageUrls;
  public qrCode: string;
  //文件上传用的唯一标识
  imgsTagged: string;

  getInputImgs() {
    if (this.imageUrlStr != undefined) {
      if (this.imageUrlStr.indexOf(",") != -1) {
        this.imageUrls = this.imageUrlStr.split(",");
      } else if (this.imageUrlStr.length > 0) {
        this.imageUrls = [];
        this.imageUrls.push(this.imageUrlStr);
      }
    }

    this.showImageUrls = [];
    if (this.imageUrls != undefined) {
      this.showImageUrls = this.imageUrls.slice(0);
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.imageUrls != undefined) {
  //     this.showImageUrls = this.imageUrls.slice(0);
  //   }

  //   if (this.imageUrlStr != undefined) {
  //     if (this.imageUrlStr.indexOf(",") != -1) {
  //       this.showImageUrls = this.imageUrlStr.split(",");
  //     } else if (this.imageUrlStr.length > 0) {
  //       this.showImageUrls= [];
  //       this.showImageUrls.push(this.imageUrlStr);
  //     }
  //   }

  //   setTimeout(()=>{
  //     this.refreshImgList();
  //   },200);
  // }

  constructor(
    private ocrImage: OcrImgService,
    private httpReq: HttpReqService,
    private ng2ImgToolsService: Ng2ImgToolsService,
    private message: NzMessageService,
    private serveConfigService: ServeConfigService
  ) {
    this.onAnalysis.emit("");
  }

  ngOnInit(): void {
    this.getInputImgs();

    let that = this;
    setTimeout(() => {
      this.imgsTagged = new Date().valueOf().toString();
      this.qrCode =
        this.serveConfigService.imgUploadUrl + "?id=" + this.imgsTagged;
      that.refreshImgList();
    }, 200);
  }

  fileChangeListener($event) {
    var image: any = new Image();
    var file: File = $event.target.files[0];
    // var myReader: FileReader = new FileReader();
    // var that = this;
    // myReader.onloadend = function (loadEvent: any) {
    //   image.src = loadEvent.target.result;
    //   let baseImg = image.src;
    //   that.saveImg(baseImg,that.thetype);

    // };
    // myReader.readAsDataURL(file);

    const loadingMessageId = this.message.loading("正在压缩图片..", {
      nzDuration: 0
    }).messageId;
    let that = this;
    this.ng2ImgToolsService.resize([file], 2000, 2000).subscribe(
      result => {
        that.ng2ImgToolsService.compress([result], 0.5).subscribe(
          result => {
            that.message.remove(loadingMessageId);
            let myReader: FileReader = new FileReader();
            myReader.onloadend = function(loadEvent: any) {
              image.src = loadEvent.target.result;
              let baseImg = image.src;
              that.saveImg(baseImg, that.imgsTagged);
            };
            myReader.readAsDataURL(result);
          },
          error => {
            that.message.remove(loadingMessageId);
            that.message.create("error", `图片压缩失败！`);
          }
        );
      },
      error => {
        that.message.remove(loadingMessageId);
        that.message.create("error", `图片压缩失败！`);
      }
    );
  }

  doGetImg(thetype: string) {
    const that = this;
    const param = {
      thetype: thetype
    };
    that.updateLoading = true;
    this.httpReq.post("image/showthetype", null, param, data => {
      that.updateLoading = false;
      if (data["status"] == 200) {
        let imgData = data["data"];
        that.showImageUrls.splice(0, that.showImageUrls.length);
        let uploadedImgInfoList = imgData.slice(0);
        let urls = [];
        for (let i = 0; i < uploadedImgInfoList.length; i++) {
          urls.push(uploadedImgInfoList[i].fileUrl);
        }
        that.getInputImgs();
        that.showImageUrls = that.showImageUrls.concat(urls);
      } else {
        that.message.create("error", data["message"]);
      }
    });
  }

  saveImg(base64Img: string, thetype: string) {
    const that = this;
    const param = {
      base64: base64Img,
      thetype: thetype
    };
    this.httpReq.post("image/dosave", null, param, data => {
      if (data["status"] == 200) {
        that.doGetImg(thetype);
      } else {
        that.message.create("error", data["message"]);
      }
    });
  }

  refreshImgList() {
    this.doGetImg(this.imgsTagged);
  }

  showImg(url) {
    window.open(url);
  }

  ocrImg(url) {
    // this.message.create("warning", "正在努力提高识别率，敬请期待！");
    this.ocrImageLoading = true;
    const that = this;
    this.httpReq.post("image/toWords", null, { url: url }, data => {
      if (data.code == 0) {
        let ocrData = JSON.parse(data["data"]);
        that.ocrImage
          .showDialog(ocrData)
          .then(status => {})
          .catch(() => {});
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  delImg(i) {
    this.showImageUrls.splice(i, 1);
    this.message.create("warning", "点击保存后删除操作才能生效！");
  }
}
