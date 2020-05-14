import { Component, OnInit, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import * as _ from "underscore"; // underscore工具类
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";
import { GlobalService } from "../../../common/service/GlobalService";
import { pageObj } from "../../../common/config/config";
import { Session, Local } from "src/app/common/service/Storage";
import { ENgxPrintComponent } from "e-ngx-print";
import { EntrustMedicineService } from "../entrust-medicine.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  totalTit: any;
  public buildArr = []; // 建筑列表
  public floorArr = []; // 楼层列表
  public roomArr = []; // 房间列表
  public isTableLoading = false; // table加载动画显示状态
  public isOkLoading = false; // 提交数据加载动画
  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = [
    "assets/css/common.css",
    "assets/css/ng-zorro-antd.min.css"
  ]; // 打印内容css文件路径
  public printStyle: string = ``;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件

  public serValObj: any = {
    page: pageObj.currentPage, // 列表页码
    size: pageObj.everyItem, // 列表条数
    totalItem: pageObj.totalItem, // 总条数
    name: "", // 病人姓名
    buildId: "", // 建筑
    floorId: "", // 楼层
    roomId: "" // 房间
  }; // 定义查询请求对象
  // hasSendOver: "0" // 当天是否发药完成 0未完成/1已完成

  public isVisible = false; // 确认框是否可见

  public dataList: Array<object> = []; // 后台返回的数据列表

  public indeState: boolean = false; // 全选框的填充状态
  public isSelAll: boolean = false; // 是否全选
  public isShowOper: boolean = true; // 是否显示操作列
  public selIdArr: Array<string> = []; // 选择的ID数组
  public selObjArr: Array<any> = []; // 选择的ID数组

  public formData: any = {
    idArr: "", // 所勾选待发药老人id(多个老人id拼String用逗号隔开)
    receiver: "", // 领用人
    accountId: "" // 账户id
  }; // 要提交给后台的数据对象
  // [nzFrontPagination]	是否在前端对数据进行分页
  // [nzTotal]	当前总数据，在服务器渲染时需要传入
  // [nzPageIndex]	当前页码，可双向绑定
  // [nzPageSize]	每页展示多少数据，可双向绑定
  // [nzLoading]	页面是否加载中
  // [nzLoadingDelay]	延迟显示加载效果的时间（防止闪烁）
  // [nzNoResult]	无数据时显示内容
  // [nzPageSizeOptions]	页数选择器可选值
  // (nzPageIndexChange)	当前页码改版时的回调函数
  // (nzPageSizeChange)	页数改变时的回调函数
  // (nzCurrentPageDataChange)	当前页面展示数据改变的回调函数

  constructor(
    private httpReq: HttpReqService, // 请求数据服务
    private jsUtil: JsUtilsService, // JS自定义工具类
    private router: Router, // 跳转路由
    private actRoute: ActivatedRoute, // 获取传递的参数
    private gloSer: GlobalService, // 全局服务
    private msg: NzMessageService, // 消息提示服务
    private entrSer: EntrustMedicineService // 获层建筑、楼层、房间
  ) {
    const loginInfo = Local.getObj("UserInfo");
    try {
      this.formData.accountId = loginInfo.data.id;
    } catch (error) {
      this.msg.error("获取ID失败");
    }

    // const listObj: any = {
    //   id: "", // ID
    //   name: "赵展展", // 姓名
    //   bedName: "203", // 床位
    //   medList: [
    //     {
    //       id: "111", // ID
    //       medName: "111", // 药品
    //       specification: "111", // 规格
    //       effect: "111", // 作用
    //       medTotal: "111", // 剩于数量
    //       limitDate: "111", // 服用期限
    //       takeDate: "111", // 服药日期
    //       dosage: "111", // 剂量（片/次）
    //       frequency: "111" // 频次
    //     },
    //     {
    //       id: "22", // ID
    //       medName: "22", // 药品
    //       specification: "22", // 规格
    //       effect: "22", // 作用
    //       medTotal: "22", // 剩于数量
    //       limitDate: "22", // 服用期限
    //       takeDate: "22", // 服药日期
    //       dosage: "22", // 剂量（片/次）
    //       frequency: "22" // 频次
    //     }
    //   ]
    // };
    // for (let i = 0; i < 5; i++) {
    //   const copyObj = this.jsUtil.deepClone(listObj);
    //   copyObj.id = i.toString();
    //   this.dataList.push(copyObj);
    // }
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
      // this.serBuild().then();
      // this.entrSer.getBuild((data: any) => {
      //   return new Promise((resolv, reject) => {
      //     if (data.code == 0) {
      //       this.buildArr = data["data"];
      //       if (!this.serValObj.buildId) {
      //         try {
      //           this.serValObj.buildId = data["data"][0].id;
      //         } catch (error) {
      //           this.serValObj.buildId = "";
      //         }
      //       }
      //       this.floorArr = []; // 楼层列表
      //       this.roomArr = []; // 房间列表
      //       this.serValObj.buildId = "";
      //       resolv(this.serValObj.buildId);
      //     }
      //   }).then((buildId: string) => {
      //     this.reFreshBuild(buildId, false); // 建筑更新重置楼层
      //   });
      // });

      // if (
      //   !_.isEmpty(this.serValObj.btime) &&
      //   !_.isEmpty(this.serValObj.etime)
      // ) {
      //   this.serValObj.date.push(new Date(this.serValObj.btime));
      //   this.serValObj.date.push(new Date(this.serValObj.etime));
      // }

      // if (
      //   !_.isEmpty(this.serValObj.ebtime) &&
      //   !_.isEmpty(this.serValObj.eetime)
      // ) {
      //   this.serValObj.eDate.push(new Date(this.serValObj.ebtime));
      //   this.serValObj.eDate.push(new Date(this.serValObj.eetime));
      // }
    }
    this.serFun(); // 查询列表数据
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
    // return new Promise((resolv, reject) => {
    //   if (data.code == 0) {
    //     this.buildArr = data["data"];
    //     if (!this.serValObj.buildId) {
    //       try {
    //         this.serValObj.buildId = data["data"][0].id;
    //       } catch (error) {
    //         this.serValObj.buildId = "";
    //       }
    //     }
    //     this.floorArr = []; // 楼层列表
    //     this.roomArr = []; // 房间列表
    //     this.serValObj.buildId = "";
    //     resolv();
    //   }
    // }).then((buildId: string) => {
    //   console.log("获取成功");
    //   this.reFreshBuild(buildId, false); // 建筑更新重置楼层
    // });
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

  /** 建筑更新重置楼层
   * @param {*} buildId 建筑ID
   * @param {Boolean} [changeFloor=true] 是否将楼层置新
   * @memberof EntrustMedicineComponent
   */
  // public reFreshBuild(buildId: string, changeFloor: Boolean = true) {
  //   this.entrSer.getFloor(buildId, (data: any) => {
  //     return new Promise((resolv, reject) => {
  //       if (data.code == 0) {
  //         this.floorArr = data["data"];
  //         if (changeFloor || !this.serValObj.floorId) {
  //           try {
  //             this.serValObj.floorId = data["data"][0].id;
  //           } catch (error) {
  //             this.serValObj.floorId = "";
  //           }
  //         }
  //         this.roomArr = []; // 房间列表
  //         this.serValObj.floorId = "";
  //         resolv(this.serValObj.floorId);
  //       }
  //     }).then((floorId: string) => {
  //       this.reFreshFloor(floorId, changeFloor); // 楼层更新重置房间
  //     });
  //   });
  // }

  /** 楼层更新重置房间
   * @param {*} floorId
   * @param {Boolean} [changeRoom=true] 是否将房间置新
   * @memberof EntrustMedicineComponent
   */
  // public reFreshFloor(floorId: string, changeRoom: Boolean = true) {
  //   this.entrSer.getRoom(floorId, data => {
  //     if (data.code == 0) {
  //       this.roomArr = data["data"];
  //       if (changeRoom || !this.serValObj.roomId) {
  //         try {
  //           this.serValObj.roomId = data["data"][0].id;
  //         } catch (error) {
  //           this.serValObj.roomId = "";
  //         }
  //         this.serValObj.roomId = "";
  //       }
  //       this.serFun(); // 查询列表数据
  //     }
  //   });
  // }

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
    this.httpReq.post("readyForSendlist", null, this.serValObj, data => {
      Session.setObj(this.router.url, JSON.stringify(this.serValObj));
      this.serValObj.page++;
      this.isTableLoading = false;
      if (data["code"] == 0) {
        Session.setObj(this.router.url, JSON.stringify(this.serValObj));
        this.isSelAll = false; // 取消全选
        this.indeState = false; // 改变全选样式
        this.selIdArr = []; // 清空选择的ID
        this.selObjArr = []; // 清空选择的对象
        try {
          this.dataList = data["data"]["list"]; // 数据列表
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
    });
  }

  /**
   * 日期插件时间发生变化的回调
   * @param {Array<Date>} dateArr // 日期数组
   * @memberof ListComponent
   */
  public selDate(dateArr: Array<Date>) {
    if (dateArr[0]) {
      this.serValObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.serValObj.btime = "";
    }
    if (dateArr[1]) {
      this.serValObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.serValObj.etime = "";
    }
  }

  /**
   * 日期切换监听
   * @param {Array<Date>} dateArr // 日期数组
   * @memberof ListComponent
   */
  // public selEDate(dateArr: Array<Date>) {
  //   if (dateArr[0]) {
  //     this.serValObj.ebtime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
  //   } else {
  //     this.serValObj.ebtime = "";
  //   }
  //   if (dateArr[1]) {
  //     this.serValObj.eetime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
  //   } else {
  //     this.serValObj.eetime = "";
  //   }
  // }

  /**
   * 删除数据
   * @param {any} id 要删除的数据对象ID
   * @memberof ListComponent
   */
  public delFun(id: any) {
    const reqObj: any = {};
    reqObj.id = id;

    let that = this;
    that.isTableLoading = true;
    this.httpReq.post("consulting/del", null, reqObj, data => {
      that.isTableLoading = false;
      if (data["status"] == 200) {
        this.msg.success("删除成功！");
        this.serFun(); // 调用查询列表方法更新列表
      }
    });
  }

  /**
   * 单击删除按钮
   * @param {any} id 要删除的数据对象ID
   * @memberof ListComponent
   */
  public clickDelBtn(id: any): void {
    this.gloSer.delModal(() => {
      this.delFun(id);
    });
  }

  /**
   * 改变路由跳转页面
   * @param {string} url 相对路径或绝对路径 ex:'info'或'../info'或'/nursingHome/medical'
   * @param {*} paramObj 要传递的参数信息对象
   */
  public jumpPage(url: string, param?: any): void {
    if (param) {
      GlobalMethod.changeRoute(url, this.router, this.actRoute, param);
    } else {
      GlobalMethod.changeRoute(url, this.router, this.actRoute);
    }
  }

  /**
   * 判断当前ID是否选择
   * @param {string} id
   * @memberof ListComponent
   */
  public isChecked(id: string) {
    return this.selIdArr.indexOf(id) !== -1;
  }

  /**
   * 选择所有
   * @param {EventEmitter<boolean>} ev 是否勾选
   * @memberof ListComponent
   */
  public checkAll(ev: EventEmitter<boolean>) {
    this.selIdArr = []; // 清空选择的ID
    this.selObjArr = []; // 清空选择的对象

    if (ev) {
      // 勾选全选
      this.dataList.forEach((val: any) => {
        this.selIdArr.push(val.id);
        this.selObjArr.push(val);
      });
      this.isSelAll = true;
      this.indeState = false;
    } else {
      // 取消勾选全选
      this.isSelAll = false;
      this.indeState = false;
    }
    console.log(this.selIdArr);
    console.log(this.selObjArr);
  }

  /**
   * 选择单个
   * @param {EventEmitter<boolean>} ev 是否勾选
   * @param {string} id 行ID
   * @param {any} obj 行对象
   * @memberof ListComponent
   */
  public checkSingle(ev: EventEmitter<boolean>, id: string, obj: any) {
    const isSel: boolean = this.selIdArr.indexOf(id) !== -1; // 已选中
    if (isSel) {
      // 已选中后再次单击为取消勾选
      const idx = this.selIdArr.indexOf(id); // 要删除的ID索引值
      this.selIdArr.splice(idx, 1);
      this.selObjArr.splice(idx, 1);
    } else {
      // 未选中后再次单击为勾选
      this.selIdArr.push(id);
      this.selObjArr.push(obj);
    }
    const len = this.selIdArr.length;
    if (len == 0) {
      this.isSelAll = false;
      this.indeState = false;
    } else if (len > 0 && len < this.dataList.length) {
      this.isSelAll = true;
      this.indeState = true;
    } else {
      this.isSelAll = true;
      this.indeState = false;
    }
    console.log(this.selIdArr);
    console.log(this.selObjArr);
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
    this.isShowOper = false; // 是否显示操作列
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isPrintNow = false;
    this.isShowOper = true; // 是否显示操作列
  }

  /**
   * 显示弹出框
   * @memberof ListComponent
   */
  public showModal(): void {
    this.isVisible = true;
  }

  /**
   * 点击确认按钮
   * @memberof ListComponent
   */
  public handleOk(): void {
    if (this.selIdArr.length == 0) {
      this.msg.error("请选择要发药的老人！");
      return;
    }
    if (!this.formData.receiver) {
      this.msg.error("请填写领用人！");
      return;
    }
    this.formData.idArr = this.selIdArr.join(",");
    this.isOkLoading = true; // 正在提交
    const sendObj = this.jsUtil.deepClone(this.formData);
    this.httpReq.post("dtSendMed", null, sendObj, (data: any) => {
      if (data["code"] == 0) {
        this.isOkLoading = false; // 正在提交
        this.isVisible = false;
        this.msg.success("批量发药成功！");
        this.serFun(); // 刷新列表
      } else {
        if (data["message"]) {
          // this.msg.error(data["message"]);
        } else {
          this.msg.error("提交数据失败！");
        }
        this.isOkLoading = false; // 正在提交
      }
    });
  }

  /**
   * 点击取消按钮
   * @memberof ListComponent
   */
  public handleCancel(): void {
    this.isVisible = false;
  }
}
