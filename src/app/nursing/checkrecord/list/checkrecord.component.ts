import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-checkrecord",
  templateUrl: "checkrecord.component.html",
  styleUrls: ["./checkrecord.component.scss"]
})
export class CheckRecordComponent implements OnInit {
  buildingList;
  floorList;
  roomList;
  selectedDate = [];

  list;
  page = {
    total: 0
  };

  reqObj = {
    page: 0,
    size: 10,
    btime: "",
    etime: "",
    building: "",
    floor: "",
    room: ""
  };

  loading = true;

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));

      if (this.reqObj.building) {
        this.onBuildingChange(false);
      }

      if (this.reqObj.floor) {
        this.onFloorChange(false);
      }

      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.btime));
        this.selectedDate.push(new Date(this.reqObj.etime));
      }
    }
    this.updateList();

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }

    const that = this;

    that.httpReq.post("building/searchBuilding", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          that.buildingList = data["data"];
        } else {
        }
      }
    });
  }
  onBuildingChange(isSetBuilding: boolean = true) {
    this.roomList = new Array();

    if (isSetBuilding) {
      this.reqObj.floor = "";
      this.reqObj.room = "";
    }

    if (this.reqObj.building === "") {
      this.floorList = new Array();
    } else {
      // console.log('building:' + this.building);
      const that = this;
      let param = { building: this.reqObj.building, floor: "", room: "" };
      this.httpReq.post("building/searchBuilding", null, param, data => {
        sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
        if (data["status"] == 200) {
          if (data.code == "0") {
            that.floorList = data["data"];
          } else {
          }
        }
      });
    }
  }

  onFloorChange(isSetFloor: boolean = true) {
    if (isSetFloor) {
      this.reqObj.room = "";
    }
    if (this.reqObj.floor === "") {
      this.roomList = new Array();
    } else {
      const that = this;

      let param = {
        building: that.reqObj.building,
        floor: that.reqObj.floor,
        room: ""
      };
      this.httpReq.post("building/searchBuilding", null, param, data => {
        sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
        if (data["status"] == 200) {
          if (data.code == "0") {
            that.roomList = data["data"];
          } else {
          }
        }
      });
    }
  }

  onRoomChange(reset: boolean = false) {}
  turnToCheck(checkRecord, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", JSON.stringify(checkRecord)], {
      relativeTo: this.route
    });
  }

  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.reqObj.btime = "";
    }
    if (dateArr[1]) {
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.btime = "";
    }
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.reqObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.reqObj.page = this.reqObj.page - 1;
      if (this.reqObj.page < 0) {
        this.reqObj.page = 0;
      }
    }

    let that = this;
    this.loading = true;
    this.httpReq.post("checkRecord/pageList", null, this.reqObj, data => {
      sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
      that.loading = false;
      if (data["status"] == 200) {
        if (data.code == "0") {
          // sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
          // const result = JSON.parse(data['data']);
          that.list = data["data"]["content"]; // 数据列表
          that.page.total = data["data"]["totalElements"]; // 总条数
        } else {
        }
        that.loading = false;
      }
    });
  }

  searchList() {
    this.updateList();
  }
}
