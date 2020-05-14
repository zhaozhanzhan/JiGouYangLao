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
  selector: "app-diabetesOrder",
  templateUrl: "./diabetesOrder.component.html",
  styleUrls: ["./diabetesOrder.component.css"]
})
export class DiabetesOrderComponent implements OnInit {
  @Input() inHospitalInfoId: string; // 病人ID
  @Input("patientId") patientId: string; // 病人ID

  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = [
    "assets/css/common.css",
    "assets/css/ng-zorro-antd.min.css"
  ]; // 打印内容css文件路径
  public printStyle: string = `
    #diabetesOrder nz-form-label {
      margin-left: 10px;
    }
    #diabetesOrder .cusBoxInput {
        outline: none !important;
        border: 1px solid #CCC;
        text-align: center !important;
    }
    #diabetesOrder .cusLineInput {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        box-shadow: none !important;
        border-bottom: 1px solid #B8C0CD !important;
    }
    #diabetesOrder .cusNoLineInput {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
    }
    #diabetesOrder .cusTable {
        border-collapse: collapse;
        border: 1px solid black !important;
    }
    #diabetesOrder .cusTable td {
        border: 1px solid black !important;
        height: 30px !important;
    }
    #diabetesOrder div,span,input,table,tr,td{
      font-size: 8pt !important;
    }
    #diabetesOrder .ftzPt10{
        font-size: 10pt !important;
    }
    #diabetesOrder .ftzPt11{
        font-size: 11pt !important;
    }
    #diabetesOrder .ftzPt12{
        font-size: 12pt !important;
    }
    #diabetesOrder .ftzPt13{
        font-size: 13pt !important;
    }
    #diabetesOrder .ftzPt14{
        font-size: 14pt !important;
    }
    #diabetesOrder .ftzPt15{
        font-size: 15pt !important;
    }
    #diabetesOrder .ftzPt16{
        font-size: 16pt !important;
    }
    #diabetesOrder .ftzPt17{
        font-size: 17pt !important;
    }
    #diabetesOrder .ftzPt18{
        font-size: 18pt !important;
    }
    #diabetesOrder .ftzPt19{
        font-size: 19pt !important;
    }
    #diabetesOrder .ftzPt20{
        font-size: 20pt !important;
    }
    #diabetesOrder .ant-input-disabled {
      background-color: transparent !important;
      color:#000 !important;
    }
    #diabetesOrder @media print {
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
    sectionOffice: {}
  }; // 数据信息
  useInfo; //用户信息
  systemInfo; //系统信息
  public baseObj: any = {
    recordexecInfoId: "", // 记录执行信息id（新增的记录默认空值）
    recordDate: "", // 日期
    fastingGlucose: "", // 空腹血糖
    postprandialGlucose: "", // 餐后血糖
    glucoseExtend1: "", // 血糖扩展一
    glucoseExtend2: "", // 血糖扩展二
    glucoseExtend3: "", // 血糖扩展三
    glucoseExtend4: "", // 血糖扩展四
    morningInsulinInjection: "", // 早上胰岛素注射
    morningSign: "", // 早上执行者签名
    middayInsulinInjection: "", // 中午胰岛素注射
    middaySign: "", // 中午执行者签名
    nightInsulinInjection: "", // 夜晚胰岛素注射
    nightSign: "", // 夜晚执行者签名
    otherInsulin: "" // 其他胰岛素信息
  };

  public tabList: Array<any> = []; // 数据列表

  public formData: any = {
    id: "", // 序列号（新增时为空）
    inHospitalInfoId: "", // 病人入院信息Id
    height: "", // 身高
    weight: "", // 体重
    weightStandard: "", // 体重标准
    weightIndex: "", // 体重指数
    kilocaloricRequire: "", // 热量需要（千卡）
    caloricKgRequire: "", // 热量需要（卡公斤）
    insulinType: "", // 胰岛素类型
    accountId: "", // 登陆账户Id
    recordexecInfo: []
    // {
    //   recordexecInfoId: "", // 记录执行信息id（新增的记录默认空值）
    //   recordDate: "", // 日期
    //   fastingGlucose: "", // 空腹血糖
    //   postprandialGlucose: "", // 餐后血糖
    //   glucoseExtend1: "", // 血糖扩展一
    //   glucoseExtend2: "", // 血糖扩展二
    //   glucoseExtend3: "", // 血糖扩展三
    //   glucoseExtend4: "", // 血糖扩展四
    //   morningInsulinInjection: "", // 早上胰岛素注射
    //   morningSign: "", // 早上执行者签名
    //   middayInsulinInjection: "", // 中午胰岛素注射
    //   middaySign: "", // 中午执行者签名
    //   nightInsulinInjection: "", // 夜晚胰岛素注射
    //   nightSign: "", // 夜晚执行者签名
    //   otherInsulin: "" // 其他胰岛素信息
    // }
  }; // 表单数据

  public icdListArr: Array<any> = []; //ICD编码数组

  public isAdd: boolean = true; // 是否能够新增
  public sendObj: any = {}; // 请求数据条件对象
  public isMore: boolean = true; // 是否有更多数据
  public isLoading: boolean = false; // 是否有更多数据
  public serAll: boolean = false; // 是否正在查询所有

  public isDisable: boolean = false; // 是否禁用

  public isVisible: boolean = false; // 弹出框是否可见
  public newAddData: any = {}; // 新增数据对象
  public modalTit: string = "新增数据"; // 弹出框标题名称
  public editState: string = "add"; // 新增或修改状态

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
    this.sendObj = {
      page: 0,
      size: 10,
      totalPages: 1
    };

    // for (let i = 0; i < 9; i++) {
    //   const tableObj: any = this.jsUtil.deepClone(this.baseObj);
    //   this.formData.recordexecInfo.push(tableObj);
    // }
  }

  ngOnInit() {
    //获得用户得详细信息
    this.useInfo = this.localStorage.getUser();
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    let paramObj: any;
    if(this.inHospitalInfoId) this.patientId = this.inHospitalInfoId;
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
      this.formData.inHospitalInfoId = this.patientId; // 病人信息id
      const reqObj: any = {};
      reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
      this.sendObj.inHospitalInfoId = this.patientId;
      this.httpReq.post(
        "diabetes_record/listPage",
        null,
        this.sendObj,
        (data: any) => {
          if (data["code"] == 0) {
            const basObj = this.jsUtil.deepClone(
              data["data"]["inHospitalInfo"]
            );
            if (basObj.basicInfo.sex == "0") {
              basObj.basicInfo.sex = "男";
            } else if (basObj.basicInfo.sex == "1") {
              basObj.basicInfo.sex = "女";
            }
            this.formInfo = basObj;
            const backData = this.jsUtil.deepClone(data["data"]);
            if (!_.isNull(backData.id)) {
              this.formData.weightIndex = backData.weightIndex;
              this.formData.kilocaloricRequire = backData.kilocaloricRequire;
              this.formData.caloricKgRequire = backData.caloricKgRequire;
              this.formData.insulinType = backData.insulinType;
              this.formData.weight = backData.weight;
              this.formData.weightStandard = backData.weightStandard;
              this.formData.height = backData.height;
              // backData.recordexecInfo = backData.diabetesRecordExecList;
              // backData.inHospitalInfoId = backData.inHospitalInfo.id;
              // this.formData = backData;
              const loginUser = this.localStorage.getUser();
              this.formData.accountId = loginUser["data"]["id"];
            }
          }
        }
      );
      if(this.inHospitalInfoId) this.loadAll();else this.getList(); // 获取列表数据
    } else {
      this.msg.warning("未获取到老人ID");
    }
  }

  /**
   * 获取列表数据
   * @memberof NursingOrderComponent
   */
  public getList() {
    this.isLoading = true;
    this.httpReq.post(
      "diabetes_record/listPage",
      null,
      this.sendObj,
      (data: any) => {
        if (data["code"] == 0) {
          this.isLoading = false;
          this.tabList = this.tabList.concat(
            data["data"]["diabetesRecordExecList"]
          );
          this.sendObj.totalPages = data["data"]["totalPage"]; // 总页数
        } else {
          this.sendObj.page--;
        }
      }
    );
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
      this.getList();
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
        "diabetes_record/listAll",
        null,
        { inHospitalInfoId: this.sendObj.inHospitalInfoId },
        (data: any) => {
          if (data["code"] == 0) {
            this.tabList = [];
            this.tabList = this.tabList.concat(
              data["data"]["diabetesRecordExecList"]
            );
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
   * @memberof DiabetesOrderComponent
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
   * @memberof DiabetesOrderComponent
   */
  public printComplete() {
    this.isPrintNow = false;
  }

  /**
   * 改变勾选的出院情况
   * @param {Array<any>} objArr
   * @param {number} index
   * @param {boolean} isEqual
   * @param {string} val
   * @memberof DiabetesOrderComponent
   */
  public changeSelect(
    objArr: Array<any>,
    i: number,
    isEqual: boolean,
    val: string
  ) {
    if (isEqual) {
      // 是否相等，如果相等则取消勾选
      objArr[i]["outHospitalSituation"] = "";
    } else {
      objArr[i]["outHospitalSituation"] = val;
    }
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
    const tableObj: any = this.jsUtil.deepClone(this.baseObj);
    this.formData.recordexecInfo.push(tableObj);
    this.isAdd = false;
  }

  /**
   * 取消新增
   * @memberof NursingOrderComponent
   */
  public cancelAdd() {
    this.formData.recordexecInfo = [];
    this.isAdd = true;
  }

  /**
   * 显示新增数据对话框
   * @param {string} state 新增或修改状态
   * @param {*} [obj] 修改数据对象
   * @memberof DiabetesOrderComponent
   */
  public showModal(state: string, obj?: any): void {
    this.isVisible = true;
    this.editState = state;
    if (state == "add") {
      this.modalTit = "新增数据";
      this.newAddData = this.jsUtil.deepClone(this.baseObj);
    } else if (state == "edit") {
      this.modalTit = "修改数据";
      this.newAddData = this.jsUtil.deepClone(obj);
    }
  }

  /**
   * 点击确定按钮
   * @memberof DiabetesOrderComponent
   */
  public handleOk(): void {
    if (this.editState == "add") {
      const copyObj = this.jsUtil.deepClone(this.newAddData);
      this.formData.recordexecInfo = [];
      this.formData.recordexecInfo.push(copyObj);
      const sendData = this.jsUtil.deepClone(this.formData);
      const dataArr = sendData.recordexecInfo;
      console.log(this.newAddData);
      console.log(this.formData);
      for (let i = 0; i < dataArr.length; i++) {
        if (
          dataArr[i]["recordDate"] == null ||
          dataArr[i]["recordDate"] == ""
        ) {
          this.msg.error("请选择日期！");
          return;
        }
      }
      for (let i = 0; i < dataArr.length; i++) {
        dataArr[i]["recordDate"] = this.jsUtil.dateFormat(
          dataArr[i]["recordDate"]
        );
      }
      console.log(sendData);
      this.isVisible = false;
      this.httpReq.post(
        "diabetes_record/saveOrUpdate",
        null,
        sendData,
        (data: any) => {
          if (data["code"] == 0) {
            this.msg.success("保存成功！");
            this.isAdd = true;
            this.formData.recordexecInfo = [];
            this.tabList = [];
            this.isMore = true;
            this.sendObj.page = 0;
            this.getList();
          }
        }
      );
    } else if (this.editState == "edit") {
      const copyObj = this.jsUtil.deepClone(this.newAddData);
      if (copyObj["recordDate"] == null || copyObj["recordDate"] == "") {
        this.msg.error("请选择日期！");
        return;
      }
      copyObj["recordDate"] = this.jsUtil.dateFormat(copyObj["recordDate"]);
      copyObj.recordexecInfoId = copyObj.id;
      this.isVisible = false;
      this.httpReq.post(
        "diabetes_record/updateOne",
        null,
        copyObj,
        (data: any) => {
          if (data["code"] == 0) {
            this.msg.success("保存成功！");
            this.isAdd = true;
            this.formData.recordexecInfo = [];
            this.tabList = [];
            this.isMore = true;
            this.sendObj.page = 0;
            this.getList();
          }
        }
      );
    }
  }

  /**
   * 点击取消按钮
   * @memberof DiabetesOrderComponent
   */
  public handleCancel(): void {
    this.isVisible = false;
  }

  /**
   * 保存数据
   * @memberof DiabetesOrderComponent
   */
  public saveForm() {
    this.formData.recordexecInfo = [];
    const sendData = this.jsUtil.deepClone(this.formData);
    const dataArr = sendData.recordexecInfo;
    for (let i = 0; i < dataArr.length; i++) {
      if (dataArr[i]["recordDate"] == null || dataArr[i]["recordDate"] == "") {
        this.msg.error("请选择日期！");
        return;
      }
    }
    for (let i = 0; i < dataArr.length; i++) {
      dataArr[i]["recordDate"] = this.jsUtil.dateFormat(
        dataArr[i]["recordDate"]
      );
    }
    console.log(sendData);
    this.httpReq.post(
      "diabetes_record/saveOrUpdate",
      null,
      sendData,
      (data: any) => {
        if (data["code"] == 0) {
          this.msg.success("保存成功！");
          this.isAdd = true;
          this.formData.recordexecInfo = [];
          this.tabList = [];
          this.isMore = true;
          this.sendObj.page = 0;
          this.getList();
        }
      }
    );
  }

  ngAfterContentChecked(): void {
    const loginUser = this.localStorage.getUser();
    const personType = loginUser["data"]["employees"]["personType"];
    if (personType == "0") {
      // 医生
      this.isDisable = false;
      this.toggleDisable(false);
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
