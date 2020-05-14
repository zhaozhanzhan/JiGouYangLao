import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "src/app/common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import * as _ from "underscore";
@Component({
  selector: "app-patientDetails",
  templateUrl: "./patientDetails.component.html",
  styleUrls: ["./patientDetails.component.css"]
})
export class PatientDetailsComponent implements OnInit {
  visible = false; //查看历史病历显示
  drugVisible = false; //查看用药跟踪
  isShowCaseHistory = false; // 打开个人档案历史病历
  isShowDrugHistory = false; // 打开个人档案用药跟踪
  isShowOldDialog = false; //选择药品的弹出框显示
  isShowDrugDetails = false; //添加药品时显示的药品详情
  isShowDrug = false; //选择药房的显示
  sureLoading = false; //添加药品确定按钮的加载
  isShowOutForDoctor = false; //选择是否外出就诊后，显示外出时间，外出医院等信息和处理结果是否可以填写，如果是外出就医就不能填写，如果不是外出就医，医生可以填写
  mainSuitList: string[] = []; //主诉得列表
  healthCheckCfgList: string[] = []; //获得体格检查得配置项
  unitList = []; //单位的列表
  usageList = []; //用法的列表
  frequencyList = []; //用法频次的列表
  drugFrequencyList = []; //用药频次的列表
  drugAllList = []; //获得所有得用药列表
  delegationFrequencyList = []; //住院归来中添加药品得频次
  pharmacyDrugObjLoading = false; //用药列表得加载状态
  state = ""; //状态判断是添加还是编辑，add是添加状态，edit是编辑状态
  useInfo; //用户信息
  prescriptionNo; //第几个处方得
  prescriptionNoState = ""; //处方类型
  index; //判断是第几个处方
  detailsI; //第几条数据
  isShowEndHospital = false; //查看病历详情和处方详情
  historyNowList = []; //现病史
  healthCheckUpList = []; //体格检查
  laboratoryList = []; //器械检查
  tentativeDiaginosisList = []; //初步诊断
  clinicHosiptalList = []; //就诊医院
  dealResultList = []; //处理结果
  drugIndex; //添加药品列表的下标
  historicalRecordParArr = []; //历史病历数据
  addTakeIsVisible = false; //住院归来中添加药品得弹出框显示
  hospitalDrugNameList = []; //住院归来中得药品列表
  outPaintDrugList = []; //住院药品列表
  takeMedLoading = false; //住院时间药品列表加载
  logoImgsStr; //出院记录的图片
  isShowHospitalStay = false; //是否显示住院归来详情
  isShowResultHandling = true; //处理结果是否显示
  @ViewChild("logoImage")
  logoImage: any;
  // 获取传递过来得参数,显示病人得基本信息
  obj = {
    id: "", //老人得ID
    name: "", //名字
    sex: "", //性别
    age: "", //年龄
    bedName: "", //床号
    status: "", //卡片得值，0代表正常，1代表外出住院
    cmrStatus: "0", //cmrStatus	未结束就诊病历状态 1：有  0：没有
    cpStatus: "0" //	未结束就诊处方状态 1：有  0：没有
  };

  // 病历保存参数
  medicalRecord = {
    id: "", //病历id（编辑时id必传）
    oldmanId: "", //老人id
    chiefComplaint: "", //主诉
    presentIllnessHistory: "", //现病史
    temperatureType: "口温", //体温类型
    temperatureValue: "", //体温值
    highBloodPressure: "", //高压
    lowBloodPressure: "", //低压
    healthCheckCfgList: [], //体格检查配置项
    healthCheckOther: "", //体格检查其他
    labEqpInspection: "", //实验室及器械检查
    primaryDiagnosis: "", //初步诊断
    isOutForDoctor: "0", //是否外出就医
    handingResult: "", //处理结果
    outTime: "", //外出时间
    outType: "", //外出类型
    accompanyPerson: "", //陪同人
    clinicHospital: "", //就诊医院
    comment: "", //备注
    accountId: "" //登录账户Id
  };

  // 处方保存参数
  prescriptionObj = {
    id: "", //处方数据id（编辑时必填）
    oldmanId: "", //老人id
    accountId: "", //登录账户ID
    medRecordId: "", //病历ID
    clinicPrescriptionDescList: [
      {
        prescriptionType: "", //处方类型 1：精一处方 2：精二处方 3：普通处方(必填)
        prescriptionOrder: "", //处方排序号
        clinicPrescriptionDrugList: [
          {
            drugOrder: 0, //排序号
            drugUsage: "", //用法
            drugUsageName: "", //用法名称
            drugUseFrequencyArr: [], //用药频次
            drugUseFrequencyName: "", //用药频次名称
            drugFrequency: "", //频次
            drugFrequencyName: "", //频次名称
            other: "", //其他
            clinicPrescriptionDrugDescList: [
              {
                drugDescOrder: 0, //排序号
                drugName: "", //药品名
                specification: "", //药品规格
                totalNum: "", //总量
                totalNumUnit: "", //药品的总量的单位
                dosage: "", //单次剂量
                daysNum: "", //天数
                packingUnit: "", //单位
                packingUnitName: "", //单位名称
                medDrugId: "" //药品Id(必填)
              }
            ]
          }
        ]
      }
    ]
  };

