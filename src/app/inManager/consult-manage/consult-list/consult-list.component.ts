import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { pageObj } from "../../../common/config/config";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import * as _ from "underscore"; // underscore工具类
import { GlobalMethod } from "../../../common/service/GlobalMethod";
import { GlobalService } from "../../../common/service/GlobalService";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-consult-list",
  templateUrl: "./consult-list.component.html",
  styleUrls: ["./consult-list.component.css"]
})
export class ConsultListComponent implements OnInit {
  //table加载状态
  isTableLoading = false;
  public serValObj: any = {
    // 定义查询请求对象
    page: pageObj.currentPage,
    size: pageObj.everyItem,
    totalItem: pageObj.totalItem,
    name: "",
    btime: "",
    etime: "",
    ebtime: "",
    eetime: "",
    date: [],
    eDate: []
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

      if (
        !Utils.isEmpty(this.serValObj.ebtime) &&
        !Utils.isEmpty(this.serValObj.eetime)
      ) {
        this.serValObj.eDate.push(new Date(this.serValObj.ebtime));
        this.serValObj.eDate.push(new Date(this.serValObj.eetime));
      }
    }
    this.serFun(); // 查询列表数据
  }

  /**
   * 查询列表数据
   */
  public serFun(isRest: boolean = false) {
    if (isRest) {
      this.serValObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.serValObj.page = this.serValObj.page - 1;
      if (this.serValObj.page < 0) {
        this.serValObj.page = 0;
      }
    }
    this.isTableLoading = true;
    this.httpReq.post("consulting/list", null, this.serValObj, data => {
      this.serValObj.page++;
      this.isTableLoading = false;
      if (data["status"] == 200) {
        sessionStorage.setItem(this.router.url, JSON.stringify(this.serValObj));
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
   * 咨询日期切换监听
   * @param dateArr
   */
  public selEDate(dateArr: Array<Date>) {
    if (dateArr[0]) {
      this.serValObj.ebtime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.serValObj.ebtime = "";
    }
    if (dateArr[1]) {
      this.serValObj.eetime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.serValObj.eetime = "";
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

    let that = this;
    that.isTableLoading = true;
    this.httpReq.post("consulting/del", null, reqObj, data => {
      that.isTableLoading = false;
      if (data["status"] == 200) {
        this.message.success("删除成功！");
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
  public jumpPage(url: string, param?: any): void {
    if (param) {
      GlobalMethod.changeRoute(url, this.router, this.actRoute, param);
    } else {
      GlobalMethod.changeRoute(url, this.router, this.actRoute);
    }
  }
}
