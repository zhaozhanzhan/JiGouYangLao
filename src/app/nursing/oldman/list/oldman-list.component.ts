import { Component, OnInit, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzTreeNode, NzModalService } from "ng-zorro-antd";
import * as _ from "underscore";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { pageObj } from "src/app/common/config/config";
import { JsUtilsService } from "src/app/common/service/JsUtils.Service";
import { GlobalService } from "src/app/common/service/GlobalService";
import { EntrustMedicineService } from "../entrust-medicine.service";
import { Session } from "src/app/common/service/Storage";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormValidService } from "src/app/common/service/FormValid.Service";
import { LocalStorage } from "src/app/common/service/local.storage";
import { GlobalMethod } from "src/app/common/service/GlobalMethod";

@Component({
  selector: "app-oldman-list",
  templateUrl: "./oldman-list.component.html",
  styleUrls: ["./oldman-list.component.scss"]
})
export class OldmanComponent implements OnInit {
  public userInfo: any = null; // 登录信息
  public buildArr = []; // 建筑列表
  public floorArr = []; // 楼层列表
  public roomArr = []; // 房间列表
  public careLevelArr = []; // 护理等级列表
  public isTableLoading = false; // table加载动画显示状态
  public serValObj: any = {
    page: pageObj.currentPage, // 列表页码
    size: 12, // 列表条数
    totalItem: pageObj.totalItem, // 总条数
    name: "", // 老人姓名
    buildId: "", // 建筑
    floorId: "", // 楼层
    roomId: "", // 房间
    careLevel: "", // 护理等级
    status: "全部" // 状态
  }; // 定义查询请求对象

  public dataList: Array<any> = []; // 后台返回的数据列表

  public isShowCareLevel: boolean = false; // 是否显示护理等级模态框
  public careModalTit: string = "更改护理等级"; // 护理等级模态框标题
  public careLevelForm: FormGroup; // 定义护理等级表单对象
  public careLevelLoading: boolean = false; // 确定按钮loading动画

  public isShowChangBed: boolean = false; // 是否显示更换床位模态框
  public changBedModalTit: string = "更换床位"; // 更换床位模态框标题
  public changBedForm: FormGroup; // 定义更换床位表单对象
  public changBedLoading: boolean = false; // 确定按钮loading动画

  public isShowVacation: boolean = false; // 是否显示请假外出模态框
  public vacationModalTit: string = "请假外出"; // 请假外出模态框标题
  public vacationForm: FormGroup; // 定义请假外出表单对象
  public vacationLoading: boolean = false; // 确定按钮loading动画

  public isShowLeader: boolean = false; // 是否显示分配负责人模态框
  public leaderModalTit: string = "分配负责人"; // 分配负责人模态框标题
  public leaderForm: FormGroup; // 定义分配负责人表单对象
  public leaderLoading: boolean = false; // 确定按钮loading动画

  public expandKeys: Array<any> = ["1"]; // 更换床号默认等级
  public bedList: Array<any> = []; // 床位列表
  public bedObj: any = {}; // 选择的床对象

  public teamArr: Array<any> = []; // 护工班组列表
  public nurseArr: Array<any> = []; // 护工列表

  public disHistoryDate: any = null; // 禁用历史日期

