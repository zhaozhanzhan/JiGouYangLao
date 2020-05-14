import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import { InfollowService } from "../infollow.service";
@Component({
  selector: "app-infollow",
  templateUrl: "./infollow.component.html",
  styleUrls: ["./infollow.component.css"]
})
export class InfollowComponent implements OnInit {
  // 请求参数
  sendData = {
    userName: "", //登录者姓名
    name: "", //老人姓名或住院号
    buildId: "", //建筑
    floorId: "", //楼层
    roomId: "", //房间
    status: "", // 跟进状态
    startTime: "", // 开始时间
    endTime: "", //结束时间
    page: 0, //页数
    size: 50 //每页数量
  };

  selDate = [
    new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
    new Date()
  ]; // 选择时间 默认最近7日

  buildArr = []; // 建筑列表
  floorArr = []; // 楼层列表
  roomArr = []; // 房间列表

  Loading = false; // 列表Loading
  listOfData = []; // 委托老人列表
  totalElements; // 总条数

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private entrustService: InfollowService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url)) {
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      this.sendData.page = 0;
      if (this.sendData.startTime && this.sendData.endTime)
        this.selDate = [
          new Date(this.sendData.startTime),
          new Date(this.sendData.endTime)
        ];
      else this.dateChange(this.selDate);
    } else this.dateChange(this.selDate);
    // 获取建筑、楼层、房间 备选
    this.entrustService.getBuild(data => {
      return new Promise((resolv, reject) => {
        if (data.code == 0) {
          this.buildArr = data["data"];
          this.buildArr.unshift({ buildingName: "全部", id: "" });
          if (!this.sendData.buildId)
            this.sendData.buildId = data["data"][0].id;
          resolv(this.sendData.buildId);
        }
      }).then(buildId => {
        if (!buildId) {
          this.floorArr = [{ floorName: "全部", id: "" }];
          this.roomArr = [{ roomName: "全部", id: "" }];
          this.sendData.floorId = "";
          this.sendData.roomId = "";
          this.getList();
        } else {
          this.reFreshBuild(buildId, false);
        }
      });
    });
  }

  /** 修改建筑更新
   * @param {*} buildId
   * @param {Boolean} [changeFloor=true] 是否将楼层置新
   * @memberof EntrustMedicineComponent
   */
  reFreshBuild(buildId, changeFloor: Boolean = true) {
    if (buildId) {
      this.entrustService.getFloor(buildId, data2 => {
        return new Promise((resolv, reject) => {
          if (data2.code == 0) {
            this.floorArr = data2["data"];
            this.floorArr.unshift({ floorName: "全部", id: "" });
            if (changeFloor || !this.sendData.floorId)
              this.sendData.floorId = data2["data"][0].id;
            resolv(this.sendData.floorId);
          }
        }).then(floorId => {
          this.reFreshFloor(floorId, changeFloor);
        });
      });
    } else {
      this.floorArr = [{ floorName: "全部", id: "" }];
      this.roomArr = [{ roomName: "全部", id: "" }];
      this.sendData.floorId = "";
      this.sendData.roomId = "";
      this.getList(true);
    }
  }
  /** 修改建筑更新
   * @param {*} floorId
   * @param {Boolean} [changeRoom=true] 是否将房间置新
   * @memberof EntrustMedicineComponent
   */
  reFreshFloor(floorId, changeRoom: Boolean = true) {
    if (floorId) {
      this.entrustService.getRoom(floorId, data3 => {
        if (data3.code == 0) {
          this.roomArr = data3["data"];
          this.roomArr.unshift({ roomName: "全部", id: "" });
          if (changeRoom || !this.sendData.roomId)
            this.sendData.roomId = data3["data"][0].id;
          this.getList(true);
        }
      });
    } else {
      this.roomArr = [{ roomName: "全部", id: "" }];
      this.sendData.roomId = "";
      this.getList(true);
    }
  }

  // 获取委托列表
  getList(renewPage: boolean = false) {
    if (renewPage) this.sendData.page = 0;
    this.Loading = true;
    this.httpReq.post("rtDwell/getDwellList", null, this.sendData, data => {
      sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
      this.Loading = false;
      if (data.code == 0) {
        this.listOfData = data.data.content;
        this.totalElements = data.data.totalElements;
      }
    });
  }

  // 页码变更
  PageIndexChange(PageIndexNum) {
    this.sendData.page = PageIndexNum - 1;
    this.getList();
  }

  // 每页条数变更
  PageSizeChange(PageSize) {
    this.sendData.size = PageSize;
    this.getList();
  }

  // 选择日期格式化
  dateChange(data) {
    if (!data.length) {
      this.sendData.startTime = "";
      this.sendData.endTime = "";
      return;
    }
    this.sendData.startTime =
      data[0].getFullYear() +
      "-" +
      (data[0].getMonth() + 1 < 10
        ? "0" + (data[0].getMonth() + 1)
        : data[0].getMonth() + 1) +
      "-" +
      (data[0].getDate() < 10 ? "0" + data[0].getDate() : data[0].getDate());
    this.sendData.endTime =
      data[1].getFullYear() +
      "-" +
      (data[1].getMonth() + 1 < 10
        ? "0" + (data[1].getMonth() + 1)
        : data[1].getMonth() + 1) +
      "-" +
      (data[1].getDate() < 10 ? "0" + data[1].getDate() : data[1].getDate());
    console.log(this.sendData.startTime, this.sendData.endTime);
  }

  // 委托详情跳转
  Detail(id, name, status) {
    if (id) {
      let sendData = {
        id: id,
        type: status,
        userName: JSON.parse(localStorage.getItem("UserInfo")).data.name
      };
      if (status == "未开始") {
        // 未开始
        this.modalService.confirm({
          nzTitle: `请确认是否开始对${name}老人进行入住跟进？`,
          nzOnOk: () => {
            this.Loading = true;
            this.httpReq.post("rtDwell/dwellStart", null, sendData, data => {
              if (data.code == 0) {
                this.Loading = false;
                this.router.navigate(["detail", { id: id }], {
                  relativeTo: this.route.parent
                });
              }
            });
          }
        });
      } else if (status == "未完成") {
        // 未完成
        this.modalService.confirm({
          nzTitle: `此步操作会覆盖上次的跟进信息，请确认是否重新开始对${name}老人进行入住跟进？`,
          nzOnOk: () => {
            this.Loading = true;
            this.httpReq.post("rtDwell/dwellStart", null, sendData, data => {
              if (data.code == 0) {
                this.Loading = false;
                this.router.navigate(["detail", { id: id }], {
                  relativeTo: this.route.parent
                });
              }
            });
          }
        });
      } else {
        // 查看
        this.router.navigate(["detail", { id: id }], {
          relativeTo: this.route.parent
        });
      }
    } else {
      console.log("id为空！");
    }
  }
}
