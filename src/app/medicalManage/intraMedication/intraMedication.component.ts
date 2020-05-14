import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  Renderer,
  TemplateRef
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { LocalStorage } from "../../common/service/local.storage";
import { NzMessageService, NzModalService, NzModalRef } from "ng-zorro-antd";
import { ENgxPrintComponent } from "e-ngx-print";
import * as _ from "underscore"; // Underscore工具类
import { ImageUploadComponent } from "src/app/common/imageupload/imageupload.component";

@Component({
  selector: "app-intraMedication",
  templateUrl: "./intraMedication.component.html",
  styleUrls: ["./intraMedication.component.css"]
})
export class IntraMedicationComponent implements OnInit {
  @Input("patientId") patientId: string; // 病人ID

  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = [
    "assets/css/common.css",
    "assets/css/ng-zorro-antd.min.css"
  ]; // 打印内容css文件路径
  public printStyle: string = `
    nz-form-label {
      margin-left: 10px;
    }
    .cusBoxInput {
        outline: none !important;
        border: 1px solid #CCC;
        text-align: center !important;
    }
    .cusLineInput {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        box-shadow: none !important;
        border-bottom: 1px solid #B8C0CD !important;
    }
    .cusNoLineInput {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
    }
    .cusTable {
        border-collapse: collapse;
        border: 1px solid black !important;
    }
    .cusTable td {
        border: 1px solid black !important;
        height: 30px !important;
    }
    div,span,input,table,tr,td{
      font-size: 8pt !important;
    }
    .ftzPt10{
        font-size: 10pt !important;
    }
    .ftzPt11{
        font-size: 11pt !important;
    }
    .ftzPt12{
        font-size: 12pt !important;
    }
    .ftzPt13{
        font-size: 13pt !important;
    }
    .ftzPt14{
        font-size: 14pt !important;
    }
    .ftzPt15{
        font-size: 15pt !important;
    }
    .ftzPt16{
        font-size: 16pt !important;
    }
    .ftzPt17{
        font-size: 17pt !important;
    }
    .ftzPt18{
        font-size: 18pt !important;
    }
    .ftzPt19{
        font-size: 19pt !important;
    }
    .ftzPt20{
        font-size: 20pt !important;
    }
    .ant-input-disabled {
      background-color: transparent !important;
      color:#000 !important;
    }
    @media print {
      /* @page {
        size: 210mm 290mm​;
        margin: 0mm auto;
      } */
      table,tr {
        page-break-before: auto;
        page-break-after: auto;
        page-break-inside: auto;
      }
    }
    `;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件

  public tplModal: NzModalRef;

  public formInfo: any = {
    basicInfo: {},
    sectionOffice: {}
  }; // 数据信息

  public formData: any = {
    id: "", // 序列号（新增时为空）
    inHospitalInfoId: "", // 病人入院信息Id
    url: "", // 静脉用药执行单图片Url
    accountId: "" // 登陆账户Id
  }; // 表单数据

