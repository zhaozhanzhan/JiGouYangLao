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

@Component({
  selector: "app-parti-def-list",
  templateUrl: "./parti-def-list.component.html",
  styleUrls: ["./parti-def-list.component.css"]
})
export class PartiDefListComponent implements OnInit {
  // public buildArr = []; // 建筑列表
  // public floorArr = []; // 楼层列表
  // public roomArr = []; // 房间列表
  totalTit;
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
    medName: "", // 药品名称或通用名首字母拼音
    status: "" // 0停用1启用
    // bDate: "", // Date	采购申请开始时间
    // eDate: "", // Date	采购结束开始时间
    // status: "", // String	审批状态
    // inStatus: "" // String	入库状态
  }; // 定义查询请求对象

  public isVisible = false; // 确认框是否可见

  public dataList: Array<object> = []; // 后台返回的数据列表

  public indeState: boolean = false; // 全选框的填充状态
  public isSelAll: boolean = false; // 是否全选
  public isShowOper: boolean = true; // 是否显示操作列
  public selIdArr: Array<string> = []; // 选择的ID数组
  public selObjArr: Array<any> = []; // 选择的ID数组

  public drugList: Array<any> = []; // 药品列表
  public selDrugObj: any = {}; // 选择的药品对象

  public modalState: string = "add"; // 拆药模版弹窗状态

  public confirmBox: boolean = false; // 确认框
  public confirmState: boolean = false; // 启用或停用
  public tempId: string = ""; // 要停用或启用的模版ID

  public formData: any = {
    id: "", // 药品拆零模板主键Id
    medId: "", // 药品id
    medName: "", // 药品名称
    copies: "1", // 拆分每份数量
    specification: "", // 规格
    largePackingUnit: "", // 大包装单位
    minPackingUnit: "", // 小包装单位
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
    private msg: NzMessageService // 消息提示服务
  ) {
    const loginInfo = Local.getObj("UserInfo");
    try {
      this.formData.accountId = loginInfo.data.id;
    } catch (error) {
      this.msg.error("获取ID失败");
    }

    // const listObj: any = {
    //   id: "", // ID
    //   title: "申请概述申请概述申请概述申请概述", //	String	申请概述
    //   applyCompany: "申请单位申请单位申请单位申请单位", //	String	申请单位
    //   applyer: "申请人", //	String	申请人
    //   applyDate: "申请时间", //	Date	申请时间
    //   comment: "申请备注申请备注申请备注申请备注申请备注申请备注", //	String	申请备注
    //   status: "审批状态", //	String	审批状态
    //   inStatus: "采购单入库状态" //	String	采购单入库状态
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
      // this.serBuild(); // 获取建筑列表
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

      if (
        !_.isEmpty(this.serValObj.bDate) &&
        !_.isEmpty(this.serValObj.eDate)
      ) {
        this.serValObj.date.push(new Date(this.serValObj.bDate));
        this.serValObj.date.push(new Date(this.serValObj.eDate));
      }
    }
    this.serFun(); // 查询列表数据
  }

  /**
   * 查询建筑列表
   * @memberof PartiDefListComponent
   */
  public serBuild() {
    // this.entrSer.getBuild((data: any) => {
    //   if (data.code == 0) {
    //     this.buildArr = data["data"]; // 获取建筑列表
    //   }
    // });
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
    //   this.reFreshBuild(buildId, false); // 建筑更新重置楼层
    // });
  }

  /**
   * 改变建筑查询楼层列表
   * @param {string} [buildId=""] // 设置默认值为空
   * @memberof PartiDefListComponent
   */
  // public changeBuild(buildId: string = "") {
  //   this.serValObj.floorId = ""; // 重置楼层
  //   this.serValObj.roomId = ""; // 重置房间
  //   this.floorArr = []; // 重置楼层列表
  //   this.roomArr = []; // 重置房间列表
  //   if (buildId) {
  //     // 如果有ID,查询楼层列表
  //     this.serFloor(buildId);
  //   } else {
  //     this.serFloor();
  //   }
  // }

  /**
   * 查询楼层列表
   * @param {string} [buildId=""] 建筑ID
   * @memberof PartiDefListComponent
   */
  // public serFloor(buildId: string = "") {
  //   if (buildId) {
  //     // 如果有建筑ID,查询楼层列表
  //     // this.entrSer.getFloor(buildId, (data: any) => {
  //     //   this.floorArr = data["data"];
  //     // });
  //   } else {
  //     this.serValObj.floorId = ""; // 重置楼层
  //     this.serValObj.roomId = ""; // 重置房间
  //     this.floorArr = []; // 重置楼层列表
  //     this.roomArr = []; // 重置房间列表
  //   }
  //   this.serFun(true); // 查询列表数据
  // }

  /**
   * 改变楼层查询房间列表
   * @param {string} [id=""] // 设置默认值为空
   * @memberof PartiDefListComponent
   */
  // public changeFloor(floorId: string = "") {
  //   this.serValObj.roomId = ""; // 重置房间
  //   this.roomArr = []; // 重置房间列表
  //   if (floorId) {
  //     // 如果有楼层ID,查询房间列表
  //     this.serRoom(floorId);
  //   } else {
  //     this.serRoom();
  //   }
  // }

  /**
   * 查询房间列表
   * @param {string} [floorId=""] 楼层ID
   * @memberof PartiDefListComponent
   */
  // public serRoom(floorId: string = "") {
  //   if (floorId) {
  //     // 如果有楼层ID,查询房间列表
  //     // this.entrSer.getRoom(floorId, (data: any) => {
  //     //   this.roomArr = data["data"];
  //     // });
  //   } else {
  //     this.serValObj.roomId = ""; // 重置房间
  //     this.roomArr = []; // 重置房间列表
  //   }
  //   this.serFun(true); // 查询列表数据
  // }

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
   * @memberof PartiDefListComponent
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
    this.httpReq.post("med_div/listPage", null, this.serValObj, (data: any) => {
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
    });
  }

  /**
   * 日期插件时间发生变化的回调
   * @param {Array<Date>} dateArr // 日期数组
   * @memberof PartiDefListComponent
   */
  public selDate(dateArr: Array<Date>) {
    if (dateArr[0]) {
      this.serValObj.bDate = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.serValObj.bDate = "";
    }
    if (dateArr[1]) {
      this.serValObj.eDate = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.serValObj.eDate = "";
    }
  }

  /**
   * 日期切换监听
   * @param {Array<Date>} dateArr // 日期数组
   * @memberof PartiDefListComponent
   */
  // public selEDate(dateArr: Array<Date>) {
  //   if (dateArr[0]) {
  //     this.serValObj.ebDate = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
  //   } else {
  //     this.serValObj.ebDate = "";
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
   * @memberof PartiDefListComponent
   */
  public delFun(id: any) {
    const reqObj: any = {};
    reqObj.id = id;
    reqObj.accountId = this.formData.accountId;
    let that = this;
    that.isTableLoading = true;
    this.httpReq.post("med_div/delete", null, reqObj, data => {
      that.isTableLoading = false;
      if (data["code"] == 0) {
        this.msg.success("删除成功！");
        this.serFun(); // 调用查询列表方法更新列表
      }
    });
  }

  /**
   * 单击删除按钮
   * @param {any} id 要删除的数据对象ID
   * @memberof PartiDefListComponent
   */
  public clickDelBtn(id: any): void {
    const loginInfo = Local.getObj("UserInfo");
    try {
      this.formData.accountId = loginInfo.data.id;
    } catch (error) {
      this.msg.error("获取账户ID失败");
      return;
    }
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
   * @memberof PartiDefListComponent
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
  }

  /**
   * 选择单个
   * @param {EventEmitter<boolean>} ev 是否勾选
   * @param {string} id 行ID
   * @param {any} obj 行对象
   * @memberof PartiDefListComponent
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
   * @param {string} state 添加或修改数据的状态
   * @param {*} [obj]
   * @memberof PartiDefListComponent
   */
  public showModal(state: string, obj?: any): void {
    this.serDrug(""); // 查询药品数据
    this.modalState = state;
    if (state == "add") {
      this.selDrugObj = "";
      this.formData.id = ""; // 药品id
      this.formData.medId = ""; // 药品id
      this.formData.medName = ""; // 药品名称
      this.formData.specification = ""; // 规格
      this.formData.largePackingUnit = ""; // 大包装单位
      this.formData.minPackingUnit = ""; // 小包装单位
      this.formData.copies = 1; // 大包装份数
    } else {
      this.formData.id = obj.id; // 模版
      this.formData.medId = obj.medDrug ? obj.medDrug.id : ""; // 药品id
      this.formData.medName = obj.medName; // 药品名称
      this.formData.specification = obj.specification; // 规格
      this.formData.largePackingUnit = obj.largePackingUnit; // 大包装单位
      this.formData.minPackingUnit = obj.minPackingUnit; // 小包装单位
      this.formData.copies = obj.copies; // 大包装份数
    }
    this.isVisible = true;
  }

  /**
   * 点击确认按钮
   * @memberof ListComponent
   */
  public handleOk(): void {
    if (!this.formData.medId) {
      this.msg.error("请选择药品！");
      return;
    }
    if (!this.formData.copies) {
      this.msg.error("请填写份数！");
      return;
    }
    this.isOkLoading = true; // 正在提交
    const sendObj = this.jsUtil.deepClone(this.formData);
    this.httpReq.post(
      "med_div/saveOrEditTemplate",
      null,
      sendObj,
      (data: any) => {
        if (data["code"] == 0) {
          this.isOkLoading = false; // 正在提交
          this.isVisible = false;
          this.msg.success("保存成功");
          this.serFun(); // 刷新列表
        } else {
          if (data["message"]) {
            // this.msg.error(data["message"]);
          } else {
            this.msg.error("提交数据失败！");
          }
          this.isOkLoading = false; // 正在提交
        }
      }
    );
  }

  /**
   * 点击取消按钮
   * @memberof PartiDefListComponent
   */
  public handleCancel(): void {
    this.isVisible = false;
  }

  /**
   * 查询药品数据
   * @param {string} name
   * @memberof PartiDefListComponent
   */
  public serDrug(name: string = "") {
    const reqObj: any = { page: 0, size: 10, search: name };
    this.httpReq.post("med_div/listMedChose", null, reqObj, (data: any) => {
      if (data["code"] == 0) {
        this.drugList = JSON.parse(data["data"]);
      } else {
        this.drugList = [];
      }
    });
  }

  /**
   * 选择药品
   * @memberof PartiDefListComponent
   */
  public selDrug(ev: any) {
    if (_.isObject(ev) && !_.isEmpty(ev)) {
      this.formData.medId = ev.medId; // 药品id
      this.formData.medName = ev.medName; // 药品名称
      this.formData.specification = ev.specification; // 规格
      this.formData.largePackingUnit = ev.largePackingUnit; // 大包装单位
      this.formData.minPackingUnit = ev.minPackingUnit; // 小包装单位
    } else {
      this.formData.medId = ""; // 药品id
      this.formData.medName = ""; // 药品名称
      this.formData.specification = ""; // 规格
      this.formData.largePackingUnit = ""; // 大包装单位
      this.formData.minPackingUnit = ""; // 小包装单位
    }
  }

  /**
   * 显示启用停用确认框
   * @param {boolan} state true 启用 false 停用
   * @memberof PartiDefListComponent
   */
  public showConfirmBox(state: boolean, id: string) {
    this.confirmBox = true;
    this.confirmState = state;
    this.tempId = id;
  }

  /**
   * 点击确认按钮
   * @memberof ListComponent
   */
  public confirmOk(): void {
    const sendObj: any = {
      id: this.tempId, // 药品拆零模板主键Id
      status: this.confirmState ? "1" : "0", // 0停用1启用
      accountId: this.formData.accountId // 账户id
    };
    this.isOkLoading = true; // 正在提交
    this.httpReq.post(
      "med_div/startAndStopTemp",
      null,
      sendObj,
      (data: any) => {
        if (data["code"] == 0) {
          this.isOkLoading = false; // 正在提交
          this.confirmBox = false;
          this.msg.success("提交成功");
          this.serFun(); // 刷新列表
        } else {
          if (data["message"]) {
            // this.msg.error(data["message"]);
          } else {
            this.msg.error("提交数据失败！");
          }
          this.isOkLoading = false; // 正在提交
        }
      }
    );
  }

  /**
   * 点击取消按钮
   * @memberof PartiDefListComponent
   */
  public confirmCancel(): void {
    this.confirmBox = false;
  }

  // 格式化输入数值禁止输入小数
  parInt = (value: string) => value.replace(".", "");
}
