import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";
import { Session } from "src/app/common/service/Storage";
import * as _ from "underscore";
@Component({
  selector: "app-wardMage",
  templateUrl: "./wardMage.component.html",
  styleUrls: ["./wardMage.component.css"]
})
export class WardMageComponent implements OnInit {
  isLoading = false;
  list = [];

  isVisible = false; //更换床位弹出框
  majorVisible = false; //转科弹出框
  hospitalVisible = false; //出院弹出框
  attendingDoctorVisible = false; //变更主治医生
  toRegisterVisible = false; //转入信息

  sectionOfficeList = []; //科室列表
  sickWardList = []; //病区列表
  roomList = []; //房间列表
  bedList = []; //床位列表
  bedAllList = []; //床位的列表
  attendingDoctorsList = []; //主治医生列表
  elderlyList = []; //待转入老人列表
  departmentList = []; //转科科室列表
  // 病人的详情
  patientDetails = {
    admissionNo: "", //住院号
    name: "", //患者姓名
    bedName: "", //床位列表
    sectionOfficeName: "", //科室
    careLevelCase: "", //护理等级
    attendingDocName: "", //医生姓名
    id: "",
    bedId: "", //床的ID，
    outDate: "" //预计出院时间
  };
  isBed = false; //判断床位是否有人
  // 换床的参数
  bedObj = {
    bedId: "", //床位id
    changeBedId: "", //更换床位id
    bedName: "", //患者名称
    isExchange: "false", //是否互换
    reason: "", //变更原因
    accountId: "" //账户Id
  };

  // 变更主治医生参数
  attendingObj = {
    bedId: "", //"床位id",
    changeEmployeeId: "", //"更换主治医生Id"
    reason: "", //变更原因
    accountId: "" //账户Id
  };

  // 出院参数
  leaveHospitalObj = {
    bedId: "", //"床位id",
    outDate: "", //"预计出院时间",
    reason: "", //"备注",
    accountId: "" //"账户Id"
  };

  // 转科参数
  majorObj = {
    bedId: "", //"床位id",
    changeSectionOfficeId: "", //"更换科室Id",
    reason: "", //"变更原因",
    accountId: "" //"账户Id"
  };

  //转入登记确认
  registrationObj = {
    admissionNo: "", //住院号
    name: "", //患者姓名
    careLevelCase: "", //护理级别
    situation: "", //病情
    originalDepartment: "", //原科室
    changeSoReason: "", //转科原因
    inHospitalInfoId: "", //"入院信息Id",
    changeSectionOfficeId: "", //更换科室Id
    changeSickWardId: "", //"更换病区Id",
    changeAttendingDoc: "", //"更换主治医生",
    changeBedId: "", //"更换床位Id"
    accountId: "" //"账户Id"
  };

  // 请假归来参数
  leaveOutObj = {
    bedId: "", //"床位id",
    backTime: "", //"归院时间",
    accountId: "" //"账户Id"
  };
  leaveOutVisible = false; //请假归来弹出框显示
  page = {
    size: 12,
    index: 1
  };