  constructor(
    private httpReq: HttpReqService, // 请求数据服务
    private jsUtil: JsUtilsService, // JS自定义工具类
    private router: Router, // 跳转路由
    private actRoute: ActivatedRoute, // 获取传递的参数
    private gloSer: GlobalService, // 全局服务
    private msg: NzMessageService, // 消息提示服务
    private fb: FormBuilder, // 响应式表单
    private entrSer: EntrustMedicineService, // 获层建筑、楼层、房间
    private localStorage: LocalStorage,
    private modalService: NzModalService
  ) {
    this.userInfo = this.localStorage.getUser();
    this.careLevelForm = this.fb.group({
      id: ["", [Validators.required]], // 老人id
      name: ["", [Validators.required]], // 老人姓名
      oldlevelName: ["", []], // 原护理等级名称
      levelName: ["", [Validators.required]], // 护理等级名称
      userName: ["", [Validators.required]], // 操作员
      remark: [""] // 变更原因
    });

    this.changBedForm = this.fb.group({
      id: ["", [Validators.required]], // 老人id
      name: ["", [Validators.required]], // 老人姓名
      oldBedNum: ["", [Validators.required]], // 原床号
      bedId: ["", [Validators.required]], // 床ID
      exchange: [false, [Validators.required]], // 是否对调床（默认：否；对调：是）
      userName: ["", [Validators.required]], // 操作员
      remark: [""] // 变更原因
    });

    this.vacationForm = this.fb.group({
      id: ["", [Validators.required]], // 老人id
      name: ["", [Validators.required]], // 老人姓名
      returnDate: ["", [Validators.required]], // 预计返回时间
      userName: ["", [Validators.required]], // 操作员
      remark: [""] // 变更原因
    });

    this.leaderForm = this.fb.group({
      id: ["", [Validators.required]], // 老人id
      name: ["", [Validators.required]], // 老人姓名
      teamId: ["", [Validators.required]], // 班组ID
      nursingId: ["", [Validators.required]] // 护工ID
    });

    GlobalMethod.setForm(this.careLevelForm, {
      userName: this.userInfo.data.name // 记录人
    });

    GlobalMethod.setForm(this.changBedForm, {
      userName: this.userInfo.data.name // 记录人
    });

    GlobalMethod.setForm(this.vacationForm, {
      userName: this.userInfo.data.name // 记录人
    });

    this.disHistoryDate = (current: Date): boolean => {
      return current.getTime() < new Date().getTime();
    };
    // noteTaker: [""], // 记录人
    // accountId: [""] // 登录ID
  }

  ngOnInit() {
    const routerObj = Session.getObj(this.router.url);
    if (!_.isNull(routerObj) && !_.isUndefined(routerObj)) {
      // 判断有没有存储的查询条件
      try {
        this.serValObj = JSON.parse(routerObj);
      } catch (error) {
        console.log("未获取到存储的查询条件");
      }

      // 获取建筑、楼层、房间 备选
      this.serBuild(); // 获取建筑列表
      this.serCareLevel(); // 获取护理等级列表
    }
    this.serFun(); // 查询列表数据
    // if (sessionStorage.getItem(this.router.url) !== null) {
    //   this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    //   if (this.reqObj.building) {
    //     this.onBuildingChange(false);
    //   }
    //   if (this.reqObj.floor) {
    //     this.onFloorChange(false);
    //   }
    // }
    // this.updateList();
    // const that = this;
    // let param = { building: "", floor: "", room: "" };
    // this.httpReq.post("building/searchBuilding", null, param, data => {
    //   sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
    //   if (data["status"] == 200) {
    //     if (data.code == "0") {
    //       that.buildingList = data["data"];
    //     } else {
    //       that.message.error(data["message"]);
    //     }
    //   }
    // });
    // this.httpReq.get("careLevelCase/allList", null, function(data) {
    //   if (data["code"] == 0) {
    //     that.nursingGradeList = data["data"];
    //   }
    // });
  }

  /**
   * 查询建筑列表
   * @memberof ListComponent
   */
  public serBuild() {
    this.entrSer.getBuild((data: any) => {
      if (data.code == 0) {
        this.buildArr = data["data"]; // 获取建筑列表
      }
    });
  }

  /**
   * 改变建筑查询楼层列表
   * @param {string} [buildId=""] // 设置默认值为空
   * @memberof ListComponent
   */
  public changeBuild(buildId: string = "") {
    this.serValObj.floorId = ""; // 重置楼层
    this.serValObj.roomId = ""; // 重置房间
    this.floorArr = []; // 重置楼层列表
    this.roomArr = []; // 重置房间列表
    if (buildId) {
      // 如果有ID,查询楼层列表
      this.serFloor(buildId);
    } else {
      this.serFloor();
    }
  }