  // 药品定义
  drugObj = {
    drugOrder: 0, //排序号
    drugUsage: "", //用法
    drugUsageName: "", //用法名称
    drugUseFrequencyArr: [], //用药频次
    drugUseFrequencyName: "", //用药频次名称
    drugFrequency: "", //频次
    drugFrequencyName: "", //频次名称
    other: "", //其他
    clinicPrescriptionDrugDescList: [
      // {
      //   drugDescOrder: 0, //排序号
      //   drugName: "", //药品名
      //   specification: "", //药品规格
      //   totalNum: "", //总量
      //   totalNumUnit: "",//药品总量单位
      //   dosage: "", //单次剂量
      //   daysNum: "", //天数
      //   packingUnit: "", //单位
      //   packingUnitName: "", //单位名称
      //   medDrugId: "", //药品Id(必填)
      //   largePackingUnit: ""//大包装单位
      // }
    ]
  };

  // 处方列表，可以有多个精一处方、精二处方、普通处方
  clinicPrescriptionDescList = [];
  // 结束就诊按钮 参数
  endHospitalObj = {
    medicalRecordId: "", //病历id,必填
    recipeId: "", //处方id
    accountId: "" //登录账户Id
  };

  // 获得用药得列表
  pharmacyDrugObj = {
    search: "", //"药品名称或者拼音首字母",
    limitLevel: "" // "限制等级"
  };

  // 查看历史病历参数
  historicalRecordPar = {
    page: 0, //页码
    size: 10, //每页数量
    oldmanId: "" //病人id
  };

  // 查看历史病历参数
  drugTrackRecordPar = {
    page: 0, //页码
    size: 10, //每页数量
    oldmanId: "" //病人id
  };

  caseTotalPages: 0; //历史病历总页数
  drugTotalPages: 0; //用药跟踪总页数

  // 保存外出住院得接口参数
  hosipatalObj = {
    backHosptial: {
      outHospitalDate: "", // " 出院时间",
      outHospitalUrl: "", // "出院记录",
      outcomment: "", //"出院备注"
      id: "" //"外出住院ID"
    },
    chiefComplaint: "", // "陪同人",
    outTime: "", //外出住院得外出时间
    comment: "", //"备注",
    id: "", //"外出住院ID",
    medRecordId: "", // "病历id",
    visitingList: [
      {
        hospitalName: "", //"医院名称",
        inHospitalDate: "", // "住院时间"
        comment: "" //备注
      }
    ]
  };

  // 住院归来添加药品参数
  outPaintAddDrugObj = {
    checker: "", //"验收人 ",
    comment: "", //"备注",
    dosage: "", //"剂量",
    drugName: "", //"药品名称 ",
    drugOrder: "", //" 药品排序号",
    effect: "", //"作用 ",
    frequency: "", // " 频次 ",
    id: "", // "id",
    receiveTime: "", // "接收时间",
    receiver: "", // "收药人 ",
    shortName: "", //"简称",
    frequencyName: "", //"频次名称",
    backHospitalId: "", //"住院归来id",
    specification: "", //"规格",
    takeLimit: "", // "服用期限",
    takeTime: "", //" 服药时间",
    totalNum: "" // "药品总量"
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService, //提示
    private localStorage: LocalStorage //存储
  ) {}

  ngOnInit() {
    //获得传递过来得参数
    this.obj = JSON.parse(this.route.snapshot.paramMap["params"]["data"]);
    this.medicalRecord.oldmanId = this.obj.id;
    //获得用户得详细信息
    this.useInfo = this.localStorage.getUser();
    this.getAllDataDictionary(); //获得医疗字典中体格检查配置项

    if (this.obj.cmrStatus == "1") {
      this.getListNoEnd(); //病历保存了但是没有结束就诊时得病历数据
    }

    // if (this.obj.cpStatus == "1") {
    //   this.getPrDetails(); //处方保存了但是没有结束就诊时得处方数据
    // }
  }

  // 转院
  addAnotherHospital() {
    const obj = {
      hospitalName: "", //"医院名称",
      inHospitalDate: "", // "住院时间"
      comment: "" //备注
    };

    this.hosipatalObj.visitingList.push(obj);
  }

  // 删除新添加得转院和住院
  deleteAnthorHosipital(i) {
    if (i == 0) {
      this.message.error("不可删除");
      return;
    } else {
      this.hosipatalObj.visitingList.splice(i, 1);
    }
  }

