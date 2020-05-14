import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  Renderer
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { LocalStorage } from "../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { ENgxPrintComponent } from "e-ngx-print";
import * as _ from "underscore"; // Underscore工具类

@Component({
  selector: "app-nursingOrder",
  templateUrl: "./nursingOrder.component.html",
  styleUrls: ["./nursingOrder.component.css"]
})
export class NursingOrderComponent implements OnInit {
  @Input() inHospitalInfoId: string; // 病人ID
  @Input("patientId") patientId: string; // 病人ID

  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = [
    "assets/css/common.css",
    "assets/css/ng-zorro-antd.min.css"
  ]; // 打印内容css文件路径
  public printStyle: string = `
    #nursingOrder nz-form-label {
      margin-left: 10px;
    }

    #nursingOrder :host /deep/ .ant-calendar-picker {
      width: 100%;
    }

    #nursingOrder nz-form-label {
        margin-left: 10px;
    }

    #nursingOrder .cusBoxInput {
        outline: none !important;
        border: 1px solid #CCC;
        text-align: center !important;
        margin-left: 5px !important;
        margin-right: 5px !important;
    }
    #nursingOrder .cusLineInput {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        box-shadow: none !important;
    }
    #nursingOrder .cusNoLineInput,
    .cusNoLineTextarea {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
    }
    #nursingOrder .cusNoLineTextarea {
        padding: 5px !important;
    }
    #nursingOrder .cusTable {
        border-collapse: collapse;
        border: 1px solid black !important;
    }
    #nursingOrder .cusTable td {
        border: 1px solid black !important;
        min-height: 30px !important;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    #nursingOrder div,span,input,table,tr,td{
      font-size: 8pt !important;
    }
    #nursingOrder .ftzPt10{
        font-size: 10pt !important;
    }
    #nursingOrder .ftzPt11{
        font-size: 11pt !important;
    }
    #nursingOrder .ftzPt12{
        font-size: 12pt !important;
    }
    #nursingOrder .ftzPt13{
        font-size: 13pt !important;
    }
    #nursingOrder .ftzPt14{
        font-size: 14pt !important;
    }
    #nursingOrder .ftzPt15{
        font-size: 15pt !important;
    }
    #nursingOrder .ftzPt16{
        font-size: 16pt !important;
    }
    #nursingOrder .ftzPt17{
        font-size: 17pt !important;
    }
    #nursingOrder .ftzPt18{
        font-size: 18pt !important;
    }
    #nursingOrder .ftzPt19{
        font-size: 19pt !important;
    }
    #nursingOrder .ftzPt20{
        font-size: 20pt !important;
    }
    #nursingOrder .ant-input-disabled {
      background-color: transparent !important;
      color:#000 !important;
    }
    #nursingOrder @media print {
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

  public formInfo: any = {
    basicInfo: {},
    sectionOffice: {},
    sickWard: {}
  }; // 基础信息

  public tabList: Array<any> = []; // 数据列表
  public formData: Array<any> = []; // 表单数据
  public baseObj: any = {
    id: "", // 主键ID(有则是编辑)
    inHospitalInfoId: "", // 入院信息Id
    date: null, // 日期
    time: null, // 时间
    disease: "", // 病情
    empName: "", // 姓名
    accountId: "" // 账户Id
  };

  public isAdd: boolean = true; // 是否能够新增
  public sendObj: any = {}; // 请求数据条件对象
  public isMore: boolean = true; // 是否有更多数据
  public isLoading: boolean = false; // 是否有更多数据
  public serAll: boolean = false; // 是否正在查询所有

  public isDisable: boolean = false; // 是否禁用

  public isVisible: boolean = false; // 弹出框是否可见

  nullList: Array<any> = []; // 空数据数据列表

  systemInfo; //系统信息
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
    this.baseObj.accountId = loginUser["data"]["id"];
    this.baseObj.empName = loginUser["data"]["empName"];
    this.sendObj = {
      page: 0,
      size: 10,
      totalPages: 1
    };
    console.log(loginUser);
  }

  ngOnInit() {
    this.nullList.length = 22;
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    let paramObj: any;
    if (this.inHospitalInfoId) {
      this.patientId = this.inHospitalInfoId;
      this.isPrintNow = true;
    }
    try {
      paramObj = JSON.parse(this.actRoute.snapshot.queryParams["data"]); // 传递过来的参数
    } catch (error) {
      new Error("JSON数据转换出错.");
    }

    if (_.isObject(paramObj) && _.isObject(paramObj["inHospitalInfo"])) {
      this.patientId = paramObj["inHospitalInfo"]["id"];
    }
    console.log("=============病人ID==========", this.patientId);

    if (_.isString(this.patientId) && this.patientId.length > 0) {
      this.baseObj.inHospitalInfoId = this.patientId; // 病人信息id
      const reqObj: any = {};
      reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
      this.sendObj.inHospitalInfoId = this.patientId;
      this.httpReq.post(
        "recordOfGeneralCare/listPage",
        null,
        this.sendObj,
        (data: any) => {
          if (data["code"] == 0) {
            const basObj = this.jsUtil.deepClone(
              data["data"]["inHospitalInfo"]
            );
            this.formInfo = basObj;
            const backData = this.jsUtil.deepClone(data["data"]);
            if (!_.isNull(backData.id)) {
              // backData.recordexecInfo = backData.diabetesRecordExecList;
              // backData.inHospitalInfoId = backData.inHospitalInfo.id;
              // this.formData = backData;
              // const loginUser = this.localStorage.getUser();
              // this.formData.accountId = loginUser["data"]["id"];
            }
          }
        }
      );

      this.getList("1"); // 获取列表数据
    } else {
      this.msg.warning("未获取到老人ID");
    }
  }

  /**
   * 获取列表数据
   * @memberof NursingOrderComponent
   */
  listAll = [];
  sumLength = 0; //判断获得list列表的数据长度
  public getList(state) {
    this.isLoading = true;
    if (state == "1") {
      this.sumLength = 0;
    }
    this.httpReq.post(
      "recordOfGeneralCare/listAll",
      null,
      { inHospitalInfoId: this.sendObj.inHospitalInfoId },
      (data: any) => {
        if (data["code"] == 0) {
          this.isLoading = false;
          this.tabList = this.tabList.concat(data["data"]["rogList"]);
          this.listAll = [];
          this.sumLength = 0;
          if (this.tabList.length > 0) {
            for (let index = 0; index < this.tabList.length; index++) {
              const e = this.tabList[index];
              const objArr = [];
              const diseaseStr = e.disease;
              const diseaseLength = 18;
              for (let i = 0; i < diseaseStr.length / diseaseLength; i++) {
                const tempInfo = this.jsUtil.deepClone(e);
                let tempStr = diseaseStr.slice(
                  diseaseLength * i,
                  diseaseLength * (i + 1)
                );
                objArr.push(tempStr);
                tempInfo.disease = tempStr;
                this.listAll.push(tempInfo);
              }
              // 如果列表的长度为空
              if (index == 0) {
                //  遍历字符串截取的数组 赋值给listAll
                for (
                  let measNum = 0;
                  measNum < this.listAll.length;
                  measNum++
                ) {
                  if (measNum !== 0) {
                    this.getNull(measNum);
                  }
                }

                if (diseaseStr == "") {
                  this.sumLength = this.sumLength + 1;
                } else {
                  this.sumLength += objArr.length;
                }
              } else {
                for (
                  let listNum = 0;
                  listNum < this.listAll.length;
                  listNum++
                ) {
                  if (listNum > this.sumLength) {
                    this.getNull(listNum);
                  }
                }

                if (diseaseStr == "") {
                  this.sumLength = this.sumLength + 1;
                } else {
                  this.sumLength += objArr.length;
                }
              }
              // for (let index = 0; index < 100000; index = index + 20) {
              //   const str = e.disease.slice(index, index + 20);
              //   if (str != "") {
              //     objArr.push(str);
              //   } else {
              //     objArr1.push(str);
              //   }
              // }
              // e.objArr = objArr;
              // this.sumLength += objArr.length; //判断请求的list里面的有几个长度
            }

            this.nullList.length = 22 - (this.sumLength % 22);
          }
        } else {
        }
      }
    );
  }
  getNull(index) {
    this.listAll[index].date = "";
    this.listAll[index].time = "";
    this.listAll[index].sign = "";
  }
  /**
   * 加载更多
   * @memberof NursingOrderComponent
   */
  public loadingMore() {
    this.sendObj.page++;
    if (this.sendObj.page >= this.sendObj.totalPages) {
      this.sendObj.page--;
      this.isMore = false;
    } else {
      this.isLoading = true;
      this.getList("0");
    }
  }

  /**
   * 加载所有
   * @memberof NursingOrderComponent
   */
  public loadAll() {
    return new Promise((resolve, reject) => {
      this.serAll = true; // 是否正在查询所有
      this.sendObj.page = 0;
      this.httpReq.post(
        "recordOfGeneralCare/listAll",
        null,
        { inHospitalInfoId: this.sendObj.inHospitalInfoId },
        (data: any) => {
          if (data["code"] == 0) {
            this.tabList = [];
            this.tabList = this.tabList.concat(data["data"]["rogList"]);
            setTimeout(() => {
              this.isMore = false;
              this.serAll = false; // 是否正在查询所有
              resolve();
            }, 1000);
          } else {
            this.serAll = false; // 是否正在查询所有
            reject();
          }
        }
      );
    });
  }

  /**
   * 打印所有
   * @memberof NursingOrderComponent
   */
  public printAll() {
    this.loadAll().then(
      () => {
        this.clickPrint();
      },
      () => {
        this.msg.warning("查询所有数据失败");
      }
    );
  }

  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof NursingOrderComponent
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
   * @memberof NursingOrderComponent
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
   * 添加数据
   * @memberof NursingOrderComponent
   */
  public addData() {
    const copyObj: any = this.jsUtil.deepClone(this.baseObj);
    this.formData.push(copyObj);
    this.isAdd = false;
  }

  /**
   * 取消新增
   * @memberof NursingOrderComponent
   */
  public cancelAdd() {
    this.formData = [];
    this.isAdd = true;
  }

  /**
   * 点击确定按钮
   * @memberof DiabetesOrderComponent
   */
  public handleOk(): void {
    const sendData = this.jsUtil.deepClone(this.formData[0]);
    for (const key in sendData) {
      if (sendData.hasOwnProperty(key)) {
        if (key !== "id" && (sendData[key] == null || sendData[key] == "")) {
          this.msg.error("请完善填写数据！");
          return;
        }
      }
    }
    sendData.date = this.jsUtil.dateFormat(sendData.date);
    sendData.time = this.jsUtil.dateFormat(sendData.time, "HH:ss");
    this.isVisible = false;
    this.httpReq.post(
      "recordOfGeneralCare/saveOrUpdate",
      null,
      sendData,
      (data: any) => {
        if (data["code"] == 0) {
          this.msg.success("保存成功！");
          this.isAdd = true;
          this.formData = [];
          this.tabList = [];
          this.isMore = true;
          this.sendObj.page = 0;
          this.getList("1");
          // this.back();
        }
      }
    );
  }

  /**
   * 点击取消按钮
   * @memberof DiabetesOrderComponent
   */
  public handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  /**
   * 保存数据
   * @memberof NursingOrderComponent
   */
  public saveForm() {
    const sendData = this.jsUtil.deepClone(this.formData[0]);
    for (const key in sendData) {
      if (sendData.hasOwnProperty(key)) {
        if (key !== "id" && (sendData[key] == null || sendData[key] == "")) {
          this.msg.error("请完善填写数据！");
          return;
        }
      }
    }
    this.isVisible = true;
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
}