  /**
   * 查询楼层列表
   * @param {string} [buildId=""] 建筑ID
   * @memberof ListComponent
   */
  public serFloor(buildId: string = "") {
    if (buildId) {
      // 如果有建筑ID,查询楼层列表
      this.entrSer.getFloor(buildId, (data: any) => {
        this.floorArr = data["data"];
      });
    } else {
      this.serValObj.floorId = ""; // 重置楼层
      this.serValObj.roomId = ""; // 重置房间
      this.floorArr = []; // 重置楼层列表
      this.roomArr = []; // 重置房间列表
    }
    this.serFun(true); // 查询列表数据
  }

  /**
   * 改变楼层查询房间列表
   * @param {string} [id=""] // 设置默认值为空
   * @memberof ListComponent
   */
  public changeFloor(floorId: string = "") {
    this.serValObj.roomId = ""; // 重置房间
    this.roomArr = []; // 重置房间列表
    if (floorId) {
      // 如果有楼层ID,查询房间列表
      this.serRoom(floorId);
    } else {
      this.serRoom();
    }
  }

  /**
   * 查询房间列表
   * @param {string} [floorId=""] 楼层ID
   * @memberof ListComponent
   */
  public serRoom(floorId: string = "") {
    if (floorId) {
      // 如果有楼层ID,查询房间列表
      this.entrSer.getRoom(floorId, (data: any) => {
        this.roomArr = data["data"];
      });
    } else {
      this.serValObj.roomId = ""; // 重置房间
      this.roomArr = []; // 重置房间列表
    }
    this.serFun(true); // 查询列表数据
  }

  /**
   * 查询护理等级
   * @memberof OldmanComponent
   */
  public serCareLevel() {
    this.entrSer.getCareLevel((data: any) => {
      this.careLevelArr = data["data"];
    });
  }

  /**
   * 查询床位号列表
   * @memberof OldmanComponent
   */
  public serBed(bedId: string) {
    const sendObj: any = {};
    sendObj.bedId = bedId;
    this.httpReq.post("attendOn/getBedList", null, sendObj, (data: any) => {
      if (data["code"] == 0) {
        this.bedList = data["data"];
      }
    });
  }

  /**
   * 改变床号
   * @memberof OldmanComponent
   */
  public bedChange(ev: any) {
    if (ev) {
      GlobalMethod.setForm(this.changBedForm, {
        bedId: ev.id // 是否对调
      });
      if (ev.hasPeople == "是") {
        GlobalMethod.setForm(this.changBedForm, {
          exchange: true // 是否对调
        });
      }
    }
  }

  /**
   * 获取护工班组列表
   * @param {string} id 床位ID
   * @memberof OldmanComponent
   */
  public serTeam(id: string) {
    const sendObj: any = {};
    if (_.isString(id) && id.length > 0) {
      sendObj.bedId = id;
      this.httpReq.post("attendOn/getTeamList", null, sendObj, (data: any) => {
        if (data["code"] == 0) {
          this.teamArr = data["data"];
        }
      });
    } else {
      this.nurseArr = [];
    }
  }

  /**
   * 获取护工列表
   * @param {string} id 班组ID
   * @memberof OldmanComponent
   */
  public serNurse(id: string) {
    const sendObj: any = {};
    if (_.isString(id) && id.length > 0) {
      sendObj.id = id;
      this.httpReq.post(
        "attendOn/getTeamManList",
        null,
        sendObj,
        (data: any) => {
          if (data["code"] == 0) {
            this.nurseArr = data["data"];
          } else {
            this.nurseArr = [];
          }
        }
      );
    } else {
      this.nurseArr = [];
    }
  }

