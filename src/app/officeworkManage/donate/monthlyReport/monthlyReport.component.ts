import { InterceptorService } from "ng2-interceptors";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ENgxPrintComponent } from "e-ngx-print";
import { NzTreeNode } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
@Component({
  selector: "app-monthlyReport",
  templateUrl: "./monthlyReport.component.html",
  styleUrls: ["./monthlyReport.component.css"]
})
export class MonthlyReportComponent implements OnInit {
  yearM = "";
  monthM = "";
  list = [];
  page = {
    total: 0,
    size: 2000,
    index: 1
  };
  data = "";
  tagName = "";
  goodsClassificationNodes = [];
  reqObj = {
    page: 1,
    size: 2000,
    yearAndMonth: "",
    departmentId: "",
    goodName: ""
  };

  selectedDates = [];
  storehouseList = [];
  isTableLoading = false;
  isPrintNow = false;
  disabled = false;
  // goodCategory = "";
  departmentName = "";
  depId = "";
  donatedCompany = [];
  useFor = [];
  donatedGoodsComment = [];
  donatedDate = [];
  printCSS = ["assets/css/common.css", "assets/css/first-care-print.css"];
  public printStyle: string = `
  .textCenter{
    font-size:14px;
    padding-left: 2px;
    text-align: center
  }
  `;
  @ViewChild("print") printComponent: ENgxPrintComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url + "1") !== null) {
      if (
        JSON.parse(sessionStorage.getItem(this.router.url + "1"))
          .yearAndMonth == ""
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
        // this.monthM = this.data.split("-")[1];
        if (parseInt(this.data.split("-")[1]) < 10) {
          this.monthM = "0" + parseInt(this.data.split("-")[1]);
        } else {
          this.monthM = "" + parseInt(this.data.split("-")[1]);
        }
      } else {
        this.data = JSON.parse(
          sessionStorage.getItem(this.router.url + "1")
        ).yearAndMonth;
        this.reqObj.yearAndMonth = this.data;
        this.yearM = this.data.split("-")[0];
        // this.monthM = this.data.split("-")[1];
        if (parseInt(this.data.split("-")[1]) < 10) {
          this.monthM = "0" + parseInt(this.data.split("-")[1]);
        } else {
          this.monthM = "" + parseInt(this.data.split("-")[1]);
        }
      }
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url + "1"));
      this.depId = JSON.parse(
        sessionStorage.getItem(this.router.url + "1")
      ).departmentId;
      this.reqObj.departmentId = this.depId;
      this.changeDepartment();
    } else {
      let d = new Date();
      let Fullyear = d.getFullYear();
      let m = d.getMonth() + 1;
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
      // this.monthM = this.data.split("-")[1];
      if (parseInt(this.data.split("-")[1]) < 10) {
        this.monthM = "0" + parseInt(this.data.split("-")[1]);
      } else {
        this.monthM = "" + parseInt(this.data.split("-")[1]);
      }
    }
    this.httpReq.post("/department/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.storehouseList = data["data"];
        if (this.depId == "" || this.depId == null) {
          this.depId = this.storehouseList[0].id;
        }
        this.reqObj.departmentId = this.depId;
        this.storehouseList.forEach(e => {
          if (e.id == this.reqObj.departmentId) {
            this.departmentName = e.name;
          }
        });
        this.updateList();
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
  onChange($event: string): void {
    console.log($event);
  }
  changeDepartment() {
    this.storehouseList.forEach(e => {
      if (e.id == this.reqObj.departmentId) {
        this.departmentName = e.name;
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

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    console.log(this.data);
    if (this.data == "" || this.data == null || this.data == "-undefined") {
      this.reqObj.yearAndMonth = "";
    } else {
      let arr = this.data.split("-");
      let arrSt = "";
      let st1 = arr[1].replace(/\b(0+)/gi, "");
      console.log(arr[1].replace(/\b(0+)/gi, ""));
      if (parseInt(st1) < 10) {
        arrSt = "0" + st1;
      } else {
        arrSt = "" + st1;
      }
      this.reqObj.yearAndMonth = arr[0] + "-" + arrSt;
    }
    sessionStorage.setItem(this.router.url + "1", JSON.stringify(this.reqObj));
    this.isTableLoading = true;

    console.log(this.reqObj.yearAndMonth);
    this.httpReq.post(
      "/DonatedStatement/listDmInventory",
      null,
      this.reqObj,
      data => {
        this.isTableLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.list = data["data"]["content"];
            this.list.forEach(e => {
              // this.donatedCompany = e.donatedCompany.split(",");
              // this.useFor = e.useFor.split(",");
              // this.donatedGoodsComment = e.donatedGoodsComment.split(",");
              // this.donatedDate = e.donatedDate.split(",");
            });
            this.page.total = data["data"]["totalElements"];
          }
        }
      }
    );
  }
}
