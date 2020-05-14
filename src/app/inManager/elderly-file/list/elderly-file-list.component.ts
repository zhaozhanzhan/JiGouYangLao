import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzTreeNode, NzFormatEmitEvent, NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-info-interview",
  templateUrl: "./elderly-file-list.component.html",
  styleUrls: ["./elderly-file-list.component.css"]
})
export class ElderlyFileComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 12,
    index: 1
  };
  buildingList;
  floorList;
  roomList;
  nodes = [
    new NzTreeNode({
      title: "楼房管理",
      key: "1",
      disabled: true
    })
  ];
  expandKeys = ["1"];
  reqObj = {
    page: 0,
    size: 12,
    name: "",
    cardno: "",
    carelevel: "",
    building: "",
    floor: "",
    room: "",
    isout: "2"
  };

  isTableloading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private localStroage: LocalStorage,
    private message: NzMessageService
  ) {}
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  ngOnInit() {
    this.updateList();
    this.userInfo = this.localStroage.getUser();

    console.log(" this.userInfo" + this.userInfo.data.name);
    const that = this;
    // that.httpService.doSearchBuilding(
    //   '',
    //   '',
    //   '',
    //   function(successful, result, res) {
    //     // console.log(result);
    //     that.buildingList = result;
    //   },
    //   function(successful, msg, err) {
    //     const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
    //     that.toastService.toast(toastCfg);
    //   }
    // );
    const param = {
      building: "",
      floor: "",
      room: ""
    };
    this.httpReq.post("/building/searchBuilding", null, param, function(data) {
      if (data["code"] == 0) {
        that.buildingList = data["data"];
      }
    });

    this.httpReq.get("careLevelCase/allList", null, function(data) {
      if (data["code"] == 0) {
        that.nursingGradeList = data["data"];
      }
    });

    // this.getNoses();
  }

  // 获得所有的床位号
  getNoses() {
    const that = this;
    this.httpReq.get("building/all2", null, function(data) {
      if (data["code"] == 0) {
        that.nodes = [
          new NzTreeNode({
            title: "楼房管理",
            key: "1",
            disabled: true
          })
        ];
        const treeData = JSON.parse(data["data"]);
        // console.log(data);
        treeData.children.forEach(ele => {
          that.nodes[0].addChildren([new NzTreeNode(ele)]);
        });
      }
    });
  }

  turnToPersonalFile(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["elderInfo", id], { relativeTo: this.route });
  }

  turnToNursingFile(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    // this.router.navigate(['check'], { relativeTo: this.route });
  }

  /**
   * 更新在院老人列表
   * @param reset
   */
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableloading = true;
    this.httpReq.post("oldman/list1", null, this.reqObj, data => {
      this.isTableloading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"]; // 数据列表
        this.page.total = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  /**
   * 页码变化，更新列表
   * @param curIndex
   */
  onPageIndexChange(curIndex: Number) {
    this.updateList();
  }

  onBuildingChange() {
    this.roomList = new Array();

    this.reqObj.floor = "";
    this.reqObj.room = "";

    if (this.reqObj.building === "") {
      this.floorList = new Array();
    } else {
      // console.log('building:' + this.building);
      const that = this;
      // this.httpService.doSearchBuilding(
      //   this.reqObj.building,
      //   '',
      //   '',
      //   function(successful, result, res) {
      //     that.floorList = result;
      //   },
      //   function(successful, msg, err) {
      //     const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      //     that.toastService.toast(toastCfg);
      //   }
      // );

      const param = {
        building: this.reqObj.building,
        floor: "",
        room: ""
      };
      this.httpReq.post("/building/searchBuilding", null, param, function(
        data
      ) {
        if (data["code"] == 0) {
          that.floorList = data["data"];
        }
      });
    }
  }

  onFloorChange() {
    this.reqObj.room = "";

    if (this.reqObj.floor === "") {
      this.roomList = new Array();
    } else {
      const that = this;
      // that.httpService.doSearchBuilding(
      //   that.reqObj.building,
      //   that.reqObj.floor,
      //   '',
      //   function(successful, result, res) {
      //     that.roomList = result;
      //   },
      //   function(successful, msg, err) {
      //     const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      //     that.toastService.toast(toastCfg);
      //   }
      // );

      const param = {
        building: this.reqObj.building,
        floor: that.reqObj.floor,
        room: ""
      };
      this.httpReq.post("/building/searchBuilding", null, param, function(
        data
      ) {
        if (data["code"] == 0) {
          that.roomList = data["data"];
        }
      });
    }
  }

  onRoomChange() {}

  //显示更改床位弹窗
  EditfireExtinguisher = false; //显示更改床位弹窗
  LevelOfCare = false; //显示更改护理等级
  oldmanId = ""; //老人的id
  UpdateBed = {
    id: "",
    bedId: "",
    changeReason: "",
    noteTaker: ""
  };

  UpdateLevelName = {
    id: "",
    careLevelCase_id: "",
    changeReason: "",
    noteTaker: ""
  };
  nursingGradeList = [];
  oldname = "";
  userInfo;
  bedNameN = "";
  levelNameN = "";
  disabledBedName(id, bedName, oldName, type, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.oldname = oldName;
    this.UpdateLevelName.careLevelCase_id = "";
    if (type == "EditfireExtinguisher") {
      this.bedNameN = bedName;
      this.UpdateBed.id = id;
      this.UpdateBed.bedId = "";
      this.getNoses(); //调取床位接口

      this.EditfireExtinguisher = true;
    } else {
      this.UpdateLevelName.id = id;
      this.levelNameN = bedName;
      this.LevelOfCare = true;
    }
  }
  // 确认保存更改后的床位
  EditfireHandleOk(type) {
    if (type == "EditfireExtinguisher") {
      this.UpdateBed.noteTaker = this.userInfo.data.name;
      this.httpReq.post("oldman/updateBed", null, this.UpdateBed, data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.createMessage("success", "修改成功");

            this.updateList(true);
          } else {
            this.createMessage("error", data["message"]);
          }
          this.EditfireHandleCancel("EditfireExtinguisher");
        }
      });
    } else {
      this.UpdateLevelName.noteTaker = this.userInfo.data.name;
      this.httpReq.post(
        "oldman/updateCareLevelCase",
        null,
        this.UpdateLevelName,
        data => {
          if (data["status"] == 200) {
            if (data.code == "0") {
              this.createMessage("success", "修改成功");
              this.updateList(true);
            } else {
              this.createMessage("error", data["message"]);
            }
            this.EditfireHandleCancel("LevelOfCare");
          }
        }
      );
    }
  }
  // 取消更改床位弹窗
  EditfireHandleCancel(type) {
    if (type == "EditfireExtinguisher") {
      this.EditfireExtinguisher = false;
    } else {
      this.LevelOfCare = false;
    }
  }

  onExpandChange(e: NzFormatEmitEvent): void {
    if (e.node.getChildren().length === 0 && e.node.isExpanded) {
      let that = this;

      that.httpReq.get("building/all2", null, function(data) {
        if (data["code"] == 0) {
          const treeData = JSON.parse(data["data"]);
          treeData.children.forEach(ele => {
            e.node.addChildren([new NzTreeNode(ele)]);
          });
        }
      });
    }
  }

  carelevelChange(e) {
    console.log(e);
    if (e == null) {
      this.reqObj.carelevel = "";
    }
  }
}