  /**
   * 查询列表数据
   * @param {boolean} [isRest=false] // 是否重置查询条件
   * @memberof ListComponent
   */
  public serFun(isRest: boolean = false) {
    if (isRest) {
      this.serValObj.page = 0;
    } else {
      // 接口页码 page 从0下标位开始
      this.serValObj.page = this.serValObj.page - 1;
      if (this.serValObj.page < 0) {
        this.serValObj.page = 0;
      }
    }
    this.isTableLoading = true;
    this.httpReq.post(
      "attendOn/getAttendOnList",
      null,
      this.serValObj,
      data => {
        Session.setObj(this.router.url, JSON.stringify(this.serValObj));
        this.serValObj.page++;
        this.isTableLoading = false;
        if (data["code"] == 0) {
          Session.setObj(this.router.url, JSON.stringify(this.serValObj));
          // this.isSelAll = false; // 取消全选
          // this.indeState = false; // 改变全选样式
          // this.selIdArr = []; // 清空选择的ID
          // this.selObjArr = []; // 清空选择的对象
          try {
            this.dataList = data["data"]["content"]; // 数据列表
          } catch (error) {
            this.dataList = []; // 数据列表
          }
          this.serValObj.totalItem = data["data"]["totalElements"]; // 总条数
        } else {
          if (data["message"]) {
            this.msg.error(data["message"]);
          } else {
            this.msg.error("请求数据失败！");
          }
        }
      }
    );
  }

  /**
   * 改变页码重新查询数据
   * @param {number} pageIndex
   * @memberof OldmanComponent
   */
  public changePage(pageIndex: number) {
    this.serValObj.page = pageIndex;
    this.serFun();
  }

  /**
   * 打开模态框
   * @param {string} type
   * @param {*} obj
   * @memberof OldmanComponent
   */
  public openModal(type: string, obj: any) {
    if (type == "调整等级") {
      console.log(obj);
      GlobalMethod.setForm(this.careLevelForm, {
        id: "", // 老人id
        name: "", // 老人姓名
        oldlevelName: "", // 原护理等级名称
        levelName: "", // 护理等级名称
        remark: "" // 变更原因
      });
      if (_.isString(obj.oldManId) && obj.oldManId.length > 0) {
        this.isShowCareLevel = true;
        GlobalMethod.setForm(this.careLevelForm, {
          id: obj.oldManId, // 老人id
          name: obj.name, // 老人姓名
          oldlevelName: obj.careLevel // 原护理等级名称
        });
      } else {
        this.msg.error("未获取到老人身份信息");
      }
    } else if (type == "更换床位") {
      GlobalMethod.setForm(this.changBedForm, {
        id: "", // 老人id
        name: "", // 老人姓名
        oldBedNum: "", // 原床号
        bedId: "", // 床ID
        exchange: false, // 是否对调床（默认：否；对调：是）
        remark: "" // 变更原因
      });
      this.bedObj = {};
      if (_.isString(obj.oldManId) && obj.oldManId.length > 0) {
        this.isShowChangBed = true;
        GlobalMethod.setForm(this.changBedForm, {
          id: obj.oldManId, // 老人id
          name: obj.name, // 老人姓名
          oldBedNum: obj.bedNum // 原床号
        });
        this.serBed(obj.id); // 获取床位号列表
      } else {
        this.msg.error("未获取到老人身份信息");
      }
    } else if (type == "请假外出") {
      GlobalMethod.setForm(this.vacationForm, {
        id: "", // 老人id
        name: "", // 老人姓名
        returnDate: "", // 预计返回时间
        remark: "" // 变更原因
      });
      if (_.isString(obj.oldManId) && obj.oldManId.length > 0) {
        this.isShowVacation = true;
        GlobalMethod.setForm(this.vacationForm, {
          id: obj.oldManId, // 老人id
          name: obj.name // 老人姓名
        });
      } else {
        this.msg.error("未获取到老人身份信息");
      }
    } else if (type == "分配责任") {
      GlobalMethod.setForm(this.leaderForm, {
        id: "", // 老人id
        name: "", // 老人姓名
        teamId: "", // 班组ID
        nursingId: "" // 护工ID
      });
      this.serTeam(obj.id); // 获取班组列表
      if (_.isString(obj.oldManId) && obj.oldManId.length > 0) {
        this.isShowLeader = true;
        GlobalMethod.setForm(this.leaderForm, {
          id: obj.oldManId, // 老人id
          name: obj.name // 老人姓名
        });
      } else {
        this.msg.error("未获取到老人身份信息");
      }
    }
  }

