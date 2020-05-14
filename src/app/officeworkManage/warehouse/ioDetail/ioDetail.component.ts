import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzTreeNode, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { Utils } from "../../../common/utils/utils";
import { ENgxPrintComponent } from "e-ngx-print";

@Component({
  selector: "app-ioDetail",
  templateUrl: "./ioDetail.component.html",
  styleUrls: ["./ioDetail.component.css"]
})
export class IODetailComponent implements OnInit {
  goodsClassificationNodes;
  goodsList = [];
  list = [];
  isPrintNow = false;
  disabled = false;

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  queryParams = {
    page: 0,
    size: 10,
    btime: "",
    etime: "",
    goodCategory: "",
    goodName: "",
    warehouseId: "",
    inOutWay: "",
    accountId: ""
  };

  exportObj = {
    btime: "",
    etime: "",
    goodCategory: "",
    goodName: "",
    warehouseId: "",
    inOutWay: "",
    accountId: ""
  };
  selectedDates = [];
  storehouseList = [];
  isTableLoading = false;
  reqObjGoodName = "请选择物品类别";
  userInfo;
  outboundDetailsList = [];
  userName;

  userIs = false;
  @ViewChild("print") printComponent: ENgxPrintComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStroage: LocalStorage,
    private msg: NzMessageService // 消息提醒
  ) {}

  ngOnInit() {
    let goodCategory;
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    this.userName = JSON.parse(localStorage.getItem("systemInfo"));
    if (this.userName.sysTitle == "吴中区社会福利中心") {
      this.userIs = true;
    } else {
      this.userIs = false;
    }
    if (sessionStorage.getItem(this.router.url + "1") !== null) {
      this.queryParams = JSON.parse(
        sessionStorage.getItem(this.router.url + "1")
      );
      goodCategory = JSON.parse(sessionStorage.getItem(this.router.url + "1"))
        .goodCategory;
      if (
        !Utils.isEmpty(this.queryParams.btime) &&
        !Utils.isEmpty(this.queryParams.etime)
      ) {
        this.selectedDates.push(new Date(this.queryParams.btime));
        this.selectedDates.push(new Date(this.queryParams.etime));
      }
    }

    this.httpReq.post(
      "/warehouse/listAllByAccount",
      null,
      { accountId: this.userInfo.id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.storehouseList = data["data"];
        }
      }
    );
    this.httpReq.post("goods/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });
    this.goodsClassificationNodes = [];
    this.httpReq.post("goodsCategory/listAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        this.queryParams.goodCategory = goodCategory;
        result.forEach(element => {
          this.goodsClassificationNodes.push(new NzTreeNode(element));
        });
        if (goodCategory == "" || goodCategory == null) {
          this.reqObjGoodName = "请选择物品类别";
        } else {
          this.getReqObjGoodName(this.goodsClassificationNodes, goodCategory);
        }
      }
    });
    this.updateList();
    this.getAllDataDictionary();
  }
  // 递归循环树形结构获得所属部门
  getReqObjGoodName(arr, departmentID: string) {
    if (arr.length > 0) {
      arr.forEach(e => {
        if (e.key == departmentID) {
          this.reqObjGoodName = e.title;
          return;
        } else {
          this.getReqObjGoodName(e.children, departmentID);
        }
      });
    }
  }

  turnToCheck(inStorehouse) {
    this.router.navigate(
      ["check", { inRecordId: inStorehouse.id, state: "check" }],
      { relativeTo: this.route }
    );
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.queryParams.page = this.page.index - 1;
    this.queryParams.size = this.page.size;
    this.queryParams.accountId = this.userInfo.id;
    sessionStorage.setItem(
      this.router.url + "1",
      JSON.stringify(this.queryParams)
    );
    if (
      this.queryParams.goodCategory == "" ||
      this.queryParams.goodCategory == null
    ) {
      this.reqObjGoodName = "请选择物品类别";
    }
    let that = this;
    this.isTableLoading = true;
    this.httpReq.post(
      "statement/listInOutDetail",
      null,
      this.queryParams,
      data => {
        that.isTableLoading = false;
        if (data["code"] == 0) {
          let resultData = JSON.parse(data["data"]);
          that.list = resultData["goodsInfo"];
          that.page.total = resultData["totalElements"];
        }
      }
    );
  }

  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.queryParams.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.queryParams.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.queryParams.btime = "";
      this.queryParams.etime = "";
    }
  }

  printComplete() {
    this.updateList();
    this.isPrintNow = false;
    this.disabled = false;
  }
  // 打印功能
  onPrint(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.printableAll();
    this.printComponent.print();
    this.disabled = true;
    this.isPrintNow = true;
    // this.updateList();
  }

  // 打印全部
  totalNum; //物品总数
  totalMoney; //物品总价
  printableAll() {
    this.exportObj.btime = this.queryParams.btime;
    this.exportObj.etime = this.queryParams.etime;
    this.exportObj.goodCategory = this.queryParams.goodCategory;
    this.exportObj.goodName = this.queryParams.goodName;
    this.exportObj.warehouseId = this.queryParams.warehouseId;
    this.exportObj.inOutWay = this.queryParams.inOutWay;
    this.exportObj.accountId = this.queryParams.accountId;
    this.httpReq.post(
      "statement/listInOutDetailPrint",
      null,
      this.exportObj,
      data => {
        if (data.code === 0) {
          let resultData = JSON.parse(data["data"]);
          this.list = resultData["info"];
          this.totalNum = resultData["totalNum"];
          this.totalMoney = resultData["totalMoney"];
        }
      }
    );
  }

  // 导出表格
  /**
   * 导出数据
   */
  derivedTable() {
    this.exportObj.btime = this.queryParams.btime;
    this.exportObj.etime = this.queryParams.etime;
    this.exportObj.goodCategory = this.queryParams.goodCategory;
    this.exportObj.goodName = this.queryParams.goodName;
    this.exportObj.warehouseId = this.queryParams.warehouseId;
    this.exportObj.inOutWay = this.queryParams.inOutWay;
    this.exportObj.accountId = this.queryParams.accountId;
    this.httpReq.post("statement/exportExcel", null, this.exportObj, data => {
      console.log("tag", data);
      if (data.code === 0) {
        const link = document.createElement("a");
        link.setAttribute("href", data.data);
        link.setAttribute("download", data.data);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "dictMgt/listDataByTypes",
      null,
      { dictTypes: "OutboundDetails" },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const info = data["data"];
            info.forEach(e => {
              //出库明细打印时显示
              if (e.dictType == "OutboundDetails") {
                this.outboundDetailsList = e.ddList;
              }
            });
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }
}
