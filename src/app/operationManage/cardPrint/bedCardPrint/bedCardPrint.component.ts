import { Component, OnInit, Directive, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ENgxPrintComponent } from "e-ngx-print";

import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
@Component({
  selector: "app-bedCardPrint",
  templateUrl: "./bedCardPrint.component.html",
  styleUrls: ["./bedCardPrint.component.css"]
})
export class BedCardPrintComponent implements OnInit {
  size = {
    width: "48mm",
    height: "43mm",
    marginBottom: "2mm",
    marginRight: "10mm",
    bedTop: "4mm",
    nameTop: "6mm",
    levelTop: "7mm",
    fontWength: "100",
    fontSize: "14pt"
  };

  oldmanList;
  oldmanServeData;

  searchName = "";
  building = "";
  floor = "";
  room = "";
  buildingList;
  floorList;
  roomList;

  pageList = [20];

  isPrintNow = false;
  printCSS = [];
  @ViewChild("print") printComponent: ENgxPrintComponent;

  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.oldmanServeData = {
      total: 0
    };
    this.updateOldmanList(true);
    let param = { building: "", floor: "", room: "" };
    this.httpReq.post("building/searchBuilding", null, param, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          this.buildingList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    });

    // 获取样式信息
    this.httpReq.post("/cardInfoPrint/getCardPrintInfo", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          let result = JSON.parse(data["data"]);
          this.size = JSON.parse(result.oldManCardInfo);
        } else {
          this.message.error(data["message"]);
        }
      }
    });
  }
  // 保存样式
  savePaint() {
    let param = {
      oldManCardInfo: ""
    };

    param.oldManCardInfo = JSON.stringify(this.size);
    this.httpReq.post(
      "/cardInfoPrint/saveOldManCardInfo",
      null,
      param,
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.message.success("保存成功");
          } else {
            this.message.error(data["message"]);
          }
        }
      }
    );
  }

  reqObj = {
    page: 0,
    size: 21,
    name: "",
    graranteesno: "",
    hasbed: "",
    nursinglevel: "",
    building: "",
    floor: "",
    room: ""
  };

  total;
  totalPages;
  updateOldmanList(reset: boolean = false) {
    this.reqObj.name = this.searchName;
    this.reqObj.building = this.building;
    this.reqObj.floor = this.floor;
    this.reqObj.room = this.room;

    if (reset) {
      this.reqObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.reqObj.page = this.reqObj.page - 1;
      if (this.reqObj.page < 0) {
        this.reqObj.page = 0;
      }
    }

    this.httpReq.post("/oldman/list1", null, this.reqObj, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          this.reqObj.page++;
          this.oldmanServeData = data["data"];
          this.total = data["data"]["totalElements"];
          this.totalPages = data["data"]["totalPages"];
          this.oldmanList = data["data"]["content"];
        } else {
          this.message.error(data["message"]);
        }
      }
    });
  }
  showStyle = false;
  update(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.showStyle = !this.showStyle;
  }
  onPageChanged($event) {
    let that = this;
    let pageControll = $event;
    that.updateOldmanList(true);
  }

  onBuildingChange() {
    this.roomList = new Array();

    this.floor = "";
    this.room = "";

    if (this.building === "") {
      this.floorList = new Array();
    } else {
      const that = this;
      let param = { building: that.building, floor: "", room: "" };
      this.httpReq.post("building/searchBuilding", null, param, data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            that.floorList = data["data"];
          } else {
            that.message.error(data["message"]);
          }
        }
      });
    }

    this.updateOldmanList(true);
  }

  onFloorChange() {
    this.room = "";

    if (this.floor === "") {
      this.roomList = new Array();
    } else {
      const that = this;
      let param = { building: that.building, floor: that.floor, room: "" };
      this.httpReq.post("building/searchBuilding", null, param, data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            that.roomList = data["data"];
          } else {
            that.message.error(data["message"]);
          }
        }
      });
    }

    this.updateOldmanList(true);
  }

  onRoomChange() {
    this.updateOldmanList(true);
  }

  searchList(value) {
    this.searchName = value;
    this.updateOldmanList(true);
  }

  onPrint(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isPrintNow = true;
    this.printComponent.print();
  }
  printComplete() {
    this.isPrintNow = false;
  }
}
