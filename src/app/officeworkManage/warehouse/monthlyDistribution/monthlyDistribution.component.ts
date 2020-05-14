import { infoDetailsComponent } from "./../../../safetyment/fireInspection/infoDetails/infoDetails.component";
import { ChildrenLayoutComponent } from "./../../../children-layouts/children-layout.component";
import { InterceptorService } from "ng2-interceptors";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ENgxPrintComponent } from "e-ngx-print";
import { NzTreeNode } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
@Component({
  selector: "app-monthlyDistribution",
  templateUrl: "./monthlyDistribution.component.html",
  styleUrls: ["./monthlyDistribution.component.css"]
})
export class MonthlyDistributionComponent implements OnInit {
  yearM = "";
  monthM = "";
  list = [];

  data = "";
  tagName = "";

  reqObj = {
    yearAndMonth: "",
    warehouseId: ""
  };

  departmentList = [];
  warehouseList = [];
  warehouseName = "";
  isTableLoading = false;
  isPrintNow = false;
  disabled = false;
  goodCategory = "";

  reqObjGoodName = "请选择物品类别";
  number;
  printCSS = [];
  @ViewChild("print") printComponent: ENgxPrintComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj.warehouseId = JSON.parse(
        sessionStorage.getItem(this.router.url)
      ).warehouseId;
      if (
        JSON.parse(sessionStorage.getItem(this.router.url)).yearAndMonth == ""
      ) {
        let d = new Date();
        let Fullyear = d.getFullYear();
        let m = d.getMonth() + 1;
        console.log("data" + Fullyear);
        if (m == 1) {
          const year = Fullyear - 1;
          this.data = year + "-" + "12";
        } else {
          let month = d.getMonth();
          this.data = Fullyear + "-" + month;
        }
        console.log("data" + this.data);
        this.reqObj.yearAndMonth = this.data;
        this.yearM = this.data.split("-")[0];
        this.monthM = this.data.split("-")[1];
      } else {
        this.data = JSON.parse(
          sessionStorage.getItem(this.router.url)
        ).yearAndMonth;
        this.reqObj.yearAndMonth = this.data;
        this.yearM = this.data.split("-")[0];
        this.monthM = this.data.split("-")[1];
      }

      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.goodCategory = JSON.parse(
        sessionStorage.getItem(this.router.url)
      ).goodCategory;
    } else {
      let d = new Date();
      let Fullyear = d.getFullYear();
      let m = d.getMonth() + 1;
      console.log("data" + Fullyear);
      if (m == 1) {
        const year = Fullyear - 1;
        this.data = year + "-" + "12";
      } else {
        let month = d.getMonth();
        this.data = Fullyear + "-" + month;
      }

      console.log("data" + this.data);
      this.reqObj.yearAndMonth = this.data;
      this.yearM = this.data.split("-")[0];
      this.monthM = this.data.split("-")[1];
    }
    this.httpReq.post("/warehouse/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.warehouseList = data["data"];
        this.reqObj.warehouseId = this.warehouseList[0].id;
        this.warehouseName = this.warehouseList[0].name;
        this.updateList();
      }
    });

    this.httpReq.post("/department/listAllNoTop", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.departmentList = data["data"];
        this.number = this.departmentList.length;
      }
    });

    this.getLocalConfig();
  }
  onChangeDate(data) {
    this.data = this.jsUtil.dateFormat(this.data);
    let Data = this.jsUtil.dateFormat(data);
    this.reqObj.yearAndMonth = this.data;
    this.yearM = Data.split("-")[0];
    this.monthM = Data.split("-")[1];
  }
  warehouseChange(e) {
    console.log(e);
    this.warehouseList.forEach(element => {
      if (element.id == e) {
        this.warehouseName = element.name;
      }
    });
  }

  // 获得打印的标头名字
  getLocalConfig() {
    let config = JSON.parse(localStorage.getItem("serveConfig"));
    this.tagName = config.originFullName;
  }
  // 打印功能
  onPrint(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.printComponent.print();
    this.disabled = true;
    this.isPrintNow = true;
    // this.updateList();
  }

  printComplete() {
    this.isPrintNow = false;
    this.disabled = false;
  }

  updateList() {
    if (
      this.reqObj.warehouseId == "" ||
      this.reqObj.warehouseId == undefined ||
      this.reqObj.warehouseId == null
    ) {
      console.log(this.warehouseList[0].id);
      this.reqObj.warehouseId = this.warehouseList[0].id;
    }
    // this.reqObj.yearAndMonth ="2019-01"
    if (this.data == "" || this.data == null || this.data == "-undefined") {
      this.reqObj.yearAndMonth = "";
    } else {
      let arr = this.data.split("-");
      let arrSt = "";
      let st1 = arr[1].replace(/\b(0+)/gi, "");
      if (parseInt(st1) < 10) {
        arrSt = "0" + st1;
      } else {
        arrSt = "" + st1;
      }
      this.reqObj.yearAndMonth = arr[0] + "-" + arrSt;
    }
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.post("/distributionRecord/save", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        this.list = result;
      }
    });
  }
}
