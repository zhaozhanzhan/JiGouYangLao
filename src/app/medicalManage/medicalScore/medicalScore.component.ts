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
  selector: "app-medicalScore",
  templateUrl: "./medicalScore.component.html",
  styleUrls: ["./medicalScore.component.css"]
})
export class MedicalScoreComponent implements OnInit {
  @Input() inHospitalInfoId: string; // 病人ID
  @Input("patientId") patientId: string; // 病人ID
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件
  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = ["assets/css/common.css"]; // 打印内容css文件路径
  public printStyle: string = `
    #medicalScore nz-form-label {
      margin-left: 10px;
    }
    #medicalScore .cusBoxInput {
        outline: none !important;
        border: 1px solid #CCC;
        text-align: center !important;
    }
    #medicalScore .cusLineInput {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        box-shadow: none !important;
        border-bottom: 1px solid #B8C0CD !important;
    }
    #medicalScore .cusNoLineInput {
        padding: 0px !important;
        outline: none !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
    }
    #medicalScore .cusTable {
        border-collapse: collapse;
        border: 1px solid black !important;
    }
    #medicalScore .cusTable td {
        border: 1px solid black !important;
        height: 30px !important;
    }
    #medicalScore div,span,input,table,tr,td{
      font-size: 8pt !important;
    }
    #medicalScore .ftzPt10{
        font-size: 10pt !important;
    }
    #medicalScore .ftzPt11{
        font-size: 11pt !important;
    }
    #medicalScore .ftzPt12{
        font-size: 12pt !important;
    }
    #medicalScore .ftzPt13{
        font-size: 13pt !important;
    }
    #medicalScore .ftzPt14{
        font-size: 14pt !important;
    }
    #medicalScore .ftzPt15{
        font-size: 15pt !important;
    }
    #medicalScore .ftzPt16{
        font-size: 16pt !important;
    }
    #medicalScore .ftzPt17{
        font-size: 17pt !important;
    }
    #medicalScore .ftzPt18{
        font-size: 18pt !important;
    }
    #medicalScore .ftzPt19{
        font-size: 19pt !important;
    }
    #medicalScore .ftzPt20{
        font-size: 20pt !important;
    }
    #medicalScore .ant-select-selection--single {
      height: 32px;
      position: relative;
      cursor: pointer;
    }
    #medicalScore .ant-select-selection {
      outline: 0;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      box-sizing: border-box;
      display: block;
      background-color: transparent;
      border-radius: 0px;
      border: 0px;
      transition: all .3s cubic-bezier(.645,.045,.355,1);
    }
    #medicalScore .ant-select-search--inline .ant-select-search__field {
      border-width: 0;
      font-size: 100%;
      height: 100%;
      width: 100%;
      background: 0 0;
      outline: 0;
      border-radius: 0px;
      line-height: 1;
    }
    #medicalScore .ant-select-selection__rendered {
      display: block;
      margin-left: 11px;
      margin-right: 11px;
      position: relative;
      line-height: 30px;
    }
    #medicalScore .ant-select-search__field__placeholder, .ant-select-selection__placeholder {
      position: absolute;
      top: 50%;
      left: 0;
      right: 9px;
      color: #bfbfbf;
      line-height: 20px;
      height: 20px;
      max-width: 100%;
      margin-top: -10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    #medicalScore .ant-select-selection-selected-value {
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
      padding-right: 20px;
    }
    #medicalScore .ant-select-search--inline {
      position: absolute;
      height: 100%;
      width: 100%;
    }
    #medicalScore .ant-select-selection__rendered:after {
      content: '.';
      visibility: hidden;
      pointer-events: none;
      display: inline-block;
      width: 0;
    }
    #medicalScore .ant-select-arrow, .ant-select-selection__clear {
      opacity:0;
    }
    #medicalScore .ant-input-disabled {
      background-color: transparent !important;
      color:#000 !important;
    }
    #medicalScore @media print {
      /* @page {
        size: 210mm 290mm​;
        margin: 0mm auto;
      } */
    #medicalScore table,tr {
        page-break-before: auto;
        page-break-after: auto;
        page-break-inside: auto;
      }
    }
    `;
  // 病人的详情
  patientsBasicInfo = {
    name: "", //名字
    sex: "", //性别
    age: "", //年龄
    bedName: "", //床号
    admissionNo: "", //住院号
    sectionOfficeName: "", //科室
    sickWardName: "", //病区
    attendingDoc: "", //主治医生
    careLevelCase: "", //护理级别
    id: ""
  };

