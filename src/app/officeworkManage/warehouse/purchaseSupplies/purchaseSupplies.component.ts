import { ChildrenLayoutComponent } from "./../../../children-layouts/children-layout.component";
import { InterceptorService } from "ng2-interceptors";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ENgxPrintComponent } from "e-ngx-print";
import { NzTreeNode } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
@Component({
  selector: "app-purchaseSupplies",
  templateUrl: "./purchaseSupplies.component.html",
  styleUrls: ["./purchaseSupplies.component.css"]
})
export class PurchaseSuppliesComponent implements OnInit {
  lastMonBalNum = 0;
  lastMonBalAmount = 0;
  thisMonPurNum = 0;
  thisMonPurAmount = 0;
  thisMonSendNum = 0;
  thisMonSendAmount = 0;
  thisMonBalNum = 0;
  thisMonBalAmount = 0;
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
    goodCategory: "",
    goodName: ""
  };
  exportObj = {
    yearAndMonth: "",
    goodCategory: "",
    goodName: ""
  };
  selectedDates = [];
  storehouseList = [];
  isTableLoading = false;
  isPrintNow = false;
  disabled = false;
  goodCategory = "";

  reqObjGoodName = "请选择物品类别";

  printCSS = [];
  @ViewChild("print")
  printComponent: ENgxPrintComponent;

  isLoadingOne = false;

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
          if (month < 10) this.data = Fullyear + "-0" + month;
          else this.data = Fullyear + "-" + month;
        }

        console.log("data" + this.data);
        this.reqObj.yearAndMonth = this.data;
        this.yearM = this.data.split("-")[0];
        this.monthM = this.data.split("-")[1];
      } else {
        this.data = JSON.parse(
          sessionStorage.getItem(this.router.url + "1")
        ).yearAndMonth;
        this.reqObj.yearAndMonth = this.data;
        this.yearM = this.data.split("-")[0];
        this.monthM = this.data.split("-")[1];
      }

      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url + "1"));
      this.goodCategory = JSON.parse(
        sessionStorage.getItem(this.router.url + "1")
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
        if (month < 10) this.data = Fullyear + "-0" + month;
        else this.data = Fullyear + "-" + month;
      }

      console.log("data" + this.data);
      this.reqObj.yearAndMonth = this.data;
      this.yearM = this.data.split("-")[0];
      this.monthM = this.data.split("-")[1];
    }

    this.httpReq.post("/goodsCategory/listAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        this.reqObj.goodCategory = this.goodCategory;
        result.forEach(ele => {
          this.goodsClassificationNodes.push(new NzTreeNode(ele));
        });

        if (this.goodCategory == "" || this.goodCategory == null) {
          this.reqObjGoodName = "请选择物品类别";
        } else {
          this.getReqObjGoodName(
            this.goodsClassificationNodes,
            this.goodCategory
          );
        }
      }
    });
    this.httpReq.post("warehouse/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.storehouseList = data["data"];
      }
    });

    this.updateList();
    this.getLocalConfig();
  }
  onChangeDate(data) {
    this.data = this.jsUtil.dateFormat(this.data);
    let Data = this.jsUtil.dateFormat(data);
    this.reqObj.yearAndMonth = this.data;
    this.yearM = Data.split("-")[0];
    this.monthM = Data.split("-")[1];
  }
  // 递归循环树形结构获得所属部门
  getReqObjGoodName(arr, departmentID: string) {
    //arr:传过来要对比得数组，departmentID是要对比得部门ID
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
    this.printableAll();
    this.printComponent.print();
    this.disabled = true;
    this.isPrintNow = true;
    // this.updateList();
  }

  printComplete() {
    this.updateList();
    this.isPrintNow = false;
    this.disabled = false;
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    if (this.reqObj.goodCategory == "" || this.reqObj.goodCategory == null) {
      this.reqObjGoodName = "请选择物品类别";
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    if (this.data == "" || this.data == null || this.data == "-undefined") {
      this.reqObj.yearAndMonth = "";
    } else {
      let arr = this.data.split("-");
      this.reqObj.yearAndMonth = arr[0] + "-" + arr[1];
    }
    sessionStorage.setItem(this.router.url + "1", JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.post("/statement/listInventory", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.lastMonBalNum = 0;
          this.lastMonBalAmount = 0;
          this.thisMonPurNum = 0;
          this.thisMonPurAmount = 0;
          this.thisMonSendNum = 0;
          this.thisMonSendAmount = 0;
          this.thisMonBalNum = 0;
          this.thisMonBalAmount = 0;
          this.list = data["data"]["content"];
          this.list.forEach(e => {
            this.lastMonBalNum += parseInt(e.lastMonBalNum);
            this.lastMonBalAmount += parseInt(e.lastMonBalAmount);
            this.thisMonPurNum += parseInt(e.thisMonPurNum);
            this.thisMonPurAmount += parseInt(e.thisMonPurAmount);
            this.thisMonSendNum += parseInt(e.thisMonSendNum);
            this.thisMonSendAmount += parseInt(e.thisMonSendAmount);
            this.thisMonBalNum += parseInt(e.thisMonBalNum);
            this.thisMonBalAmount += parseInt(e.thisMonBalAmount);
          });
          this.page.total = data["data"]["totalElements"];
        }
      }
    });
  }

  // 打印全部

  printableAll() {
    this.exportObj.goodCategory = this.reqObj.goodCategory;
    this.exportObj.goodName = this.reqObj.goodName;
    this.exportObj.yearAndMonth = this.reqObj.yearAndMonth;
    this.httpReq.post(
      "statement/listInventoryPrint",
      null,
      this.exportObj,
      data => {
        if (data.code === 0) {
          let resultData = JSON.parse(data["data"]);
          this.list = resultData["info"];
        }
      }
    );
  }


  // 导出
  exportExcel(){
    this.isLoadingOne = true;
    this.httpReq.post('statement/listInventoryExport', null, null, res=>{

      this.isLoadingOne = false;
      if(res.code == 0){
        let a = document.createElement('a');
        a.href = res.data;
        a.download = '月度盘存';
        a.click();
        a = null;
      }
    })
  }
}