  arrOutHospitalUrl = [];
  // 获得历史病历
  getHistoricalRecord() {
    this.historicalRecordPar.oldmanId = this.obj.id; //获得病人的ID
    this.httpReq.get(
      "/clinicMedRecord/listHistoryMedRecord",
      this.historicalRecordPar,
      data => {
        if (data.code == "0") {
          const result = data["data"]["content"];
          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            element.healthCheckCfgList = JSON.parse(element.healthCheckCfgList);
          }

          if (data["data"]["content"].length > 0) {
            for (
              let index = 0;
              index < data["data"]["content"].length;
              index++
            ) {
              const element = data["data"]["content"][index];
              this.arrOutHospitalUrl = [];
              if (element.isOutForDoctor == "1") {
                // 把出院记录转换成数组 显示
                if (
                  element.clinicOutHospital.backHosptial.outHospitalUrl != ""
                ) {
                  this.arrOutHospitalUrl = element.clinicOutHospital.backHosptial.outHospitalUrl.split(
                    ","
                  );
                }

                element.arrOutHospitalUrl = this.arrOutHospitalUrl;
              }
            }
          }

          this.historicalRecordParArr = data["data"]["content"];
          this.caseTotalPages = data["data"]["totalPages"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  drugTrackList = []; //用药跟踪列表

  // 获得用药跟踪列表
  getDrugTrack() {
    this.drugTrackRecordPar.oldmanId = this.obj.id;
    this.httpReq.get("prescription/listMed", this.drugTrackRecordPar, data => {
      if (data["code"] == 0) {
        this.drugTrackList = data["data"]["content"];
        this.drugTotalPages = data["data"]["totalPages"];
      } else {
        this.message.error(data["message"]);
      }
    });
  }
  //选择更改是否外出就诊时
  changeOutForDoctor() {
    if (this.medicalRecord.isOutForDoctor == "1") {
      //如果是否外出就医选择是时
      this.isShowOutForDoctor = true; //外出时间、陪同人、外出就医、备注等显示
      this.isShowResultHandling = false; //处理结果不显示
    } else {
      this.medicalRecord.outTime = "";
      this.medicalRecord.outType = "";
      this.medicalRecord.accompanyPerson = "";
      this.medicalRecord.clinicHospital = "";
      this.medicalRecord.comment = "";
      this.medicalRecord.handingResult = "";
      this.isShowOutForDoctor = false; //外出时间、陪同人、外出就医、备注等不显示
      this.isShowResultHandling = true; //处理结果显示
    }
  }

  arrHealthCheckCfg = []; //赋值和数据库中获取数据一致
  // 导入病历
  importMedicalRecords(data) {
    // 病历保存参数
    this.medicalRecord = data;
    this.arrHealthCheckCfg = data.healthCheckCfgList;
    this.httpReq.post(
      "/dictionaryMedicationData/dataListAllTwo",
      null,
      {
        dictTypes: "healthCheckCfg"
      },
      data => {
        if (data["code"] == 0) {
          const info = data["data"];
          info.forEach(e => {
            //体格检查配置项
            if (e.dictType == "healthCheckCfg") {
              this.healthCheckCfgList = e.ddList;
              this.medicalRecord.healthCheckCfgList = [];
              for (
                let index = 0;
                index < this.healthCheckCfgList.length;
                index++
              ) {
                const element = this.healthCheckCfgList[index];
                const obj = {
                  cfgOrder: "", //体格检查项排序号
                  cfgName: "", //体格检查项名
                  cfgValue: "" //体格检查项值
                };

                obj.cfgOrder = element["dictValue"];
                obj.cfgName = element["dictTag"];
                this.medicalRecord.healthCheckCfgList.push(obj);
              }
            }

            for (
              let index = 0;
              index < this.medicalRecord.healthCheckCfgList.length;
              index++
            ) {
              const e = this.medicalRecord.healthCheckCfgList[index];
              for (let i = 0; i < this.arrHealthCheckCfg.length; i++) {
                const element = this.arrHealthCheckCfg[i];
                if (e.cfgName == element.cfgName) {
                  e.cfgValue = element.cfgValue;
                }
              }
            }
          });
        } else {
          this.message.error(data["message"]);
        }
      }
    );

    this.medicalRecord.id = "";
    this.medicalRecord.oldmanId = this.obj.id;
    this.changeOutForDoctor();
  }

  // 导入处方
  importPrescription(data) {
    this.clinicPrescriptionDescList =
      data.clinicPrescription.clinicPrescriptionDescList;

    for (
      let index = 0;
      index < this.clinicPrescriptionDescList.length;
      index++
    ) {
      const element = this.clinicPrescriptionDescList[index];
      element.id = "";
      for (let i = 0; i < element.clinicPrescriptionDrugList.length; i++) {
        const e = element.clinicPrescriptionDrugList[i];
        e.id = "";
        for (
          let des = 0;
          des < e.clinicPrescriptionDrugDescList.length;
          des++
        ) {
          const desc = e.clinicPrescriptionDrugDescList[des];
          desc.id = "";
        }
      }
    }
    for (
      let index = 0;
      index < this.clinicPrescriptionDescList.length;
      index++
    ) {
      const element = this.clinicPrescriptionDescList[index];
      if (element.prescriptionType == "1") {
        element.name = "精一处方药品列表";
      } else if (element.prescriptionType == "2") {
        element.name = "精二处方药品列表";
      } else if (element.prescriptionType == "3") {
        element.name = "普通处方药品列表";
      } else {
      }
    }
  }

  // 获得老人没有结束就诊但是保存了处方
  getPrDetails() {
    const medRecordId = this.endHospitalObj.medicalRecordId; //传参
    this.httpReq.get(
      "prescription/detail",
      { medRecordId: medRecordId },
      data => {
        if (data.code == "0") {
          this.prescriptionObj.id = data["data"]["id"];
          this.prescriptionObj.oldmanId = data["data"]["oldmanId"];
          this.clinicPrescriptionDescList =
            data["data"]["clinicPrescriptionDescList"];
          if (
            data["data"]["clinicPrescriptionDescList"] &&
            this.clinicPrescriptionDescList.length > 0
          ) {
            for (
              let index = 0;
              index < this.clinicPrescriptionDescList.length;
              index++
            ) {
              const element = this.clinicPrescriptionDescList[index];
              if (element.prescriptionType == "1") {
                element.name = "精一处方药品列表";
              } else if (element.prescriptionType == "2") {
                element.name = "精二处方药品列表";
              } else if (element.prescriptionType == "3") {
                element.name = "普通处方药品列表";
              } else {
              }
            }
          }

          this.endHospitalObj.recipeId = data["data"]["id"]; //给结束就诊参数处方ID赋值
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }
  // 获得老人没有结束就诊但是保存了病历
  getListNoEnd() {
    const oldmanId = this.obj.id;
    const that = this;
    that.httpReq.post(
      "clinicMedRecord/listNoEnd",
      null,
      { oldmanId: oldmanId },
      data => {
        if (data["code"] == 0) {
          this.medicalRecord = data["data"];
          this.medicalRecord.healthCheckCfgList = JSON.parse(
            data["data"]["healthCheckCfgList"]
          );
          this.endHospitalObj.medicalRecordId = data["data"]["id"]; //给结束就诊得病历Id赋值
          if (this.obj.cpStatus == "1") {
            this.getPrDetails(); //处方保存了但是没有结束就诊时得处方数据
          }
          if (this.obj.status == "1") {
            //如果是外出状态
            this.getHosipitalDetails(); //调用陪同人、陪同时间详情
          }
          this.changeOutForDoctor(); //如果外出出院是显示下面得外出时间
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }
  // 点击结束就诊时显示病历和处方详情给医生看
  isShowHospital() {
    this.isShowEndHospital = true; //显示病历详情和处方详情弹出框
  }
  // 结束就诊确认时操作
  editTheHospital() {
    if (this.endHospitalObj.medicalRecordId == "") {
      this.message.error("请先保存病历");
      return;
    }

    this.endHospitalObj.accountId = this.useInfo.data.id;
    this.httpReq.post(
      "prescription/finishVisit",
      null,
      this.endHospitalObj,
      data => {
        this.isShowEndHospital = false; //不显示病历详情和处方详情弹出框

        if (data["code"] == 0) {
          this.httpReq.get(
            "clinicMedRecord/detail",
            { id: this.endHospitalObj.medicalRecordId },
            data => {
              if (data["code"] == 0) {
                const element = data["data"];
                element.healthCheckCfgList = JSON.parse(
                  element.healthCheckCfgList
                );
                this.arrOutHospitalUrl = [];
                if (element.isOutForDoctor == "1") {
                  // 把出院记录转换成数组 显示
                  if (
                    element.clinicOutHospital.backHosptial.outHospitalUrl != ""
                  ) {
                    this.arrOutHospitalUrl = element.clinicOutHospital.backHosptial.outHospitalUrl.split(
                      ","
                    );
                  }
                  element.arrOutHospitalUrl = this.arrOutHospitalUrl;
                }
                this.turnToPrint(element);
              }
            }
          );
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 保存处方到数据库里
  savePres() {
    this.prescriptionObj.oldmanId = this.obj.id;
    this.prescriptionObj.accountId = this.useInfo.data.id;
    this.prescriptionObj.medRecordId = this.endHospitalObj.medicalRecordId;
    this.prescriptionObj.clinicPrescriptionDescList = this.clinicPrescriptionDescList;
    if (
      this.prescriptionObj.clinicPrescriptionDescList.length == 0 ||
      (this.prescriptionObj.clinicPrescriptionDescList.length == 0 &&
        this.prescriptionObj.clinicPrescriptionDescList[0]
          .clinicPrescriptionDrugList.length == 0)
    ) {
      this.message.error("请选择处方");
      return;
    }

    for (
      let i = 0;
      i < this.prescriptionObj.clinicPrescriptionDescList.length;
      i++
    ) {
      const e = this.prescriptionObj.clinicPrescriptionDescList[i];
      if (e.clinicPrescriptionDrugList.length == 0) {
        this.message.error("请删除没有药品得处方");
        return;
      }
    }
    this.httpReq.post("prescription/save", null, this.prescriptionObj, data => {
      if (data["code"] == 0) {
        this.message.success("保存" + data["message"]);
        this.endHospitalObj.recipeId = data["data"];
        this.prescriptionObj.id = data["data"];
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 处方点击每个精一、精二、普通处方时得操作
  // 参数prescriptionType代表处方类型：1是精一处方，2是精二处方，3是普通处方
  addDrug(name: string, prescriptionType: string, state: string) {
    this.state = state; //判断当前是添加还是编辑，add是添加
    // 药品定义,每次添加时药品得列表和用药频次都清空
    this.drugObj = {
      drugOrder: 0, //排序号
      drugUsage: "", //用法
      drugUsageName: "", //用法名称
      drugUseFrequencyArr: [], //用药频次
      drugUseFrequencyName: "", //用药频次名称
      drugFrequency: "", //频次
      drugFrequencyName: "", //频次名称
      other: "", //其他
      clinicPrescriptionDrugDescList: [
        // {
        //   drugDescOrder: 0, //排序号
        //   drugName: "", //药品名
        //   specification: "", //药品规格
        //   totalNum: "1", //总量
        //   dosage: "1", //单次剂量
        //   daysNum: "1", //天数
        //   packingUnit: "", //单位
        //   packingUnitName: "", //单位名称
        //   totalNumUnit: "",//药品总量单位
        //   medDrugId: "", //药品Id(必填)
        //   largePackingUnit: ""//大包装单位
        // }
      ]
    };
    //根据名称判断处方得类型，然后根据类型搜索药品
    if (name == "精一处方药品列表") {
      this.pharmacyDrugObj.limitLevel = "精I";
    } else if (name == "精二处方药品列表") {
      this.pharmacyDrugObj.limitLevel = "精II";
    } else {
      this.pharmacyDrugObj.limitLevel = "普通";
    }

    this.prescriptionNo = prescriptionType; //添加药品时，把第几个处方保存起来，方便之后药品确定添加时好处理
    this.isShowDrugDetails = true; //药品详情弹出框显示
  }

  // 新增精一、精二、普通处方列表 value:1：精一处方，2：精二处方，3普通处方
  addRecipe(value: string) {
    const obj = {
      prescriptionType: "", //处方类型
      prescriptionOrder: "", //处方排序号
      name: "", //处方名称。如精一处方药品列表。精二处方药品列表
      clinicPrescriptionDrugList: []
    };
    obj.prescriptionType = value; //给处方类型赋值

    if (value == "1") {
      obj.name = "精一处方药品列表";
    } else if (value == "2") {
      obj.name = "精二处方药品列表";
    } else {
      obj.name = "普通处方药品列表";
    }

    //保存处方排序号
    obj.prescriptionOrder =
      this.clinicPrescriptionDescList.length > 0
        ? this.clinicPrescriptionDescList[
            this.clinicPrescriptionDescList.length - 1
          ].prescriptionOrder + 1
        : 0;
    // this.prescriptionNoState = value; //保存处方类型
    this.clinicPrescriptionDescList.push(obj);
  }

  // 保存外出住院中得添加药品
  saveOutPaintDrug() {
    if (this.outPaintAddDrugObj.drugName == "") {
      this.message.error("药品名称不能为空");
      return;
    }

    if (this.outPaintAddDrugObj.totalNum == "") {
      this.message.error("药品总量不能为空");
      return;
    }

    if (this.outPaintAddDrugObj.dosage == "") {
      this.message.error("药品剂量不能为空");
      return;
    }

    if (this.outPaintAddDrugObj.frequency == "") {
      this.message.error("频次不能为空");
      return;
    }

    if (this.outPaintAddDrugObj.takeTime == "") {
      this.message.error("服药时间不能为空");
      return;
    }

    if (this.outPaintAddDrugObj.takeLimit == "") {
      this.message.error("服用期限不能为空");
      return;
    }

    this.httpReq.post(
      "outHospital/drugAddOrEdit",
      null,
      this.outPaintAddDrugObj,
      data => {
        if (data["code"] == 0) {
          this.message.success("保存成功");
          this.addTakeIsVisible = false;
          this.getDrugList();
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 获得住院得药品列表
  getDrugList() {
    this.takeMedLoading = true;
    this.httpReq.get(
      "outHospital/drugdList",
      { backHospitalId: this.outPaintAddDrugObj.backHospitalId },
      data => {
        this.takeMedLoading = false;
        if (data["code"] == 0) {
          this.outPaintDrugList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 是否显示住院归来详情
  isShowHosipital() {
    this.isShowHospitalStay = !this.isShowHospitalStay;
  }

  //编辑出院管理中的药品信息
  editOutPaintDrug(data) {
    this.addTakeIsVisible = true;
    this.outPaintAddDrugObj = data;
  }

  deleteOutPaintDrug(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("/outHospital/drugdDel", null, { id: id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功");
          this.getDrugList();
        } else {
          this.message.error(data["message"]);
        }
      });
    });
  }

  // 历史病历中 删除操作
  deleteMedicalRecords(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("clinicMedRecord/delete", null, { id: id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功");
          this.getHistoricalRecord();
          this.back();
        } else {
          this.message.error(data["message"]);
        }
      });
    });
  }
  // 保存外出住院
  saveOutHosipital() {
    if (this.isShowHospitalStay == true) {
      if (this.hosipatalObj.backHosptial.outHospitalDate == "") {
        this.message.error("出院日期不能为空");
        return;
      }

      this.hosipatalObj.backHosptial.outHospitalUrl = this.logoImage.showImageUrls.toString();
    } else {
      this.hosipatalObj.backHosptial.outHospitalDate = "";
      this.hosipatalObj.backHosptial.outHospitalUrl = "";
    }

    this.httpReq.post("/outHospital/save", null, this.hosipatalObj, data => {
      if (data["code"] == 0) {
        this.message.success("保存成功");
        this.back();
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 住院归来中添加药品， 根据输入框内值检索出所有得药品名称
  getDrugName(value: string) {
    this.httpReq.post("drugs/AllList", null, { search: value }, data => {
      if (data["code"] == 0) {
        this.hospitalDrugNameList = data["data"];
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 输入值去数据库匹配数据并显示
  // value表示输入框里面的值，templateType表示要去数据库匹配得，比如主诉：complain
  onInput(value: string, templateType: string): void {
    const obj = {
      templateType: templateType, //模板类型
      key: value //关键字 非必填
    };

    this.httpReq.get("clinic/searchData", obj, data => {
      if (data.code == "0") {
        if (templateType == "complain") {
          //如果时主诉，主诉显示列表
          this.mainSuitList = data["data"];
        } else if (templateType == "historyNow") {
          //如果是现病史，现病史列表显示
          this.historyNowList = data["data"];
        } else if (templateType == "healthCheckUp") {
          //如果是体格检查，体格检查列表显示
          this.healthCheckUpList = data["data"];
        } else if (templateType == "laboratory") {
          //如果是器械检查，器械检查列表显示
          this.laboratoryList = data["data"];
        } else if (templateType == "tentativeDiaginosis") {
          //如果是初步诊断，初步诊断列表显示
          this.tentativeDiaginosisList = data["data"];
        } else if (templateType == "clinicHosiptal") {
          //如果是就诊医院，就诊医院列表显示
          this.clinicHosiptalList = data["data"];
        } else if (templateType == "dealResult") {
          //如果是就诊医院，就诊医院列表显示
          this.dealResultList = data["data"];
        } else {
        }
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 保存病历到数据库
  saveCasehistory() {
    this.medicalRecord.accountId = this.useInfo.data.id;
    this.isShowResultHandling = true;
    if (this.medicalRecord.chiefComplaint == "") {
      this.message.error("主诉不能为空");
      return;
    }

    if (this.medicalRecord.isOutForDoctor == "1") {
      if (
        this.medicalRecord.outTime == "" ||
        this.medicalRecord.accompanyPerson == "" ||
        this.medicalRecord.clinicHospital == ""
      ) {
        this.message.error("外出时间、陪同人、就诊医院不能为空");
        return;
      } else {
        this.medicalRecord.outTime = this.jsUtil.dateFormat(
          this.medicalRecord.outTime,
          "YYYY-MM-DD  HH:mm:ss"
        );
        this.medicalRecord.handingResult =
          "患者于" +
          this.medicalRecord.outTime +
          "在" +
          this.medicalRecord.accompanyPerson +
          "的陪同下，去" +
          this.medicalRecord.clinicHospital +
          "就诊";
      }
    }
    this.httpReq.post(
      "clinicMedRecord/saveOrUpdate",
      null,
      this.medicalRecord,
      data => {
        if (data["code"] == 0) {
          this.message.success("保存" + data["message"]);
          this.endHospitalObj.medicalRecordId = data["data"];
          this.medicalRecord.id = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }
  // 保存药品详情
  saveDrugDetails() {
    // 如果添加药品是药品得长度小于，证明没有添加药品，要给提示
    if (
      //如果药品的数组长度小于0或者长度大于0并且id为空时
      this.drugObj.clinicPrescriptionDrugDescList.length <= 0 ||
      (this.drugObj.clinicPrescriptionDrugDescList.length >= 1 &&
        this.drugObj.clinicPrescriptionDrugDescList[0].medDrugId == "")
    ) {
      this.message.error("请选择药品");
      return;
    } else {
      for (
        let index = 0;
        index < this.drugObj.clinicPrescriptionDrugDescList.length;
        index++
      ) {
        const element = this.drugObj.clinicPrescriptionDrugDescList[index];
        if (element.totalNum == "") {
          this.message.error("药品总量不能为空");
          return;
        }
      }
      // 如果有药品详情
      this.isShowDrugDetails = false; //药品详情页面不显示

      // 这个药品得drugOrde等于第几个处方得第几个序号
      this.drugObj.drugOrder =
        this.clinicPrescriptionDescList[this.prescriptionNo]
          .clinicPrescriptionDrugList.length > 0
          ? this.clinicPrescriptionDescList[this.prescriptionNo]
              .clinicPrescriptionDrugList[
              this.clinicPrescriptionDescList[this.prescriptionNo]
                .clinicPrescriptionDrugList.length - 1
            ].drugOrder + 1
          : 0;

      // 把数据添加到处方中
      this.clinicPrescriptionDescList[
        this.prescriptionNo
      ].clinicPrescriptionDrugList.push(this.drugObj); //把数据添加到列表中
    }
  }

  // 修改药品详情
  edigDrugDetails() {
    this.clinicPrescriptionDescList[
      this.index
    ].clinicPrescriptionDrugList.splice(this.detailsI, 1, this.drugObj);
    this.isShowDrugDetails = false; //药品详情的弹出框不显示
  }
  // 药品详情删除  int是删除第几个数据
  deleteDrugDetails(int) {
    this.globalService.delModal(() => {
      this.drugObj.clinicPrescriptionDrugDescList.splice(int, 1);
    });
  }

  // 删除处方中得药品
  // i代表第几个处方，cdsI代表第几条数据
  deleteDetails(i, detailsI) {
    this.globalService.delModal(() => {
      this.clinicPrescriptionDescList[i].clinicPrescriptionDrugList.splice(
        detailsI,
        1
      );
    });
  }

  // 删除处方 i代表需要删除得第几个处方
  deleteDrug(i) {
    this.globalService.delModal(() => {
      this.clinicPrescriptionDescList.splice(i, 1);
    });
  }

  //选择一个药品时，添加到药品详情列表中
  addDrugDetail(data) {
    if (
      this.drugObj.clinicPrescriptionDrugDescList.length &&
      this.drugObj.clinicPrescriptionDrugDescList.some(
        item => item.medDrugId == data.medDrug.id
      )
    ) {
      this.message.error("已经添加过此药品");
      return;
    } else {
      let wesEle = {
        drugDescOrder: this.drugObj.clinicPrescriptionDrugDescList.length, //排序号
        drugName: data.medDrug.drugName, //药品名
        specification: data.medDrug.specification, //药品规格
        totalNum: "", //总量
        totalNumUnit: "", //药品的总量的单位
        dosage: "", //单次剂量
        daysNum: "", //天数
        packingUnit: "", //单位
        packingUnitName: "", //单位名称
        medDrugId: data.medDrug.id, //给ID赋值
        largePackingUnit: "", //大包装单位
        drugUsage: data.medDrug.drugUsage //用法
      };
      for (let index = 0; index < this.unitList.length; index++) {
        const e = this.unitList[index];
        if (data.medDrug.minPackingUnit == e.dictValue) {
          wesEle.packingUnit = e.dictValue;
          wesEle.packingUnitName = e.dictTag;
        }
        if (data.medDrug.largePackingUnit == e.dictValue) {
          wesEle.largePackingUnit = e.dictValue;
          wesEle.totalNumUnit = e.dictTag;
        }
      }
      this.drugObj.clinicPrescriptionDrugDescList.push(wesEle);
      console.error(this.drugObj.clinicPrescriptionDrugDescList);
    }
  }
  // 添加每个药品得详情
  addDrugDetails() {
    this.isShowOldDialog = true; //显示药品列表弹出框
    this.pharmacyDrugObj.search = ""; //搜索框里的值为空
    this.getDrugAllList(); //调用药品的列表

    /*
    // 给clinicPrescriptionDrugDescList添加一条数据
    const obj = {
      drugDescOrder: 0, //排序号
      drugName: "", //药品名
      specification: "", //药品规格
      totalNum: "1", //总量
      totalNumUnit: "",//药品总量单位
      dosage: "1", //单次剂量
      daysNum: "1", //天数
      packingUnit: "", //单位
      packingUnitName: "", //单位名称
      medDrugId: "", //药品Id(必填)
      largePackingUnit: ""//大包装单位
    };

    // 如果clinicPrescriptionDrugDescList的长度为0 drugDescOrder排序号就为0
    // 如果不为0，排序号就为clinicPrescriptionDrugDescList的长度+1
    obj.drugDescOrder =
      this.drugObj.clinicPrescriptionDrugDescList.length > 0
        ? this.drugObj.clinicPrescriptionDrugDescList[
          this.drugObj.clinicPrescriptionDrugDescList.length - 1
        ].drugDescOrder + 1
        : 0;

    //把药品详情添加到药品列表中
    this.drugObj.clinicPrescriptionDrugDescList = [
      ...this.drugObj.clinicPrescriptionDrugDescList,
      obj
    ];
    */
  }

  // 选择药品
  changeDrug(index) {
    /*
    this.drugIndex = index; //药品列表的下标
    this.isShowOldDialog = true; //显示药品列表弹出框
    this.pharmacyDrugObj.search = ""; //搜索框里的值为空
    this.getDrugAllList(); //调用药品的列表
    */
  }
  //获得用药列表
  getDrugAllList() {
    this.pharmacyDrugObjLoading = true; //用药列表得加载状态
    this.httpReq.post(
      "med_drug/listAllNoSplit",
      null,
      this.pharmacyDrugObj,
      data => {
        this.pharmacyDrugObjLoading = false; //用药列表得加载状态
        if (data["code"] == 0) {
          this.drugAllList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 获取体格检查可以配置得项
  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "dictionaryMedicationData/dataListAllTwo",
      null,
      {
        dictTypes:
          "healthCheckCfg,unit,usage,frequency,drugFrequency,delegationFrequency"
      },
      data => {
        if (data["code"] == 0) {
          const info = data["data"];
          info.forEach(e => {
            //体格检查配置项
            if (e.dictType == "healthCheckCfg") {
              this.healthCheckCfgList = e.ddList;
              this.medicalRecord.healthCheckCfgList = [];
              for (
                let index = 0;
                index < this.healthCheckCfgList.length;
                index++
              ) {
                const element = this.healthCheckCfgList[index];
                const obj = {
                  cfgOrder: "", //体格检查项排序号
                  cfgName: "", //体格检查项名
                  cfgValue: "" //体格检查项值
                };

                obj.cfgOrder = element["dictValue"];
                obj.cfgName = element["dictTag"];
                this.medicalRecord.healthCheckCfgList.push(obj);
              }
            }

            //单位
            if (e.dictType == "unit") {
              this.unitList = e.ddList;
            }
            //用法
            if (e.dictType == "usage") {
              this.usageList = e.ddList;
            }
            //频次
            if (e.dictType == "frequency") {
              this.frequencyList = e.ddList;
            }

            //用药频次
            if (e.dictType == "drugFrequency") {
              this.drugFrequencyList = e.ddList;
            }

            //用药频次
            if (e.dictType == "delegationFrequency") {
              this.delegationFrequencyList = e.ddList;
            }
          });
        } else {
          that.message.error(data["message"]);
        }
      }
    );
  }
  // 打开查看历史病历
  openVisable() {
    this.visible = true;
    this.getHistoricalRecord(); //获得历史病历数据
  }

  //关闭查看历史病历
  close(): void {
    this.visible = false;
    this.drugVisible = false;
  }

  // 打开查看用药跟踪
  openDrugVisible() {
    this.drugVisible = true;
    this.getDrugTrack(); //获得用药跟踪列表
  }
  // 返回
  back() {
    history.back();
  }

  // 选择用法
  changUsageName() {
    for (let index = 0; index < this.usageList.length; index++) {
      const e = this.usageList[index];
      if (e.dictValue == this.drugObj.drugUsage) {
        this.drugObj.drugUsageName = e.dictTag;
        return;
      }
    }
  }

  // 选择频次
  changFrequencyName() {
    this.drugObj.drugUseFrequencyName = "";
    for (let i = 0; i < this.drugObj.drugUseFrequencyArr.length; i++) {
      const iName = this.drugObj.drugUseFrequencyArr[i];
      for (let index = 0; index < this.frequencyList.length; index++) {
        const e = this.frequencyList[index];
        if (iName == e.dictValue) {
          // const dictTag = e.dictTag.split("-")[0];
          const dictTag = e.dictTag;
          this.drugObj.drugUseFrequencyName += dictTag + ",";
        }
      }
    }
  }

  // 选择频次
  changeDelegationFrequency() {
    this.outPaintAddDrugObj.frequencyName = "";
    for (let index = 0; index < this.delegationFrequencyList.length; index++) {
      const e = this.delegationFrequencyList[index];
      if (e.dictValue == this.outPaintAddDrugObj.frequency) {
        this.outPaintAddDrugObj.frequencyName = e.dictTag;
        return;
      }
    }
  }

  // 获得用药频次名字
  changDrugFrequency() {
    for (let index = 0; index < this.drugFrequencyList.length; index++) {
      const e = this.drugFrequencyList[index];
      if (e.dictValue == this.drugObj.drugFrequency) {
        this.drugObj.drugFrequencyName = e.dictTag;
        return;
      }
    }
  }

  // 选择单位
  changUnitName(i) {
    // 根据单位显示出对应得名称
    for (let index = 0; index < this.unitList.length; index++) {
      const e = this.unitList[index];
      if (
        e.dictValue ==
        this.drugObj.clinicPrescriptionDrugDescList[i].packingUnit
      ) {
        this.drugObj.clinicPrescriptionDrugDescList[i].packingUnitName =
          e.dictTag;
        return;
      }
    }
  }

  // 从处方中编辑药品信息
  // 参数i代表第几个处方，
  // cdsI代表处方中的第几条记录,
  // data:代表这个处方的数据,
  // name代表处方名字，根据处方名字可以判断打开的药品是精1 精2，还是普通药品列表
  editDetails(i, detailsI, data, state: string, name: string) {
    // 根据名字，判断药品列表中传的参数是是精1 精2，还是普通药品
    if (name == "精一处方药品列表") {
      this.pharmacyDrugObj.limitLevel = "精I";
    } else if (name == "精二处方药品列表") {
      this.pharmacyDrugObj.limitLevel = "精II";
    } else {
      this.pharmacyDrugObj.limitLevel = "普通";
    }
    this.index = i; //保存第几个处方，方便修改完之后修改这条记录
    this.detailsI = detailsI; //保存处方中的第几条数据，方便修改完之后修改这条记录
    this.state = state; //修改当前是编辑状态
    this.isShowDrugDetails = true; //药品详情列表弹出框显示

    console.error(data);
    this.drugObj = data; //赋值
  }

  // 打开个人档案历史病历
  openIsShowCaseHistory() {
    this.isShowCaseHistory = true;
    this.getHistoricalRecord(); //获得历史病历数据
  }

  // 关闭个人档案历史病历
  closeIsShowCaseHistory(): void {
    this.isShowCaseHistory = false;
    this.historicalRecordPar.page = 0;
  }

  // 打开个人档案用药跟踪
  openIsShowDrugHistory() {
    this.isShowDrugHistory = true;
    this.getDrugTrack(); //获得历史病历数据
  }

  // 关闭个人档案用药跟踪
  closeIsShowDrugHistory(): void {
    this.isShowDrugHistory = false;
    this.drugTrackRecordPar.page = 0;
  }

  turnToPrint(data) {
    this.router.navigate([
      "nursingHome/medicalManage/outpatienManage/caseDetails",
      { data: JSON.stringify(data), oldman: JSON.stringify(this.obj) }
    ]);
  }

  backHospitalId = ""; //住院归来id
  // 获得外出住院得陪同人和外出时间，外出就诊医院、外出时间
  getHosipitalDetails() {
    this.httpReq.post(
      "outHospital/listNow",
      null,
      { medRecordId: this.endHospitalObj.medicalRecordId },
      data => {
        if (data.code == "0") {
          const result = data["data"];
          this.hosipatalObj.id = result.id;
          this.hosipatalObj.backHosptial.id = result.backHosptial.id;
          this.hosipatalObj.medRecordId = result.medRecordId;
          this.hosipatalObj.comment = result.comment;
          this.hosipatalObj.chiefComplaint = result.chiefComplaint;
          this.hosipatalObj.outTime = result.outTime;
          this.hosipatalObj.visitingList = result.visitingList;
          this.backHospitalId = result.backHosptial.id;
          this.outPaintAddDrugObj.backHospitalId = this.backHospitalId;
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 住院归来里添加药品
  addOutPaintDrug() {
    // 住院归来添加药品参数
    this.outPaintAddDrugObj = {
      checker: "", //"验收人 ",
      comment: "", //"备注",
      dosage: "", //"剂量",
      drugName: "", //"药品名称 ",
      drugOrder: "", //" 药品排序号",
      effect: "", //"作用 ",
      frequency: "", // " 频次 ",
      id: "", // "id",
      receiveTime: "", // "接收时间",
      receiver: "", // "收药人 ",
      shortName: "", //"简称",
      frequencyName: "", //"频次名称",
      backHospitalId: "", //"住院归来id",
      specification: "", //"规格",
      takeLimit: "", // "服用期限",
      takeTime: "", //" 服药时间",
      totalNum: "" // "药品总量"
    };

    this.outPaintAddDrugObj.backHospitalId = this.backHospitalId;
    this.outPaintAddDrugObj.receiveTime = this.jsUtil.dateFormat(
      this.hosipatalObj.backHosptial.outHospitalDate
    );
    this.addTakeIsVisible = true; //住院归来中添加药品得弹出框显示
  }

  /**
   * 加载更多历史病历
   */
  loadMoreCase() {
    this.historicalRecordPar.oldmanId = this.obj.id; //获得病人的ID
    this.historicalRecordPar.page += 1;
    this.httpReq.get(
      "/clinicMedRecord/listHistoryMedRecord",
      this.historicalRecordPar,
      data => {
        if (data.code == "0") {
          const result = data["data"]["content"];
          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            element.healthCheckCfgList = JSON.parse(element.healthCheckCfgList);
          }
          this.historicalRecordParArr = this.historicalRecordParArr.concat(
            data["data"]["content"]
          );
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  /**
   * 加载更多用药跟踪
   */
  loadMoreDrug() {
    this.drugTrackRecordPar.oldmanId = this.obj.id; //获得病人的ID
    this.drugTrackRecordPar.page += 1;
    this.httpReq.get("prescription/listMed", this.historicalRecordPar, data => {
      if (data.code == "0") {
        this.drugTrackList = data["data"]["content"];
        this.drugTotalPages = data["data"]["totalPages"];
      } else {
        this.message.error(data["message"]);
      }
    });
  }
}