  /**
   * 护理等级取消事件
   * @memberof OldmanComponent
   */
  public careLevelCancel() {
    this.isShowCareLevel = false;
    this.careLevelLoading = false;
  }

  /**
   * 护理等级确认事件
   * @memberof OldmanComponent
   */
  public careLevelOk() {
    const formDataCtrl = this.careLevelForm.controls;
    const formData = this.jsUtil.deepClone(this.careLevelForm.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }
    console.log(this.careLevelForm);
    console.log(formData);
    if (this.careLevelForm.invalid) {
      // 表单较验未通过
      return;
    }
    this.careLevelLoading = true;
    this.httpReq.post("attendOn/changeLevel", null, formData, (data: any) => {
      this.careLevelLoading = false;
      this.isShowCareLevel = false;
      if (data["code"] == 0) {
        this.serFun();
        this.msg.success("保存成功！");
        // this.jumpPage("../");
      }
    });
  }

  /**
   * 更换床位取消事件
   * @memberof OldmanComponent
   */
  public changBedCancel() {
    this.isShowChangBed = false;
    this.changBedLoading = false;
  }

  /**
   * 更换床位确认事件
   * @memberof OldmanComponent
   */
  public changBedOk() {
    const formDataCtrl = this.changBedForm.controls;
    const formData = this.jsUtil.deepClone(this.changBedForm.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }
    console.log(this.changBedForm);
    console.log(formData);
    if (this.changBedForm.invalid) {
      // 表单较验未通过
      return;
    }
    this.changBedLoading = true;
    formData.exchange = formData.exchange ? "是" : "否";
    this.httpReq.post("attendOn/changeBed", null, formData, (data: any) => {
      this.changBedLoading = false;
      this.isShowChangBed = false;
      if (data["code"] == 0) {
        this.serFun();
        this.msg.success("保存成功！");
        // this.jumpPage("../");
      }
    });
  }

  /**
   * 请假外出取消事件
   * @memberof OldmanComponent
   */
  public vacationCancel() {
    this.isShowVacation = false;
    this.vacationLoading = false;
  }

  /**
   * 请假外出确认事件
   * @memberof OldmanComponent
   */
  public vacationOk() {
    const formDataCtrl = this.vacationForm.controls;
    const formData = this.jsUtil.deepClone(this.vacationForm.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }
    console.log(this.vacationForm);
    console.log(formData);
    if (this.vacationForm.invalid) {
      // 表单较验未通过
      return;
    }
    this.vacationLoading = true;
    formData.returnDate = this.jsUtil.dateFormat(
      formData.returnDate,
      "YYYY-MM-DD HH:mm:ss"
    ); // 入住时间
    this.httpReq.post("attendOn/leaveOut", null, formData, (data: any) => {
      this.vacationLoading = false;
      this.isShowVacation = false;
      if (data["code"] == 0) {
        this.serFun();
        this.msg.success("保存成功！");
        // this.jumpPage("../");
      }
    });
  }

  /**
   * 请假回归
   * @param {*} obj
   * @memberof OldmanComponent
   */
  public vacationBack(obj: any) {
    this.modalService.confirm({
      nzTitle: "确认该老人已经回归？",
      nzContent: `<b class="ftz14">${obj.name}</b>`,
      nzOnOk: () => {
        const sendObj: any = {
          id: obj.oldManId,
          userName: this.userInfo.data.name
        };
        this.httpReq.post("attendOn/leaveBack", null, sendObj, (data: any) => {
          if (data["code"] == 0) {
            this.serFun();
            this.msg.success("保存成功！");
            // this.jumpPage("../");
          }
        });
      }
    });
  }

  /**
   * 分配负责人取消事件
   * @memberof OldmanComponent
   */
  public leaderCancel() {
    this.isShowLeader = false;
    this.leaderLoading = false;
  }

