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
  selector: "app-attendingPhysician",
  templateUrl: "./attendingPhysician.component.html",
  styleUrls: ["./attendingPhysician.component.css"]
})
export class AttendingPhysicianComponent implements OnInit {
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
  // 变更主治医生列表参数
  changeAttendingObj = {
    page: 0,
    size: 100,
    inHospitalInfoId: ""
  };

  // 变更主治医生参数
  attendingObj = {
    bedId: "", //"床位id",
    changeEmployeeId: "", //"更换主治医生Id"
    reason: "", //变更原因
    accountId: "" //账户Id
  };

  attendingDoctorsList = []; //主治医生列表
  user; //用户信息
  systemInfo; //系统信息
  attendingDoctorVisible = false; //变更主治医生
  changeAttendingList = []; //变更主治医生列表数组
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
    //获得用户得详细信息
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
          this.patientsBasicInfo.id = result.inHospitalInfo.bedId;
          // this.patientsBasicInfo.careLevelCase =
          //   result.inHospitalInfo.careLevelCase;

          if (result.inHospitalInfo.careLevelCase == "0") {
            this.patientsBasicInfo.careLevelCase = "一级护理";
          } else if (result.inHospitalInfo.careLevelCase == "1") {
            this.patientsBasicInfo.careLevelCase = "二级护理";
          } else if (result.inHospitalInfo.careLevelCase == "2") {
            this.patientsBasicInfo.careLevelCase = "三级护理";
          } else if (result.inHospitalInfo.careLevelCase == "3") {
            this.patientsBasicInfo.careLevelCase = "特级护理";
          } else {
          }
        }
      });
    } else {
      this.msg.error("未获取到老人ID");
    }
    this.getAttendList();
  }

  // 获得列表
  getAttendList() {
    this.changeAttendingObj.inHospitalInfoId = this.patientId;
    this.httpReq.post(
      "/sickWard/changeAttendingDocList",
      null,
      this.changeAttendingObj,
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            if (data["data"]["content"].length > 0) {
              this.patientsBasicInfo.attendingDoc =
                data["data"]["content"][
                  data["data"]["content"].length - 1
                ].nowInfo;
            }
            this.changeAttendingList = data["data"]["content"];
          } else {
            this.msg.error(data["message"]);
          }
        }
      }
    );
  }

  // 保存变更主治医生
  saveAttending() {
    this.attendingObj.bedId = this.patientsBasicInfo.id;
    this.attendingObj.accountId = this.user.data.id;

    this.httpReq.post(
      "/sickWard/changeAttendingDoc",
      null,
      this.attendingObj,
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.msg.success("变更主治医生成功");
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
    this.attendingObj.reason = "";
    this.attendingObj.changeEmployeeId = "";
    this.getAdorList();
    this.attendingDoctorVisible = true;
  }

  // 可选择的主治医生
  getAdorList() {
    this.httpReq.post(
      "/sickWard/listChangeAdor",
      null,
      { inHospitalInfoId: this.patientId },
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.attendingDoctorsList = data["data"];
          } else {
            this.msg.error(data["message"]);
          }
        }
      }
    );
  }
}
