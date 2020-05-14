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
  selector: "app-medicalRecordJN",
  templateUrl: "./medicalRecordJN.component.html",
  styleUrls: ["./medicalRecordJN.component.css"]
})
export class MedicalRecordJNComponent implements OnInit {
  @Input("patientId") patientId: string; // 病人ID
  systemInfo; //系统信息
  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = ["assets/css/common.css"]; // 打印内容css文件路径
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
    .ant-select-selection--single {
      height: 32px;
      position: relative;
      cursor: pointer;
    }
    .ant-select-selection {
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
    .ant-select-search--inline .ant-select-search__field {
      border-width: 0;
      font-size: 100%;
      height: 100%;
      width: 100%;
      background: 0 0;
      outline: 0;
      border-radius: 0px;
      line-height: 1;
    }
    .ant-select-selection__rendered {
      display: block;
      margin-left: 11px;
      margin-right: 11px;
      position: relative;
      line-height: 30px;
    }
    .ant-select-search__field__placeholder, .ant-select-selection__placeholder {
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
    .ant-select-selection-selected-value {
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
      padding-right: 20px;
    }
    .ant-select-search--inline {
      position: absolute;
      height: 100%;
      width: 100%;
    }
    .ant-select-selection__rendered:after {
      content: '.';
      visibility: hidden;
      pointer-events: none;
      display: inline-block;
      width: 0;
    }
    .ant-select-arrow, .ant-select-selection__clear {
      opacity:0;
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

  public formInfo: any = {
    basicInfo: {}
  }; // 数据信息
  // public formData: any = {
  //   id: "", // 序列号（新增时为空）
  //   inHospitalInfoId: "", // 病人入院基本信息Id
  //   inDateYear: "", // 入院日期(年)
  //   inDateMonth: "", // 入院日期(月)
  //   inDateDay: "", // 入院日期(日)
  //   inCategory: "", // 入院科别
  //   inWard: "", // 入院病区
  //   inDaysPreOperation: "", // 术前住院天数
  //   transferDateYear: "", // 转科日期(年)
  //   transferDateMonth: "", // 转科日期(月)
  //   transferDateDay: "", // 转科日期(日)
  //   transferCategory: "", // 转入科别
  //   transferWard: "", // 转入病区
  //   transferAgainCategory: "", // 再转科别
  //   outDateYear: "", // 出院日期(年)
  //   outDateMonth: "", // 出院日期(月)
  //   outDateDay: "", // 出院日期(日)
  //   outCategory: "", // 出院科别
  //   outWard: "", // 出院病区
  //   stayDaysActually: "", // 实际住院天数
  //   deadDateYear: "", // 死亡日期（年）
  //   deadDateMonth: "", // 死亡日期(月)
  //   deadDateDay: "", // 死亡日期(日)
  //   deadDateHour: "", // 死亡日期(时)
  //   deadDateMinute: "", // 死亡日期(分)
  //   deadReason: "", // 死亡原因
  //   clinicOrEmerDiagnose: "", // 门(急)诊诊断
  //   inSituation: "", // 入院时情况
  //   medRecordDiagnoseInfo: [
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "主要诊断",
  //       outHospitalDiagnoseType: "1",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "其他诊断",
  //       outHospitalDiagnoseType: "2",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "",
  //       outHospitalDiagnoseType: "",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "",
  //       outHospitalDiagnoseType: "",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "",
  //       outHospitalDiagnoseType: "",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "",
  //       outHospitalDiagnoseType: "",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "",
  //       outHospitalDiagnoseType: "",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "",
  //       outHospitalDiagnoseType: "3",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     },
  //     {
  //       diagnoseId: "",
  //       outHospitalDiagnose: "",
  //       outHospitalDiagnoseType: "4",
  //       outHospitalSituation: "",
  //       icd10InfoId: ""
  //     }
  //   ],
  //   inDiagnose: "", // 入院诊断
  //   inDiagnosisDateYear: "", // 入院后确诊日期（年）
  //   inDiagnosisDateMonth: "", // 入院后确诊日期（月）
  //   inDiagnosisDateDay: "", // 入院后确诊日期（日）
  //   pathologyDiagnose: "", // 病理诊断
  //   pathologyCheckNo: "", // 病理检查号
  //   corpseDiagnose: "", // 尸检主要诊断定
  //   corpseDissectionNo: "", // 尸体解剖号
  //   allergyDrugsHBsAg: "", // 过敏药物HBsAg
  //   allergyDrugsHCVAb: "", // 过敏药物HCV-Ab
  //   allergyDrugsHIVAb: "", // 过敏药物HIV-Ab
  //   diagnosticCompliance: "", // 诊断符合情况
  //   radiationPathology: "", // 放射与病理
  //   rescueTimes: "", // 抢救次数
  //   rescueSuccessTimes: "", // 成功次数
  //   categoryDirector: "", // 科主任
  //   directorDoctor: "", // 主(副主)任医师
  //   inChargeDoctor: "", // 主治医师
  //   residentDoctor: "", // 住院医师
  //   refresherDoctor: "", // 进修医师
  //   graduatePracticeDoctor: "", // 研究生实习医师
  //   practiceDoctor: "", // 实习医师
  //   coder: "", // 编码员
  //   medRecordQuality: "", // 病案质量
  //   qualityCtrlDoctor: "", // 质控医师
  //   qualityCtrlNurse: "", // 质控护士
  //   medRecordDateYear: "", // 病案记录日期（年）
  //   medRecordDateMonth: "", // 病案记录日期（月）
  //   medRecordDateDay: "", // 病案记录日期（日）
  //   medRecordOperationInfo: [
  //     {
  //       operationId: "", // 入院手术信息id（新增的手术默认空值）
  //       operationCode: "", // 手术、操作编码
  //       operationDate: "", // 手术、操作日期
  //       operationName: "", // 手术、操作名称
  //       operationDoctor: "", // 手术、操作医师
  //       operationAid1: "", // 手术、操作医师助理一
  //       operationAid2: "", // 手术、操作医师助理二
  //       anesthesiaWay: "", // 麻醉方式
  //       woundHealingGrade: "/",
  //       anesthesiaDoctor: "" // 麻醉医师
  //     }
  //   ],
  //   preDiagnoseOperation: "", // 术前诊断
  //   sfxDiagnoseOperation: "", // 术后诊断
  //   specialCheckNoXRay: "", // 特殊检查号-X线
  //   specialCheckNoCT: "", // 特殊检查号-CT
  //   specialCheckNoMRI: "", // 特殊检查号-MRI
  //   specialCheckNoDSA: "", // 特殊检查号-DSA
  //   firstCaseFlag: "", // 手术、治疗、检查、诊断为本院第一例
  //   followUpClinic: "", // 随诊
  //   followUpClinicDeadlineYear: "", // 随诊期限（年）
  //   followUpClinicDeadlineMonth: "", // 随诊期限（月）
  //   followUpClinicDeadlineDay: "", // 随诊期限（日）
  //   teachingCase: "", // 示教病例
  //   bloodType: "", // 血型
  //   rhBloodType: "", // Rh血型
  //   transfusionReaction: "", // 输血反应
  //   transfusionVarietyType: "", // 输血品种类型，传值为：【红细胞】：1 【血小板】：2 【血浆】：3 【全血】：4 【其他】：5
  //   transfusionVariety: "", // 输血品种
  //   totalFee: "", // 住院费用总计（元）
  //   bedFee: "", // 床费
  //   nurseFee: "", // 护理费
  //   westernMedFee: "", // 西药费
  //   chinesePatentMedFee: "", // 中成药费
  //   ChineseHerbalMedFee: "", // 中草药费
  //   radiateFee: "", // 放射费
  //   assayFee: "", // 化验费
  //   oxygenTherapyFee: "", // 输氧费
  //   bloodTransFee: "", // 输血费
  //   illDiagnoseFee: "", // 诊疗费
  //   operationFee: "", // 手术费
  //   deliverFee: "", // 接生费
  //   otherCheckFee: "", // 其他检查费
  //   anesthesiaFee: "", // 麻醉费
  //   babyFee: "", // 婴儿费
  //   accompanyBedFee: "", // 陪床费
  //   otherFee: "", // 其他费
  //   accountId: "" // 登陆账户Id
  // }; // 表单数据

  public formData: any = {
    id: "", //"主键id（新增时为空）",
    inHospitalInfoId: "", //"病人入院信息Id",
    babyAge: "", //"(年龄不足一周岁的)年龄",
    babyBornWeight: "", //"新生儿出生体重",
    babyInWeight: "", //"新生儿入院体重",
    nowAddress: "", //"现住址",
    nowTel: "", //"电话",
    nowPostCode: "", //"邮政编码",
    inHospitalWay: "", //"入院途径",
    inDateYear: "", //"入院日期（年）",
    inDateMonth: "", //"入院日期（月）",
    inDateDay: "", //"入院日期（日）",
    inCategory: "", //"入院科别",
    inWard: "", //"入院病区",
    transferCategory: "", //"转科科别",
    outDateYear: "", //"出院日期（年）",
    outDateMonth: "", //"出院日期（月）",
    outDateDay: "", //"出院日期（日）",
    outCategory: "", //"出院科别",
    outWard: "", //"出院病区",
    stayDaysActually: "", //"实际住院天数",
    clinicOrEmerDiagnose: "", //"门(急)诊诊断",
    icd10InfoId: "", //"疾病编码id",
    medRecordDiagnoseOutList: [
      {
        diagnoseNewId: "", //"入院诊断信息id（新增的诊断默认空值）",
        diagnoseType: "主要诊断", //诊断类型
        outHospitalDiagnoseA: "", //"出院诊断A",
        icd10InfoAId: "", //"疾病编码id",
        inHospitalConditionA: "", //"入院情况A",
        outHospitalDiagnoseB: "", //"出院诊断B",
        icd10InfoBId: "", //"疾病编码id",
        inHospitalConditionB: "" //"入院情况B"
      },
      {
        diagnoseNewId: "", //"入院诊断信息id（新增的诊断默认空值）",
        diagnoseType: "其他诊断", //诊断类型
        outHospitalDiagnoseA: "", //"出院诊断A",
        icd10InfoAId: "", //"疾病编码id",
        inHospitalConditionA: "", //"入院情况A",
        outHospitalDiagnoseB: "", //"出院诊断B",
        icd10InfoBId: "", //"疾病编码id",
        inHospitalConditionB: "" //"入院情况B"
      },
      {
        diagnoseNewId: "", //"入院诊断信息id（新增的诊断默认空值）",
        diagnoseType: "", //诊断类型
        outHospitalDiagnoseA: "", //"出院诊断A",
        icd10InfoAId: "", //"疾病编码id",
        inHospitalConditionA: "", //"入院情况A",
        outHospitalDiagnoseB: "", //"出院诊断B",
        icd10InfoBId: "", //"疾病编码id",
        inHospitalConditionB: "" //"入院情况B"
      },
      {
        diagnoseNewId: "", //"入院诊断信息id（新增的诊断默认空值）",
        diagnoseType: "", //诊断类型
        outHospitalDiagnoseA: "", //"出院诊断A",
        icd10InfoAId: "", //"疾病编码id",
        inHospitalConditionA: "", //"入院情况A",
        outHospitalDiagnoseB: "", //"出院诊断B",
        icd10InfoBId: "", //"疾病编码id",
        inHospitalConditionB: "" //"入院情况B"
      },
      {
        diagnoseNewId: "", //"入院诊断信息id（新增的诊断默认空值）",
        diagnoseType: "", //诊断类型
        outHospitalDiagnoseA: "", //"出院诊断A",
        icd10InfoAId: "", //"疾病编码id",
        inHospitalConditionA: "", //"入院情况A",
        outHospitalDiagnoseB: "", //"出院诊断B",
        icd10InfoBId: "", //"疾病编码id",
        inHospitalConditionB: "" //"入院情况B"
      },
      {
        diagnoseNewId: "", //"入院诊断信息id（新增的诊断默认空值）",
        diagnoseType: "", //诊断类型
        outHospitalDiagnoseA: "", //"出院诊断A",
        icd10InfoAId: "", //"疾病编码id",
        inHospitalConditionA: "", //"入院情况A",
        outHospitalDiagnoseB: "", //"出院诊断B",
        icd10InfoBId: "", //"疾病编码id",
        inHospitalConditionB: "" //"入院情况B"
      },
      {
        diagnoseNewId: "", //"入院诊断信息id（新增的诊断默认空值）",
        diagnoseType: "", //诊断类型
        outHospitalDiagnoseA: "", //"出院诊断A",
        icd10InfoAId: "", //"疾病编码id",
        inHospitalConditionA: "", //"入院情况A",
        outHospitalDiagnoseB: "", //"出院诊断B",
        icd10InfoBId: "", //"疾病编码id",
        inHospitalConditionB: "" //"入院情况B"
      }
    ],
    externalInjuryPoisonin: "", //"损伤、中毒的外部",
    icd10InfoC: "", //"疾病编码id",
    pathologyDiagnose: "", //"病理诊断",
    pathologyCheckNo: "", //"病理号",
    icd10InfoD: "", //"疾病编码id",
    corpseDiagnose: "", //"尸检主要诊断定",
    corpseDissectionNo: "", //"尸体解剖号",
    isDrugAllergy: "", //"药物过敏",
    allergyDrugs: "", //"过敏药物",
    bloodType: "", //"血型",
    rh: "", //"Rh",
    categoryDirector: "", //"科主任",
    directorDoctor: "", //"主(副主)任医师",
    inChargeDoctor: "", //"主治医师",
    residentDoctor: "", //"住院医师",
    refresherDoctor: "", //"进修医师",
    dutyNuese: "", //"责任护士",
    practiceDoctor: "", //"实习医师",
    coder: "", //"编码员",
    medRecordQuality: "", //"病案质量",
    qualityCtrlDoctor: "", //"质控医师",
    qualityCtrlNurse: "", //"质控护士",
    qualityDateYear: "", //"'质控日期（年）",
    qualityDateMonth: "", //"质控日期（月）",
    qualityDateDay: "", //"质控日期（日）",
    medRecordOperationNewList: [
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      },
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      },
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      },
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      },
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      },
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      },
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      },
      {
        operationId: "", //"手术信息主键id（新增传空）",
        operationCode: "", //"手术、操作编码",
        operationDate: "", //"手术、操作日期",
        operationLevel: "", //"手术级别",
        operationName: "", //"手术、操作名称",
        operationDoctor: "", //"手术、操作医师",
        operationAid1: "", //"手术、操作医师助理一",
        operationAid2: "", //"手术、操作医师助理二",
        anesthesiaWay: "", //"麻醉方式",
        woundHealingGrade: "", //"切口愈合等级",
        anesthesiaDoctor: "" //"麻醉医师"
      }
    ],
    outWay: "", //"离院方式",
    medicalInstitutionName: "", //"拟接收医疗机构名称",
    isAgainInHospital: "", //"是否有出院31天内，再住院计划",
    destination: "", //"目的",
    comaBeforeDays: "", //"颅脑损伤患者昏迷时间，入院前天数",
    comaBeforeHours: "", //"颅脑损伤患者昏迷时间，入院前小时数",
    comaBeforeMintues: "", //"颅脑损伤患者昏迷时间，入院前分钟数",
    comaAfterDays: "", //"颅脑损伤患者昏迷时间，入院后天数",
    comaAfterHours: "", //"颅脑损伤患者昏迷时间，入院后小时数",
    comaAfterMintues: "", //"颅脑损伤患者昏迷时间，入院后分钟数",
    totalFee: "", //"总费用",
    selfPayFee: "", //"自付金额",
    generalMedFee: "", //"一般医疗服务费",
    generalCrueFee: "", //"一般治疗操作费",
    careFee: "", //"护理费",
    generalOtherFee: "", //"其他费用",
    caseDiagnosisFee: "", //"病理诊断费",
    labDiagnosisFee: "", //"实验室诊断费",
    photoDiagnosisFee: "", //"影像学诊断费",
    clinicalDiagnosisFee: "", //"临床诊断项目费",
    noOperationFee: "", //"非手术治疗项目费",
    operationFee: "", //"手术治疗费",
    recoverFee: "", //"康复费",
    traditionalCrueFee: "", //"中医治疗费",
    westernMedFee: "", //"西药费",
    chineseMedFee: "", //"中成药费",
    chineseHerbMedFee: "", //"中草药费",
    bloodFee: "", //"血费",
    albuminFee: "", //"白蛋白类制品费",
    globulinsFee: "", //"球蛋白类制品费",
    bloodCoagulationFee: "", //"凝血因子类制品费",
    cellCoagulationFee: "", //"细胞因子类制品费",
    checkOnceFee: "", //"检查用一次性医用材料费",
    crueOnceFee: "", //"治疗用一次性医用材料费",
    operationOnceFee: "", //"手术用一次性医用材料费",
    otherFee: "", //"其他费",
    comment: "", //"备注",
    accountId: "" //"登录账户id"
  };

  public icdListArr: Array<any> = []; //ICD编码数组
  public isDisable: boolean = false; // 是否禁用
  // public selIsOpen:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private actRoute: ActivatedRoute, // 获取传递的参数
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private msg: NzMessageService, // 消息提醒
    private localStorage: LocalStorage, //存储
    private el: ElementRef, // 获取DOM元素对象
    private renderer: Renderer, // 对DOM进行操作
    private modalService: NzModalService //提示
  ) {}

  ngOnInit() {
    //系统信息
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    const loginUser = this.localStorage.getUser();
    this.formData.accountId = loginUser["data"]["id"];
    let paramObj: any;
    // paramObj = JSON.parse(this.actRoute.snapshot.queryParams["data"]); // 传递过来的参数
    try {
      paramObj = JSON.parse(this.actRoute.snapshot.queryParams["data"]); // 传递过来的参数
    } catch (error) {
      new Error("JSON数据转换出错.");
    }

    if (_.isObject(paramObj) && _.isObject(paramObj["inHospitalInfo"])) {
      this.patientId = paramObj["inHospitalInfo"]["id"];
    }
    this.searchIcd("");
    if (_.isString(this.patientId) && this.patientId.length > 0) {
      this.formData.inHospitalInfoId = this.patientId; // 病人信息id
      const reqObj: any = {};
      reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
      this.httpReq.post("med_record_new/list", null, reqObj, (data: any) => {
        if (data["code"] == 0) {
          const basObj = this.jsUtil.deepClone(data["data"]["inHospitalInfo"]);
          basObj.birthDayYear = basObj.basicInfo.birthDay.split("-")[0];
          basObj.birthDayMonth = basObj.basicInfo.birthDay.split("-")[1];
          basObj.birthDayDay = basObj.basicInfo.birthDay.split("-")[2];

          if (basObj.basicInfo.marriage == "未婚") {
            basObj.basicInfo.marriage = "1";
          } else if (basObj.basicInfo.marriage == "已婚") {
            basObj.basicInfo.marriage = "2";
          } else if (basObj.basicInfo.marriage == "离婚") {
            basObj.basicInfo.marriage = "3";
          } else if (basObj.basicInfo.marriage == "丧偶") {
            basObj.basicInfo.marriage = "4";
          }
          const insurArr = [
            "社会基本医疗保险",
            "商业保险",
            "自费医疗",
            "公费医疗",
            "大病统筹",
            "其他"
          ];
          const idx = insurArr.indexOf(basObj.basicInfo.medicalPayment);
          basObj.basicInfo.medicalPayment = idx + 1;
          this.formInfo = basObj;

          const backData = this.jsUtil.deepClone(data["data"]);
          if (!_.isNull(backData.id)) {
            // const sortArr = _.sortBy(
            //   backData.medRecordDiagnoseList,
            //   "outHospitalDiagnoseType"
            // );
            // const startTwo = sortArr.slice(
            //   sortArr.length - 4,
            //   sortArr.length - 2
            // );
            // sortArr.splice(sortArr.length - 4, 2);
            // const newArr = startTwo.concat(sortArr);

            // for (let i = 0; i < backData.medRecordOperationList.length; i++) {
            //   backData.medRecordOperationList[i]["operationId"] =
            //     backData.medRecordOperationList[i]["id"];
            // }

            backData.inHospitalInfoId = backData.inHospitalInfo.id;
            backData.icd10InfoId = backData.icd10Info.id;
            backData.icd10InfoC = backData.icd10InfoC.id;
            backData.icd10InfoD = backData.icd10InfoD.id;

            for (let i = 0; i < backData.medRecordDiagnoseOutList.length; i++) {
              // backData.medRecordDiagnoseOutList[i]["icd10InfoAId"] =
              //   backData.medRecordDiagnoseOutList[i]["icd10InfoAId"]["id"];

              // backData.medRecordDiagnoseOutList[i]["icd10InfoBId"] =
              //   backData.medRecordDiagnoseOutList[i]["icd10InfoBId"]["id"];

              if (
                !_.isNull(backData.medRecordDiagnoseOutList[i]["icd10InfoAId"])
              ) {
                backData.medRecordDiagnoseOutList[i]["icd10InfoAId"] =
                  backData.medRecordDiagnoseOutList[i]["icd10InfoAId"]["id"];
              } else {
                backData.medRecordDiagnoseOutList[i]["icd10InfoAId"] = "";
              }

              if (
                !_.isNull(backData.medRecordDiagnoseOutList[i]["icd10InfoBId"])
              ) {
                backData.medRecordDiagnoseOutList[i]["icd10InfoBId"] =
                  backData.medRecordDiagnoseOutList[i]["icd10InfoBId"]["id"];
              } else {
                backData.medRecordDiagnoseOutList[i]["icd10InfoBId"] = "";
              }
            }

            this.formData = backData;
            const loginUser = this.localStorage.getUser();
            this.formData.accountId = loginUser["data"]["id"];
          }
        }
      });
    } else {
      this.msg.warning("未获取到老人ID");
    }
  }

  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof MedicalRecordComponent
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
   * @memberof MedicalRecordComponent
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
   * @memberof MedicalRecordComponent
   */
  public changeSelect(
    objArr: Array<any>,
    i: number,
    isEqual: boolean,
    val: string
  ) {
    if (this.isDisable) {
      return;
    }
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
   * 保存数据
   * @memberof MedicalRecordComponent
   */
  public saveForm() {
    console.log(this.formData);
    const sendData = this.jsUtil.deepClone(this.formData);
    this.httpReq.post(
      "med_record_new/saveOrUpdate",
      null,
      sendData,
      (data: any) => {
        if (data["code"] == 0) {
          this.msg.success("保存成功！");
          this.formData.id = data["data"]["id"];
          // this.back();
        }
      }
    );
  }

  /**
   * 检索ICD编码
   * @param {Array<any>} objArr 表格对象数组
   * @param {number} i 索引
   * @param {string} key 键
   * @param {Event} [ev]
   * @memberof MedicalRecordComponent
   */
  public searchIcd(ev: any) {
    const sendObj: any = {};
    sendObj.search = ev;
    this.httpReq.post("ICD10/listLimit", null, sendObj, (data: any) => {
      if (data["code"] == 0) {
        if (_.isArray(data["data"])) {
          this.icdListArr = data["data"];
        }
      }
    });
  }

  /**
   * 获取焦点
   * @memberof MedicalRecordComponent
   */
  public focusSer() {
    this.searchIcd("");
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
      this.isDisable = true;
      this.toggleDisable(true);
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

  // 输入值去数据库匹配数据并显示
  // value表示输入框里面的值，templateType表示要去数据库匹配得，比如主诉：complain
  onInput(value: string): void {
    this.searchIcd(value);
  }
}
