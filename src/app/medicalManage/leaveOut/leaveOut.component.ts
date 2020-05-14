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
  selector: "app-leaveOut",
  templateUrl: "./leaveOut.component.html",
  styleUrls: ["./leaveOut.component.css"]
})
export class LeaveOutComponent implements OnInit {
  @Input("patientId") patientId: string; // 病人ID

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
  // 外出请假列表参数
  changeAttendingObj = {
    page: 0,
    size: 100,
    inHospitalInfoId: ""
  };

  // 请假外出参数
  attendingObj = {
    inHospitalInfoId: "", //"入院信息Id",
    estimatedTime: "", //"预计归院时间",
    reason: "", //"备注",
    accountId: "" //"账户Id"
  };

  user; //用户信息
  isVisabled = true; //如果当前这个人是请假状态就不可以再添加
  attendingDoctorVisible = false; //变更主治医生
  changeAttendingList = []; //变更主治医生列表数组
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
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    this.patientId = JSON.parse(this.actRoute.snapshot.queryParams["data"])[
      "inHospitalInfo"
    ]["id"]; // 传递过来的参数

    console.log(JSON.parse(this.actRoute.snapshot.queryParams["data"]));

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
    this.getAttendList();
  }

  // 请假列表
  getAttendList() {
    this.changeAttendingObj.inHospitalInfoId = this.patientId;
    this.httpReq.post(
      "/sickWard/askForLeaveList",
      null,
      this.changeAttendingObj,
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.changeAttendingList = data["data"]["content"];
            if (this.changeAttendingList.length > 0) {
              const result = this.changeAttendingList[
                this.changeAttendingList.length - 1
              ];
              if (result.inHospitalInfo.status == "3") {
                this.isVisabled = false;
              } else {
                this.isVisabled = true;
              }
            }
          } else {
            this.msg.error(data["message"]);
          }
        }
      }
    );
  }

  // 保存请假
  saveAttending() {
    this.attendingObj.inHospitalInfoId = this.patientId;
    this.attendingObj.accountId = this.user.data.id;
    this.attendingObj.estimatedTime = this.jsUtil.dateFormat(
      this.attendingObj.estimatedTime,
      "YYYY-MM-DD HH:mm:ss"
    );

    // 获得今天得日期
    const data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate();
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
    const oDate2 = new Date(this.attendingObj.estimatedTime);
    if (oDate1.getTime() > oDate2.getTime()) {
      this.msg.error("选择的日期应该大于当前日期");
      return;
    }

    this.httpReq.post(
      "/sickWard/askForLeave",
      null,
      this.attendingObj,
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.msg.success("请假登记成功");
            this.attendingDoctorVisible = false;
            this.getAttendList();
          } else {
            this.msg.error(data["message"]);
          }
        }
      }
    );
  }

  addData() {
    this.attendingDoctorVisible = true;
    this.attendingObj.estimatedTime = "";
    this.attendingObj.reason = "";
  }
}
