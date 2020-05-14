import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { pageObj } from "../../../common/config/config";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import * as _ from "underscore"; // underscore工具类
import { GlobalMethod } from "../../../common/service/GlobalMethod";
import { GlobalService } from "../../../common/service/GlobalService";
import { Utils } from "../../../common/utils/utils";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-capacity-list",
  templateUrl: "./capacity-list.component.html",
  styleUrls: ["./capacity-list.component.css"]
})
export class CapacityListComponent implements OnInit {
  public serValObj: any = {
    // 定义查询请求对象
    page: pageObj.currentPage,
    size: pageObj.everyItem,
    totalItem: pageObj.totalItem,
    name: "", // 姓名
    btime: "",
    etime: "",
    date: []
  };
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
  public dataList: Array<object> = []; // 后台返回的数据列表

  public isShowOldDialog: boolean = false; //是否显示选择老人对话框
  public searchOldName: string = ""; // 老人姓名查询

  public isModifyMode = false; //是否是编辑模式
  public oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    graranteesno: "",
    hasbed: "",
    nursinglevel: "",
    building: "",
    floor: "",
    room: ""
  };
  public isOldTableLoading = false; //老人列表table加载状态
  public oldDataArray = [];
  public oldResultData = {
    totalElements: 0
  };
  public oldInfo = {
    id: "",
    name: "",
    oldmanUrl: "",
    sex: "",
    birthYearMonth: "",
    cardno: "",
    inDate: "",
    medicalPayment: "",
    medicalPaymentMemo: "",
    personnelSortMemo: "",
    personnelSort: "",
    phone: ""
  };

  constructor(
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private router: Router, // 跳转路由
    private actRoute: ActivatedRoute, // 获取传递的参数
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.serValObj = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.serValObj.btime) &&
        !Utils.isEmpty(this.serValObj.etime)
      ) {
        this.serValObj.date.push(new Date(this.serValObj.btime));
        this.serValObj.date.push(new Date(this.serValObj.etime));
      }
    }
    this.serFun(); // 查询列表数据
    // console.log(_.isEmpty({}));
    // console.log(new Date());
    // console.log(this.jsUtil.dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss"));
  }

  /**
   * 查询列表数据
   */
  isTableLoading = false;
  public serFun(reset: boolean = false) {
    if (reset) {
      this.serValObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.serValObj.page = this.serValObj.page - 1;
      if (this.serValObj.page < 0) {
        this.serValObj.page = 0;
      }
    }

    this.isTableLoading = true;

    this.httpReq.post("assessmentAppay/list", null, this.serValObj, data => {
      sessionStorage.setItem(this.router.url, JSON.stringify(this.serValObj));
      this.isTableLoading = false;
      this.serValObj.page++;
      if (data["status"] == 200) {
        this.dataList = data["data"]["content"]; // 数据列表
        this.serValObj.totalItem = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  /**
   * 日期插件时间发生变化的回调
   * @param dateArr
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
   * 删除数据
   * @param {any} id 要删除的数据对象ID
   * @memberof ConsultListComponent
   */
  public delFun(id: any) {
    const reqObj: any = {};
    reqObj.id = id;

    this.httpReq.post("assessmentAppay/del", null, reqObj, data => {
      if (data["status"] == 200) {
        this.message.success("删除成功");
        this.serFun(); // 调用查询列表方法更新列表
      }
    });
  }

  /**
   * 单击删除按钮
   * @param {any} id 要删除的数据对象ID
   */
  public clickDelBtn(id: any): void {
    this.globalService.delModal(() => {
      this.delFun(id);
    });
  }

  /**
   * 改变路由跳转页面
   * @param {string} url 相对路由或绝对路径 ex:'info'或'../info'或'/nursingHome/medical'
   * @param {*} paramObj 要传递的参数信息
   */
  public jumpPage(url: string, param?: any, e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    if (param) {
      GlobalMethod.changeRoute(url, this.router, this.actRoute, param);
    } else {
      GlobalMethod.changeRoute(url, this.router, this.actRoute);
    }
  }

  public checkPage(url: string, param?: any, e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    if (param) {
      GlobalMethod.changeRoute(url, this.router, this.actRoute, param);
    } else {
      GlobalMethod.changeRoute(url, this.router, this.actRoute);
    }
  }

  //=====================================================//

  /**
   * 取消显示选择老人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }

  /**
   * 显示老人选择对话框，并加载老人列表
   */
  showOldDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    if (this.isModifyMode) {
      return;
    }
    this.isShowOldDialog = true;
    this.loadingOldList();
  }

  /**
   * 加载老人列表
   */
  loadingOldList(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.oldQueryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldQueryParams.page = this.oldQueryParams.page - 1;
      if (this.oldQueryParams.page < 0) {
        this.oldQueryParams.page = 0;
      }
    }
    that.oldQueryParams.name = that.searchOldName;
    that.isOldTableLoading = true;
    let param = this.httpReq.post(
      "oldman/list1",
      null,
      this.oldQueryParams,
      data => {
        that.oldQueryParams.page++;
        that.isOldTableLoading = false;
        if (data["status"] == 200) {
          this.oldDataArray = data["data"]["content"]; // 数据列表
          this.oldResultData.totalElements = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }

  /**
   * 老人选择对话框中选择了某个老人；
   */
  chooseOld(oldInfo) {
    this.oldInfo = oldInfo;
    this.isShowOldDialog = false;
    // this.saveContractParams.oldman_id = this.oldInfo.id;

    setTimeout(() => {
      this.jumpPage("add", { id: "", oldId: oldInfo.id, state: "add" });
    }, 500);
    // if (Utils.isEmpty(this.saveContractParams.name)) {
    //   this.showContractDialog();
    // }
  }

  public addCapacityAssess(info, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    // 添加能力评估
    // this.jumpPage("add", { id: "", state: "add" });
    this.showOldDialog();
  }
}