  /**
   * 分配负责人确认事件
   * @memberof OldmanComponent
   */
  public leaderOk() {
    const formDataCtrl = this.leaderForm.controls;
    const formData = this.jsUtil.deepClone(this.leaderForm.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }
    console.log(this.leaderForm);
    console.log(formData);
    if (this.leaderForm.invalid) {
      // 表单较验未通过
      return;
    }
    this.leaderLoading = true;
    this.httpReq.post(
      "attendOn/changeAllocation",
      null,
      formData,
      (data: any) => {
        this.leaderLoading = false;
        this.isShowLeader = false;
        if (data["code"] == 0) {
          this.serFun();
          this.msg.success("保存成功！");
          // this.jumpPage("../");
        }
      }
    );
  }

  /**
   * 进入老人档案
   * @param {*} id
   * @param {MouseEvent} [e]
   * @memberof OldmanComponent
   */
  public oldManArchives(id: string, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(
      ["/nursingHome/nursingManage/hospitalFile/elderInfo", id],
      {
        relativeTo: this.actRoute
      }
    );
  }

  // 跳转照护计划
  toCarePlanPage(id) {
    if (id)
      this.router.navigate(["serviceCare", { olderId: id }], {
        relativeTo: this.actRoute.parent.parent
      });
  }

  // turnToNurseList(id, e?: MouseEvent) {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   this.router.navigate(["nurseList", JSON.stringify(id)], {
  //     relativeTo: this.route
  //   });
  // }

  // createMessage(type: string, mess: string): void {
  //   this.message.create(type, `${mess}`);
  // }

  // updateList(reset: boolean = false): void {
  //   if (reset) {
  //     this.reqObj.page = 0;
  //   } else {
  //     //接口page从0下标位开始
  //     this.reqObj.page = this.reqObj.page - 1;
  //     if (this.reqObj.page < 0) {
  //       this.reqObj.page = 0;
  //     }
  //   }

  //   const that = this;

  //   let param = this.httpReq.post("oldman/list1", null, that.reqObj, data => {
  //     sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
  //     if (data["status"] == 200) {
  //       if (data.code == "0") {
  //         that.reqObj.page++;
  //         that.total = data["data"]["totalElements"];
  //         that.list = data["data"]["content"];
  //       } else {
  //         that.createMessage("error", data["message"]);
  //       }
  //     }
  //   });
  // }
  // onPageIndexChange(curIndex: Number) {
  //   this.updateList();
  // }

  // onBuildingChange(isSetBuilding: boolean = true) {
  //   this.roomList = new Array();

  //   if (isSetBuilding) {
  //     this.reqObj.floor = "";
  //     this.reqObj.room = "";
  //   }

  //   if (this.reqObj.building === "") {
  //     this.floorList = new Array();
  //   } else {
  //     // console.log('building:' + this.building);
  //     const that = this;
  //     let param = { building: this.reqObj.building, floor: "", room: "" };
  //     this.httpReq.post("building/searchBuilding", null, param, data => {
  //       sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
  //       if (data["status"] == 200) {
  //         if (data.code == "0") {
  //           that.floorList = data["data"];
  //         } else {
  //           that.message.error(data["message"]);
  //         }
  //       }
  //     });
  //   }
  // }

  // onFloorChange(isSetFloor: boolean = true) {
  //   if (isSetFloor) {
  //     this.reqObj.room = "";
  //   }
  //   if (this.reqObj.floor === "") {
  //     this.roomList = new Array();
  //   } else {
  //     const that = this;

  //     let param = {
  //       building: that.reqObj.building,
  //       floor: that.reqObj.floor,
  //       room: ""
  //     };
  //     this.httpReq.post("building/searchBuilding", null, param, data => {
  //       sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
  //       if (data["status"] == 200) {
  //         if (data.code == "0") {
  //           that.roomList = data["data"];
  //         } else {
  //           that.message.error(data["message"]);
  //         }
  //       }
  //     });
  //   }
  // }
}
