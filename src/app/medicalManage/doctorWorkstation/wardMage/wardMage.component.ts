import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "src/app/common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
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

  // 病人的详情
  patientDetails = {
    // data.inHospitalInfo.admissionNo
    admissionNo: "", //住院号
    // data.inHospitalInfo.basicInfo.name
    name: "", //患者姓名
    // data.bedName
    bedName: "", //床位
    // data.inHospitalInfo.sectionOffice.name
    sectionOfficeName: "", //科室
    // data.inHospitalInfo.careLevelCase
    careLevelCase: "", //护理等级
    // data.inHospitalInfo.attendingDoc
    attendingDocName: "" //医生姓名
  };

  page = {
    size: 12,
    index: 1
  };

  reqObj = {
    page: 0, //"页码",
    size: 12, //"每页数量",
    name: "", //"姓名",
    situation: "", //病情
    attendingDoc: "", //"主治医生",
    sectionOfficeId: "", //"科室",
    sickWardId: "0", //"病区",
    // roomId: "", //"房间",
    condition: "", //"病情",
    careLevelCase: "", //"护理等级",
    status: "", //"状态",
    medicalPayment: "", //医疗付费方式
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
    that.list = [];
    this.isLoading = true;
    // sickWard/listPageSickWard
    this.httpReq.post("sickWard/listDorHumanInfo", null, that.reqObj, data => {
      sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
      this.isLoading = false;
      if (data.code == "0") {
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

  sectionOfficeList = []; //科室列表

  // 调用科室
  getListSectionOffice() {
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
    const sessinData = Session.getObj(this.router.url);
    this.getListSickWard().then(
      (suc: any) => {
        // 获取病取列表成功
        if (this.sickWardList.length > 0) {
          // this.reqObj.sickWardId = this.sickWardList[0].id;
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
          // this.reqObj.sickWardId = this.sickWardList[0].id;
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
      "sickWard/listDor",
      null,
      { sectionOfficeId: this.reqObj.sectionOfficeId },
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

  sickWardList = []; //病区列表

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

  roomList = []; //房间列表

  // 调用房间列表
  getListRoom() {
    // this.httpReq.post(
    //   "sickWard/listRoom",
    //   null,
    //   { sickWardId: this.reqObj.sickWardId },
    //   data => {
    //     if (data.code == "0") {
    //       this.roomList = data["data"];
    //     } else {
    //       this.message.error(data["message"]);
    //     }
    //   }
    // );
  }

  // 跳转到病人档案病区管理
  // toPatient(data) {
  //   this.router.navigate(["patientFiles", { data: JSON.stringify(data) }], {
  //     relativeTo: this.route
  //   });
  // }

  // 跳转到病人档案病区管理
  toPatient(data) {
    data.parentUrl = "父级医生工作站";
    // if (data && data.hasInHospitalHuman) {
    this.router.navigate([
      "nursingHome/medicalManage/patientFiles",
      { data: JSON.stringify(data) }
    ]);
    // }
  }

  // 显示更换床位弹出框
  inTheBed(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getData(data);
    this.isVisible = true;
  }

  //显示转科弹出框
  changeMajor(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getData(data);
    this.majorVisible = true;
  }

  //显示出院弹出框
  changeHospital(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getData(data);
    this.hospitalVisible = true;
  }

  //显示变更主治医生弹出框
  changeAttendingDoctor(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getData(data);
  }

  //转入信息弹出框
  changeToRegister(e: MouseEvent, data) {
    e.preventDefault();
    e.stopPropagation();
    this.getData(data);
    this.toRegisterVisible = true; //转入信息
  }

  getData(data) {
    this.patientDetails.admissionNo = data.inHospitalInfo.admissionNo;
    this.patientDetails.name = data.inHospitalInfo.basicInfo.name;
    this.patientDetails.bedName = data.bedName;
    this.patientDetails.sectionOfficeName =
      data.inHospitalInfo.sectionOffice.name;
    this.patientDetails.careLevelCase = data.inHospitalInfo.careLevelCase;
    this.patientDetails.attendingDocName = data.inHospitalInfo.attendingDoc;
  }
}