  reqObj = {
    page: 0, //"页码",
    size: 12, //"每页数量",
    name: "", //"姓名",
    attendingDoc: "", //"主治医生",
    sectionOfficeId: "", //"科室",
    sickWardId: "", //"病区",
    roomId: "", //"房间",
    bedNum: "", //"床位号",
    situation: "", //"病情",
    careLevelCase: "", //"护理等级",
    status: "", //"状态",
    medicalPayment: "", // 医疗付费方式
    accountId: "" //"账户Id"
  };
  total: 0;
  user; //用户的详情信息
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private modalService: NzModalService //提示
  ) {}

  ngOnInit() {
    const sessinData = Session.getObj(this.router.url);
    if (_.isObject(sessinData) && !_.isEmpty(sessinData)) {
      this.reqObj = sessinData;
      this.getElderlyList();
    }

    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.reqObj.accountId = this.user.data.id;

    this.getListSectionOffice().then(
      (suc: any) => {
        // 获取科室列表成功
        if (!(_.isObject(sessinData) && !_.isEmpty(sessinData))) {
          if (this.sectionOfficeList.length > 0) {
            this.reqObj.sectionOfficeId = this.sectionOfficeList[0].id;
            this.getElderlyList();
          }
        }
        this.defSickWard();
      },
      err => {
        // 获取科室列表失败
      }
    );

    this.getAllDataDictionary();
  }
  nursingList = []; //护理列表
  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "/dictionaryMedicationData/dataListAllTwo",
      null,
      {
        dictTypes: "careOfLevel"
      },
      data => {
        if (data["code"] == 0) {
          const info = data["data"];
          info.forEach(e => {
            //护理列表
            if (e.dictType == "careOfLevel") {
              this.nursingList = e.ddList;
            }
          });
        } else {
          that.message.success(data["message"]);
        }
      }
    );
  }

  // 列表
  updateList(reset: boolean = false): void {
    if (reset) {
      this.reqObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.reqObj.page = this.reqObj.page - 1;
      if (this.reqObj.page < 0) {
        this.reqObj.page = 0;
      }
    }

    const that = this;
    this.reqObj.accountId = this.user.data.id;
    this.isLoading = true;
    this.httpReq.post("sickWard/listPageSickWard", null, that.reqObj, data => {
      sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
      if (data.code == "0") {
        that.isLoading = false;
        that.reqObj.page++;
        that.total = data["data"]["totalElements"];
        that.list = data["data"]["content"];
      } else {
        that.message.error(data["message"]);
      }
    });
  }

  // 选择分页时调用
  onPageIndexChange(curIndex: Number) {
    this.updateList();
  }

  // 调用科室
  getListSectionOffice() {
    console.log(this.user.data.id);
    return new Promise((resolve, reject) => {
      this.httpReq.post(
        "sickWard/listSectionOffice",
        null,
        { accountId: this.user.data.id },
        data => {
          if (data.code == "0") {
            this.sectionOfficeList = data["data"];
            resolve();
          } else {
            this.message.error(data["message"]);
            reject();
          }
        }
      );
    });
  }

  // 选择科室时显示医生和病区
  ngChange() {
    this.getListDor(); // 获取医生列表
    this.getElderlyList();
    const sessinData = Session.getObj(this.router.url);
    this.getListSickWard().then(
      (suc: any) => {
        // 获取病取列表成功
        if (this.sickWardList.length > 0) {
          this.reqObj.sickWardId = this.sickWardList[0].id;
          this.getListRoom(); // 获取房间列表
          this.updateList();
        } else {
          this.reqObj.sickWardId = "";
          this.sickWardList = [];
        }
      },
      (err: any) => {
        // 获取病区列表失败
        this.reqObj.sickWardId = "";
        this.sickWardList = [];
      }
    );
  }

  /**
   * 默认病区
   * @memberof WardMageComponent
   */
  public defSickWard() {
    this.getListDor(); // 获取医生列表
    const sessinData = Session.getObj(this.router.url);
    this.getListSickWard().then(
      (suc: any) => {
        // 获取病取列表成功
        if (_.isObject(sessinData) && !_.isEmpty(sessinData)) {
          this.getListRoom(); // 获取房间列表
          this.updateList();
        } else {
          this.reqObj.sickWardId = this.sickWardList[0].id;
          this.getListRoom(); // 获取房间列表
          this.updateList();
        }
      },
      (err: any) => {
        // 获取病区列表失败
        this.reqObj.sickWardId = "";
        this.sickWardList = [];
      }
    );
  }

  // 选择病区时显示房间
  roomChange() {
    this.getListRoom();
  }

  dorList = []; //医生列表

  // 调用医生
  getListDor() {
    this.httpReq.post(
      "/section_office/getDoctorForSo",
      null,
      { id: this.reqObj.sectionOfficeId },
      data => {
        if (data.code == "0") {
          this.reqObj.attendingDoc = "";
          this.dorList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 调用病区列表
  getListSickWard() {
    return new Promise((resolve, reject) => {
      this.httpReq.post(
        "sickWard/listSickWard",
        null,
        { sectionOfficeId: this.reqObj.sectionOfficeId },
        data => {
          if (data.code == "0") {
            this.sickWardList = data["data"];
            resolve();
          } else {
            this.message.error(data["message"]);
            reject();
          }
        }
      );
    });
  }

  // 调用房间列表
  getListRoom() {
    this.httpReq.post(
      "/sickWard/listRoom",
      null,
      { sickWardId: this.reqObj.sickWardId },
      data => {
        if (data.code == "0") {
          this.roomList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 跳转到病人档案病区管理
  toPatient(data) {
    data.parentUrl = "父级护士工作站";
    console.log("tag", data);
    if (data && data.hasInHospitalHuman) {
      this.router.navigate([
        "nursingHome/medicalManage/patientFiles",
        { data: JSON.stringify(data) }
      ]);
    }
  }

  // 显示更换床位弹出框
  inTheBed(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getDetails(data);
    this.isVisible = true;
    this.isBed = false;
    this.bedObj.changeBedId = "";
    this.bedObj.reason = "";

    // 调用床位的列表
    this.httpReq.post(
      "/sickWard/listChangeBed",
      null,
      { bedId: this.patientDetails.id },
      data => {
        if (data.code == "0") {
          this.bedList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 判断选择的床位有没有人
  changeBed() {
    this.isBed = false;
    this.httpReq.post(
      "/sickWard/judgeChangeBed",
      null,
      { changeBedId: this.bedObj.changeBedId },
      data => {
        if (data.code == "0") {
          const result = data["data"];
          if (JSON.stringify(result) == "{}") {
            this.isBed = false;
          } else {
            this.bedObj.bedName = result.inHospitalInfo.basicInfo.name;
            this.isBed = true;
          }
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 保存换床
  saveBed() {
    this.bedObj.bedId = this.patientDetails.id;
    this.bedObj.accountId = this.user.data.id;
    // 调用床位的列表
    this.httpReq.post("/sickWard/changeBed", null, this.bedObj, data => {
      if (data.code == "0") {
        this.message.success("换床成功");
        this.isVisible = false;
        this.updateList();
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  //显示转科弹出框
  changeMajor(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getDetails(data);
    this.majorObj.changeSectionOfficeId = ""; //清空选择的科室和变更原因
    this.majorObj.reason = ""; //清空选择的科室和变更原因
    // 获得转科科室的列表
    this.httpReq.post(
      "/sickWard/listChangeSectionOffice",
      null,
      { bedId: this.patientDetails.id },
      data => {
        if (data.code == "0") {
          this.departmentList = data["data"];
          this.updateList();
        } else {
          this.message.error(data["message"]);
        }
      }
    );
    this.majorVisible = true;
  }

  // 保存转科
  saveMajor() {
    this.majorObj.bedId = this.patientDetails.id;
    this.majorObj.accountId = this.user.data.id;
    // 转科
    this.httpReq.post(
      "/sickWard/changeSectionOffice",
      null,
      this.majorObj,
      data => {
        if (data.code == "0") {
          this.message.success("保存成功");
          this.majorVisible = false;
          this.updateList();
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 获得待转入老人的列表
  getElderlyList() {
    this.httpReq.post(
      "/sickWard/listWaitSectionOffice",
      null,
      { sectionOfficeId: this.reqObj.sectionOfficeId },
      data => {
        if (data.code == "0") {
          const result = data["data"];
          if (JSON.stringify(result) == "{}") {
            this.elderlyList = [];
          } else {
            this.elderlyList = result;
          }
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  //显示出院弹出框
  changeHospital(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getDetails(data);
    this.leaveHospitalObj.outDate = "";
    this.leaveHospitalObj.reason = "";
    this.hospitalVisible = true;
  }

  // 判断选择的出院时间是否在当前时间之后
  onRangerPickerChange(e) {
    this.leaveHospitalObj.outDate = this.jsUtil.dateFormat(
      e,
      "YYYY-MM-DD  00:00:00"
    );
  }

  // 保存出院
  saveLeaveHospital() {
    this.leaveHospitalObj.bedId = this.patientDetails.id;
    this.leaveHospitalObj.accountId = this.user.data.id;
    // 获得今天得日期
    const data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate() - 1;
    console.log("" + day);
    let monthStr;
    let dayStr;
    if (month < 10) {
      monthStr = "0" + month;
    } else {
      monthStr = "" + month;
    }
    if (day < 10) {
      dayStr = "0" + day;
    } else {
      dayStr = "" + day;
    }
    const fullYear = year + "-" + monthStr + "-" + dayStr;
    const oDate1 = new Date(fullYear);
    const oDate2 = new Date(this.leaveHospitalObj.outDate);
    //判断选择的日期和当前日期的大小
    if (oDate1.getTime() > oDate2.getTime()) {
      this.message.error("选择的日期应该大于当前日期");
      return;
    }

    //出院日期如果为空，提示报错
    if (this.leaveHospitalObj.outDate == "") {
      this.message.error("预计出院时间不能为空");
      return;
    }
    // 变更主治医生的列表
    this.httpReq.post(
      "/sickWard/outHospital",
      null,
      this.leaveHospitalObj,
      data => {
        if (data.code == "0") {
          this.message.success("保存成功");
          this.hospitalVisible = false;
          this.updateList();
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  //显示变更主治医生弹出框
  changeAttendingDoctor(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getDetails(data);

    // 可选择的主治医生
    this.httpReq.post(
      "/sickWard/listChangeAdor",
      null,
      { bedId: this.patientDetails.id },
      data => {
        if (data.code == "0") {
          this.attendingDoctorsList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
    this.attendingDoctorVisible = true;
  }

  // 保存变更主治医生
  saveAttending() {
    this.attendingObj.bedId = this.patientDetails.id;
    this.attendingObj.accountId = this.user.data.id;
    // 变更主治医生的列表
    this.httpReq.post(
      "/sickWard/changeAttendingDoc",
      null,
      this.attendingObj,
      data => {
        if (data.code == "0") {
          this.message.success("变更主治医生成功");
          this.attendingDoctorVisible = false;
          this.updateList();
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  //转入信息弹出框
  changeToRegister(e: MouseEvent, data) {
    e.preventDefault();
    this.registrationObj.changeAttendingDoc = "";
    this.registrationObj.changeSickWardId = "";
    this.registrationObj.changeBedId = "";
    this.registrationObj.name = data.basicInfo.name;
    this.registrationObj.admissionNo = data.admissionNo;
    // this.registrationObj.careLevelCase = data.careLevelCase;
    if (data.careLevelCase == "0") {
      this.registrationObj.careLevelCase = "一级护理";
    } else if (data.careLevelCase == "1") {
      this.registrationObj.careLevelCase = "二级护理";
    } else if (data.careLevelCase == "2") {
      this.registrationObj.careLevelCase = "三级护理";
    } else if (data.careLevelCase == "3") {
      this.registrationObj.careLevelCase = "特级护理";
    } else {
    }
    this.registrationObj.originalDepartment = data.sectionOffice.name;
    this.registrationObj.changeSoReason = data.changeSoReason;
    this.registrationObj.inHospitalInfoId = data.id;
    this.registrationObj.changeSectionOfficeId = data.changeSectionOffice.id;
    this.toRegisterVisible = true; //转入信息
  }

  // 确认转入时选择病区获得床位
  changeRoom() {
    this.httpReq.post(
      "/sickWard/getBedForSickWard",
      null,
      { id: this.registrationObj.changeSickWardId },
      data => {
        if (data.code == "0") {
          this.bedAllList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 保存确认转科
  saveRegister() {
    this.registrationObj.accountId = this.user.data.id;
    // 变更主治医生的列表
    this.httpReq.post(
      "/sickWard/saveChangeSo",
      null,
      this.registrationObj,
      data => {
        if (data.code == "0") {
          this.message.success("转科成功");
          this.toRegisterVisible = false;
          this.updateList();
          this.getElderlyList();
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  //显示请假外出弹出框
  getBackTime(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.leaveOutVisible = true;
    this.getDetails(data);
  }
  cancelOutVisible = false; //取消出院弹出框
  //显示取消出院弹出框
  cancelOut(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.cancelOutVisible = true;
    this.getDetails(data);
  }

  // 确认取消出院
  saveCancelOut() {
    const cancelOut = {
      bedId: "",
      accountId: ""
    };
    cancelOut.bedId = this.patientDetails.bedId;
    cancelOut.accountId = this.user.data.id;
    this.httpReq.post("/sickWard/cancelOutHospital", null, cancelOut, data => {
      if (data.code == "0") {
        this.message.success("取消出院成功");
        this.cancelOutVisible = false;
        this.updateList();
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  cancelMajorVisible = false; //取消出院弹出框
  changeSectionOfficeName; //取消转科的科室显示
  changeSectionOfficeReason; //取消转科的备注显示
  //显示取消转科弹出框
  cancelBackTime(e: MouseEvent, data) {
    console.log(data);
    e.preventDefault();
    e.stopPropagation();
    this.cancelMajorVisible = true;
    this.getDetails(data);
    console.log(data);
    this.changeSectionOfficeName = data.inHospitalInfo.changeSectionOffice.name;
    this.changeSectionOfficeReason = data.inHospitalInfo.changeSoReason;
  }

  // 确认取消转科
  saveCancelMajor() {
    const cancelOut = {
      bedId: "",
      accountId: ""
    };
    cancelOut.bedId = this.patientDetails.bedId;
    cancelOut.accountId = this.user.data.id;
    this.httpReq.post("/sickWard/cancelChangeSo", null, cancelOut, data => {
      if (data.code == "0") {
        this.message.success("取消转科成功");
        this.cancelMajorVisible = false;
        this.updateList();
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 获得所有的个人信息
  getDetails(data) {
    console.log(data);
    this.patientDetails.admissionNo = data.inHospitalInfo.admissionNo;
    this.patientDetails.name = data.inHospitalInfo.basicInfo.name;
    this.patientDetails.bedName = data.bedName;
    this.patientDetails.sectionOfficeName =
      data.inHospitalInfo.sectionOffice.name;
    // this.patientDetails.careLevelCase = data.inHospitalInfo.careLevelCase;
    if (data.inHospitalInfo.careLevelCase == "0") {
      this.patientDetails.careLevelCase = "一级护理";
    } else if (data.inHospitalInfo.careLevelCase == "1") {
      this.patientDetails.careLevelCase = "二级护理";
    } else if (data.inHospitalInfo.careLevelCase == "2") {
      this.patientDetails.careLevelCase = "三级护理";
    } else if (data.inHospitalInfo.careLevelCase == "3") {
      this.patientDetails.careLevelCase = "特级护理";
    } else {
    }

    this.patientDetails.attendingDocName = data.inHospitalInfo.attendingDoc;
    this.patientDetails.sectionOfficeName =
      data.inHospitalInfo.sectionOffice.name;
    this.patientDetails.id = data.id;
    this.patientDetails.bedId = data.inHospitalInfo.bedId;
    this.patientDetails.outDate = data.inHospitalInfo.outDate;

    // this.majorObj.changeSectionOfficeId =
    //   data.inHospitalInfo.changeSectionOffice.id;
    // console.log(this.majorObj.changeSectionOfficeId);
    // this.majorObj.reason =
    //   data.inHospitalInfo.changeSectionOffice.changeSoReason;
  }

  //  保存请假归来
  saveLeaveOutVisible() {
    this.leaveOutObj.bedId = this.patientDetails.bedId;
    this.leaveOutObj.accountId = this.user.data.id;
    this.leaveOutObj.backTime = this.jsUtil.dateFormat(
      this.leaveOutObj.backTime,
      "YYYY-MM-DD HH:mm:ss"
    );

    // 获得今天得日期
    const data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate() + 1;
    let monthStr;
    let dayStr;
    if (month < 10) {
      monthStr = "0" + month;
    } else {
      monthStr = "" + month;
    }
    if (day < 10) {
      dayStr = "0" + day;
    } else {
      dayStr = "" + day;
    }
    const fullYear = year + "-" + monthStr + "-" + dayStr;
    const oDate1 = new Date(fullYear);
    const oDate2 = new Date(this.leaveOutObj.backTime);
    if (oDate1.getTime() < oDate2.getTime()) {
      this.message.error("选择的日期应该小于当前日期");
      return;
    }

    this.httpReq.post("/sickWard/askForBack", null, this.leaveOutObj, data => {
      if (data.code == "0") {
        this.message.success("请假归来登记成功");
        this.leaveOutVisible = false;
        this.updateList();
      } else {
        this.message.error(data["message"]);
      }
    });
  }
}
