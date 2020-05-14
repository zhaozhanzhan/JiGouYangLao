import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";
import { ServeConfigService } from "../../../common/config/serve-config.service";
import { EntrustMedicineService } from "../entrust-medicine.service";

@Component({
  selector: "app-entrust-medicine",
  templateUrl: "./entrust-medicine.component.html",
  styleUrls: ["./entrust-medicine.component.css"]
})
export class EntrustMedicineComponent implements OnInit {
  // 请求参数
  sendData = {
    userName: "", //登录者姓名
    name: "", //老人姓名或住院号
    build: "", //建筑
    floor: "", //楼层
    room: "", //房间
    page: 0, //页数
    size: 50 //每页数量
  };

  totalOlderElements; // 查询老人数量
  OutPage = 0; // 弹框页数
  OutSize = 10; // 弹框每页数量

  buildArr = []; // 建筑列表
  floorArr = []; // 楼层列表
  roomArr = []; // 房间列表

  Loading = false; // 列表Loading
  listOfData = []; // 委托老人列表
  totalElements; // 总条数
  timer;
  // 新增委托弹框
  showTrustModel = false;
  listOfEntrustOlder = [];
  entrustOlderLoading = false;

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private http: HttpClient,
    private serveConfigService: ServeConfigService,
    private entrustService: EntrustMedicineService,
    private modalService: NzModalService
  ) {}
  ngOnInit() {
    if (sessionStorage.getItem(this.router.url)) {
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      this.sendData.page = 0;
    }
    // 获取建筑、楼层、房间 备选
    this.entrustService.getBuild(data => {
      return new Promise((resolv, reject) => {
        if (data.code == 0) {
          this.buildArr = data["data"];
          this.buildArr.unshift({ buildingName: "全部", id: "" });
          if (!this.sendData.build) this.sendData.build = data["data"][0].id;
          resolv(this.sendData.build);
        }
      }).then(buildId => {
        if (!buildId) {
          this.floorArr = [{ floorName: "全部", id: "" }];
          this.roomArr = [{ roomName: "全部", id: "" }];
          this.sendData.floor = "";
          this.sendData.room = "";
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
            if (changeFloor || !this.sendData.floor)
              this.sendData.floor = data2["data"][0].id;
            resolv(this.sendData.floor);
          }
        }).then(floorId => {
          this.reFreshFloor(floorId, changeFloor);
        });
      });
    } else {
      this.floorArr = [{ floorName: "全部", id: "" }];
      this.roomArr = [{ roomName: "全部", id: "" }];
      this.sendData.floor = "";
      this.sendData.room = "";
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
          if (changeRoom || !this.sendData.room)
            this.sendData.room = data3["data"][0].id;
          this.getList(true);
        }
      });
    } else {
      this.roomArr = [{ roomName: "全部", id: "" }];
      this.sendData.room = "";
      this.getList(true);
    }
  }

  // 获取委托列表
  getList(renewPage: boolean = false) {
    if (renewPage) this.sendData.page = 0;
    this.Loading = true;
    this.httpReq.post("dtOldman/getDtOldmanList", null, this.sendData, data => {
      sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
      this.Loading = false;
      if (data.code == 0) {
        this.listOfData = data.data.list;
        this.totalElements = data.data.totalElements;
        this.listOfData.forEach(item => {
          // 如果该老人没有服药单给他加个空的 用于显示列表
          if (
            !Object.hasOwnProperty.call(item, "medList") ||
            item["medList"]["length"] == 0
          ) {
            item["medList"] = [];
            item["medList"].push({
              medName: "",
              standard: "",
              usefor: "",
              residues: "",
              endDate: "",
              dosage: "",
              frequency: ""
            });
          }
        });
      }
    });
  }

  // 获取可委托老人列表
  getOlderList(name: string = "", renewPage: boolean = false) {
    if (renewPage) this.OutPage = 0;
    this.entrustOlderLoading = true;
    this.httpReq.post(
      "dtOldman/oldmanList",
      null,
      { name: name, page: this.OutPage, size: this.OutSize },
      data => {
        this.entrustOlderLoading = false;
        if (data.code == 0) {
          this.listOfEntrustOlder = data.data.list;
          this.totalOlderElements = data.data.totalElements;
        }
      }
    );
  }

  // 新增委托弹框
  addEntrust() {
    document.getElementsByClassName("ant-input-group-addon")[0][
      "style"
    ].padding = "0px";
    this.showTrustModel = true;
    this.getOlderList("", true);
  }

  // 弹框页码变更
  OutPageIndexChange(PageIndexNum) {
    this.OutPage = PageIndexNum - 1;
    this.getOlderList();
  }

  // 弹框每页条数变更
  OutPageSizeChange(PageSize) {
    this.OutSize = PageSize;
    this.getOlderList();
  }

  // 搜索老人输入回调
  onSearchNameChange(name) {
    // if(!name) return;
    let that = this;
    clearTimeout(that.timer);
    return (function() {
      that.timer = setTimeout(function() {
        that.getOlderList.call(that, name, true);
      }, 500);
    })();
  }

  // 弹框取消
  trustModelCancel() {
    this.showTrustModel = false;
    this.listOfEntrustOlder = [];
  }
  // 弹框确认
  trustModelOk() {
    this.showTrustModel = false;
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

  // 新增委托点击
  addNewEntrust(name, id) {
    this.modalService.confirm({
      nzTitle: `请确认对${name}老人进行委托用药之前已签订委托用药协议？`,
      nzOnOk: () => {
        this.entrustOlderLoading = true;
        this.httpReq.post(
          "dtOldman/add",
          null,
          {
            userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
            oldId: id
          },
          data => {
            this.entrustOlderLoading = false;
            if (data.code == 0) {
              this.entrustOlderLoading = false;
              this.showTrustModel = false;
              this.message.success("添加成功");
              this.getList();
            }
          }
        );
      }
    });
  }

  // 委托详情跳转
  entrustDetail(data) {
    if (data.id) {
      this.router.navigate(["DetailTrust", { data: JSON.stringify(data) }], {
        relativeTo: this.route.parent
      });
    } else {
      console.log("id为空！");
    }
  }
}
