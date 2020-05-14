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
  selector: "app-onHandOrder",
  templateUrl: "./onHandOrder.component.html",
  styleUrls: ["./onHandOrder.component.css"]
})
export class OnHandOrderComponent implements OnInit {

  sectionOfficeList = []; //科室列表
  sickWardList = []; //病区列表
  roomList = []; //房间列表
  bedList = []; //床位列表
  bedAllList = []; //床位的列表
  attendingDoctorsList = []; //主治医生列表

  name = "" //姓名
  attendingDoc = ""; //主治医生
  sectionOfficeId = "";  //科室
  sickWardId = ""; //病区
  roomId = ""; //房间
  bedName = ""; //床位
  isDone="0";////删选待处理医嘱，0为待处理，1为已处理

  user; //用户的详情信息

  // 获得长期医嘱列表请求参数
  longTermOrdersPar = {
    page: "0",  //页码
    size: "10", //每页数量
  };

  // 获得临时医嘱列表请求参数
  temporaryOrdersPar = {
    page: "0",  //页码
    size: "10", //每页数量
  };

  

  // 长期医嘱列表
  longTermOrdersList = [];

  // 临时医嘱列表
  temporaryOrdersList = [];

  selectedIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private modalService: NzModalService //提示
  ) { }

  ngOnInit() {
    const sessinData = Session.getObj(this.router.url);
    if (_.isObject(sessinData) && !_.isEmpty(sessinData)) {
      this.longTermOrdersPar = sessinData;
    }

    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    // this.longTermOrdersPar.accountId = this.user.data.id;

    this.getListSectionOffice().then(
      (suc: any) => {
        // 获取科室列表成功
        if (!(_.isObject(sessinData) && !_.isEmpty(sessinData))) {
          if (this.sectionOfficeList.length > 0) {
            this.sectionOfficeId = this.sectionOfficeList[0].id;

          }
        }
        this.defSickWard();
      },
      err => {
        // 获取科室列表失败
      }
    );
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
    const sessinData = Session.getObj(this.router.url);
    this.getListSickWard().then(
      (suc: any) => {
        // 获取病取列表成功
        if (this.sickWardList.length > 0) {
          this.sickWardId = this.sickWardList[0].id;
          this.getListRoom(); // 获取房间列表
        } else {
          this.sickWardId = "";
          this.sickWardList = [];
        }
      },
      (err: any) => {
        // 获取病区列表失败
        this.sickWardId = "";
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
          // this.getlongTermOrdersList();
        } else {
          this.sickWardId = this.sickWardList[0].id;
          this.getListRoom(); // 获取房间列表
          // this.getlongTermOrdersList();
        }
      },
      (err: any) => {
        // 获取病区列表失败
        this.sickWardId = "";
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
      { id: this.sectionOfficeId },
      data => {
        if (data.code == "0") {
          this.attendingDoc = "";
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
        { sectionOfficeId: this.sectionOfficeId },
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
      { sickWardId: this.sickWardId },
      data => {
        if (data.code == "0") {
          this.roomList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }


  selectedIndexChange(){
    // console.log(this.selectedIndex);
  }

}