  public isDisable: boolean = false; // 是否禁用
  systemInfo; //系统信息
  @ViewChild("uploadImg")
  public uploadImg: ImageUploadComponent;
  public imgUrlArr: Array<string> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private actRoute: ActivatedRoute, // 获取传递的参数
    private msg: NzMessageService, // 消息提醒
    private localStorage: LocalStorage, //存储
    private el: ElementRef, // 获取DOM元素对象
    private renderer: Renderer, // 对DOM进行操作
    private modalService: NzModalService //提示
  ) {
    const loginUser = this.localStorage.getUser();
    this.formData.accountId = loginUser["data"]["id"];
  }

  ngOnInit() {
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    let paramObj: any;
    try {
      paramObj = JSON.parse(this.actRoute.snapshot.queryParams["data"]); // 传递过来的参数
    } catch (error) {
      new Error("JSON数据转换出错.");
    }
    if (_.isObject(paramObj) && _.isObject(paramObj["inHospitalInfo"])) {
      this.patientId = paramObj["inHospitalInfo"]["id"];
    }
    if (_.isString(this.patientId) && this.patientId.length > 0) {
      this.formData.inHospitalInfoId = this.patientId; // 病人信息id
      this.getInfo(); // 获取详情
    } else {
      this.msg.warning("未获取到老人ID");
    }
  }

  /**
   * 获取详情
   * @memberof IntraMedicationComponent
   */
  public getInfo() {
    const reqObj: any = {};
    reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
    this.httpReq.post("jmyy_report/list", null, reqObj, (data: any) => {
      if (data["code"] == 0) {
        const basObj = this.jsUtil.deepClone(data["data"]["inHospitalInfo"]);
        this.formInfo = basObj;
        if (data["data"]["jmyyReportInfo"]) {
          const backData = this.jsUtil.deepClone(
            data["data"]["jmyyReportInfo"]
          );
          if (!_.isNull(backData.id)) {
            this.formData.id = backData.id;
            const loginUser = this.localStorage.getUser();
            this.formData.accountId = loginUser["data"]["id"];
            this.formData.url = backData.url;
            if (_.isString(backData.url) && backData.url.length > 0) {
              this.imgUrlArr = backData.url.split(",");
            }
          }
        }
      }
    });
  }

  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof IntraMedicationComponent
   */
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.isPrintNow = true; // 正在打印
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof IntraMedicationComponent
   */
  public printComplete() {
    this.isPrintNow = false;
  }

  /**
   * 返回上一页
   * @memberof PatientFilesComponent
   */
  public back() {
    window.history.back();
  }

  /**
   * 保存数据
   * @memberof IntraMedicationComponent
   */
  public saveForm() {
    const sendData = this.jsUtil.deepClone(this.formData);
    this.httpReq.post("jmyy_report/save", null, sendData, (data: any) => {
      if (data["code"] == 0) {
        this.msg.success("保存成功！");
        this.getInfo(); // 获取详情
        this.handleCancel();
      }
    });
  }

  ngAfterContentChecked(): void {
    const loginUser = this.localStorage.getUser();
    const personType = loginUser["data"]["employees"]["personType"];
    if (personType == "0") {
      // 医生
      this.isDisable = true;
      this.toggleDisable(true);
    } else if (personType == "2") {
      // 护士
      this.isDisable = false;
      this.toggleDisable(false);
    }
  }

  /**
   * 切换是否禁用的状态
   * @param {boolean} state false 不禁用，true 禁用
   * @memberof MedicalRecordComponent
   */
  public toggleDisable(state: boolean) {
    if (state) {
      this.el.nativeElement.querySelectorAll("input").forEach(element => {
        this.renderer.setElementAttribute(element, "disabled", "true");
        this.renderer.setElementClass(element, "ant-input-disabled", true);
      });
    }
  }

  /**
   * 显示图片上传模态框
   * @memberof IntraMedicationComponent
   */
  public showModal(
    tplTitle: TemplateRef<{}>,
    tplContent: TemplateRef<{}>,
    tplFooter: TemplateRef<{}>
  ): void {
    this.tplModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 900,
      nzOnOk: () => console.log("Click ok")
    });
  }

  /**
   * 模态框点击确定
   * @memberof IntraMedicationComponent
   */
  public handleOk(): void {
    console.log(this.uploadImg.showImageUrls);
    const imgUrlArr = this.uploadImg.showImageUrls;
    if (_.isArray(imgUrlArr) && imgUrlArr.length > 0) {
      this.formData.url = imgUrlArr.join(",");
      console.log(this.formData);
      this.saveForm(); //保存数据
    } else {
      this.msg.warning("请上传图片！");
    }
  }

  /**
   * 模态框点击取消
   * @memberof IntraMedicationComponent
   */
  public handleCancel(): void {
    this.tplModal.close();
  }
}
