import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ENgxPrintComponent } from "e-ngx-print";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-roomCardPrint",
  templateUrl: "./roomCardPrint.component.html",

  styleUrls: ["./roomCardPrint.component.css"]
})
export class RoomCardPrintComponent implements OnInit {
  size = {
    width: "66mm",
    height: "53mm",
    marginBottom: "8.5mm",
    marginRight: "2mm",
    bedTop: "4mm",
    nameTop: "6mm",
    levelTop: "7mm",
    fontWength: "normal",
    fontSize: "20pt"
  };
  showStyle = false;
  showCard = true;
  showCards = false;

  nursingLevel = "";
  hasBed = "";
  oldmanList;
  oldmanServeData;

  searchName = "";
  building;
  floor;
  room;
  buildingList;
  floorList;
  roomList;
  floorName = "";
  selectedFloorName = "";

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

    this.searchName = "";
    this.building = "";
    this.floor = "";
    this.room = "";
    this.allBuiding();
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
          this.size = JSON.parse(result.roomCardInfo);
        } else {
          this.message.error(data["message"]);
        }
      }
    });
  }

  allBuiding() {
    this.httpReq.get("building/all", null, data => {
      if (data["status"] == 200) {
        let lou = JSON.parse(data["data"]);
        this.roomList = lou["children"];
      }
    });
  }
  // 保存样式
  saveRoomCardPrintInfo() {
    let param = {
      roomCardInfo: ""
    };

    param.roomCardInfo = JSON.stringify(this.size);
    this.httpReq.post(
      "/cardInfoPrint/saveRoomCardPrintInfo",
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
  update(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.showStyle = !this.showStyle;
  }
  updateOldmanList(page) {
    // const that = this;
    // that.httpService.doGetOldman(
    // 	this.searchName,
    // 	this.building,
    // 	this.floor,
    // 	this.room,
    // 	'',
    // 	'',
    // 	page,
    // 	20,
    // 	function(successful, data, res) {
    // 		that.oldmanServeData = data;
    // 		that.oldmanList = data.content;
    // 	},
    // 	function(successful, msg, err) {
    // 		const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
    // 		that.toastService.toast(toastCfg);
    // 	}
    // );

    let param = {
      page: page,
      size: 20,
      name: this.searchName,
      graranteesno: "",
      hasbed: "",
      nursinglevel: "",
      building: this.building,
      floor: this.floor,
      room: this.room
    };
    this.httpReq.post("/oldman/list1", null, param, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          this.oldmanServeData = data["data"];
          this.oldmanList = data["data"]["content"];
        } else {
          this.message.error(data["message"]);
        }
      }
    });
  }

  onPageChanged($event) {
    let that = this;
    let pageControll = $event;
    that.updateOldmanList(pageControll.pageNumber);
  }

  onBuildingChange() {
    this.roomList = new Array();

    this.floor = "";
    this.room = "";

    if (this.building === "") {
      this.allBuiding();
      this.showCard = true;
      this.showCards = false;
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

    this.updateOldmanList(1);
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
            that.showCard = false;
            that.showCards = true;
            that.roomList = data["data"];
            // that.roomList.forEach((e) => {
            // 	let floor = e.roomName.split('#');
            // 	that.floorName = floor[0] + '#' + floor[1].substr(0, 1) + '层';
            // });
          } else {
            that.message.error(data["message"]);
          }
        }
      });
    }

    this.updateOldmanList(1);
  }

  onRoomChange() {
    this.updateOldmanList(1);
  }

  searchList(value) {
    this.searchName = value;
    this.updateOldmanList(1);
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