  // 保存病案首页得参数
  medicalRecordObj = {
    inHospitalInfoId: "", //"病人入院信息Id",
    officeEvaluation: "0", //"科评（总得分）",
    hospitalEvaluation: "0", //"院评（总得分）",
    medRecordLevel: "", //"病案等级",
    medRecordAppraiser: "", //"病案评价人",
    appraiserDate: "", //日期
    accountId: "", //"登陆账户Id",
    qualityScoreInfo: []
  };
  data = new Date();
  user; //用户信息
  sumHospitalEvaluation = 0;
  sumOfficeEvaluation = 0;
  printDisabled = false; //是否显示打印

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
    this.getList();
  }

  ngOnInit() {
    this.user = this.localStorage.getUser();
    //获得用户得详细信息
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    this.medicalRecordObj.medRecordAppraiser = this.user.data.name;
    if(this.inHospitalInfoId){
      this.patientId = this.inHospitalInfoId;
      this.printDisabled = false;
      this.isPrintNow = true;
    } 
    if(typeof this.actRoute.snapshot.queryParams["data"] == 'string'){
      this.patientId = JSON.parse(this.actRoute.snapshot.queryParams["data"])["inHospitalInfo"]["id"]; // 传递过来的参数
    }
    if (_.isString(this.patientId) && this.patientId.length > 0) {
      const reqObj: any = {};
      reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
      this.httpReq.post("med_record/list", null, reqObj, (data: any) => {
        if (data["code"] == 0) {
          const result = data["data"];
          this.patientsBasicInfo.name = result.inHospitalInfo.basicInfo.name;
          this.patientsBasicInfo.sex = result.inHospitalInfo.basicInfo.sex;
          this.patientsBasicInfo.age = result.inHospitalInfo.basicInfo.age;
          this.patientsBasicInfo.bedName = result.inHospitalInfo.bedName;
          this.patientsBasicInfo.attendingDoc =
            result.inHospitalInfo.attendingDoc;
          this.patientsBasicInfo.admissionNo =
            result.inHospitalInfo.admissionNo;
          this.patientsBasicInfo.sectionOfficeName =
            result.inHospitalInfo.sectionOffice.name;
          this.patientsBasicInfo.sickWardName =
            result.inHospitalInfo.sickWard.sickWardName;
        }
      });
    } else {
      this.msg.error("未获取到老人ID");
    }
    // this.getList();
    this.getAttendList();
  }

  // 获得保存得病案评分
  getAttendList() {
    this.httpReq.post(
      "/med_record_quality_score/list",
      null,
      { inHospitalInfoId: this.patientId },
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            const result = data["data"];
            console.log(result.medRecordQualityScoreDescList.length);
            if (result.medRecordQualityScoreDescList.length > 0) {
              this.printDisabled = true;
              this.medicalRecordObj.inHospitalInfoId = this.patientId;

              this.medicalRecordObj.officeEvaluation = result.officeEvaluation;
              this.medicalRecordObj.hospitalEvaluation =
                result.hospitalEvaluation;
              this.medicalRecordObj.medRecordLevel = result.medRecordLevel;
              this.medicalRecordObj.appraiserDate = result.appraiserDate;
              this.medicalRecordObj.qualityScoreInfo =
                result.medRecordQualityScoreDescList;
              this.medicalRecordObj.medRecordAppraiser =
                this.medicalRecordObj.medRecordAppraiser +
                "," +
                this.user.data.name;
              console.log(result.medRecordQualityScoreDescList);
              console.log(this.medicalRecordObj.qualityScoreInfo);
            }
          } else {
            this.msg.error(data["message"]);
          }
        }
      }
    );
  }

  // 保存病案评分
  save() {
    this.medicalRecordObj.inHospitalInfoId = this.patientId;
    this.medicalRecordObj.accountId = this.user.data.id;
    this.medicalRecordObj.appraiserDate = this.jsUtil.dateFormat(
      this.data,
      "YYYY-MM-DD"
    );

    this.httpReq.post(
      "/med_record_quality_score/saveOrUpdate",
      null,
      this.medicalRecordObj,
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.msg.success("保存成功");
            this.printDisabled = true;
          } else {
            this.msg.error(data["message"]);
          }
        }
      }
    );
  }

  // 求总分
  sum() {
    this.sumHospitalEvaluation = 0;
    this.sumOfficeEvaluation = 0;
    this.medicalRecordObj.qualityScoreInfo.forEach(e => {
      this.sumHospitalEvaluation += parseInt(e.hospitalEvaluationScore + "");
      this.sumOfficeEvaluation += parseInt(e.officeEvaluationScore + "");
    });

    this.medicalRecordObj.hospitalEvaluation = this.sumHospitalEvaluation + "";
    this.medicalRecordObj.officeEvaluation = this.sumOfficeEvaluation + "";
  }

  getList() {
    for (let index = 0; index < 10; index++) {
      const result = {
        orderSeri: index, //"序号",
        item: "", //"项目",
        deductionAndReason: "", //"扣分及理由",
        officeEvaluationScore: 0, //"科评得分",
        hospitalEvaluationScore: 0 //"院评得分"
      };
      this.medicalRecordObj.qualityScoreInfo.push(result);
    }
  }

  // 打印中
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.printDisabled = false;
    this.isPrintNow = true; // 正在打印
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isPrintNow = false;
    this.printDisabled = true;
  }
}
