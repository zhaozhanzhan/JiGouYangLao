import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzTreeNode, NzMessageService, NzModalService } from "ng-zorro-antd";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  baseUrl;
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: ""
  };

  // 绑定科室
  officeModel = false;
  officeModelData: any;
  allOffice = [];
  selOffice = [];
  //分配班组
  groupModel = false;
  groupModelData: any;
  allGroup = [];
  selGroup = [];
  //分配病房
  sickRoomModel = false;
  sickRoomModelData: any;
  buildingTree: any;
  roomIds: any;
  roomNames: any;
  allSickRoom = [];
  selSickRoom = [];

  isTableLoading = true;

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
    }
    this.baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    this.updateList();
  }

  updateList(reset: boolean = false): void {
    const that = this;
    if (reset) {
      this.page.index = 1;
      this.page.size = 10;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;

    const url = this.baseUrl + "sickWard/list";
    fetch(url, { method: "post", body: JSON.stringify(this.reqObj) })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        that.isTableLoading = false;
        if (res.code == 0) {
          this.list = res.data.list; // 数据列表
          this.page.total = res.data.totalElements; // 总条数
        } else {
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });

    // this.httpReq.post('sickWard/list', null, this.reqObj, data => {
    //   this.isTableLoading = false;
    //   if (data['status'] == 200) {
    //     const result = JSON.parse(data['data']);
    //     this.list = result; // 数据列表
    //     this.page.total = result['totalElements']; // 总条数
    //   }
    // });
  }

  turnToAdd() {
    this.router.navigate(["add"], { relativeTo: this.route });
  }

  turnToEdit(employeeGroup) {
    this.router.navigate(
      ["add", { employeeGroup: JSON.stringify(employeeGroup) }],
      { relativeTo: this.route }
    );
  }

  // 删除病区
  delSickArea(id) {
    this.modalService.confirm({
      nzTitle: "<b>确定要删除该病区?</b>",
      nzOnOk: () => {
        this.httpReq.post("sickWard/del", null, { id: id }, data => {
          if (data["code"] == 0) {
            this.updateList();
            this.msg.success("删除病区成功");
          }
        });
      }
    });
  }

  // 绑定科室弹框
  showOfficeModel(data) {
    this.officeModelData = data;
    this.selOffice = [];
    this.httpReq.post("section_office/listAllNoMedRoom", null, {}, data => {
      if (data["status"] == 200) {
        this.allOffice = data["data"];
        if (this.officeModelData.sectionOfficeIdStr) {
          this.selOffice = this.officeModelData.sectionOfficeIdStr.split(",");
        }
      }
    });
    this.officeModel = true;
  }
  officeModelCancel() {
    this.officeModel = false;
  }
  officeModelOk() {
    const sendData = {
      id: this.officeModelData.id,
      sectionOfficeIds: this.selOffice.join(",")
    };
    this.httpReq.post("sickWard/bindingSectionOffice", null, sendData, data => {
      if (data["code"] == 0) {
        this.msg.success("绑定科室成功");
        this.updateList();
      }
    });
    this.officeModel = false;
  }

  // 分配班组
  showGroupModel(data) {
    this.groupModelData = data;
    this.selGroup = [];
    const url = this.baseUrl + "nurseTeam/listAll";
    fetch(url, { method: "post", body: JSON.stringify(this.reqObj) })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        if (res.code == 0) {
          this.allGroup = res.data;
          if (this.groupModelData.nurseTeamIdStr) {
            this.selGroup = this.groupModelData.nurseTeamIdStr.split(",");
          }
        } else {
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.groupModel = true;
  }
  groupModelCancel() {
    this.groupModel = false;
  }
  groupModelOk() {
    const sendData = {
      id: this.groupModelData.id,
      nurseTeamIds: this.selGroup.join(",")
    };
    this.httpReq.post("sickWard/bindingNurseTeam", null, sendData, data => {
      if (data["code"] == 0) {
        this.msg.success("分配班组成功");
        this.selGroup = [];
        this.updateList();
      }
    });
    this.groupModel = false;
  }

  //分配病房
  showSickRoomModel(data) {
    this.sickRoomModelData = data;
    this.allSickRoom = [];
    this.httpReq.get("building/all1", null, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        this.buildingTree = result;
        this.allSickRoom.push(new NzTreeNode(result));
        if (this.sickRoomModelData.bedIds) {
          this.selSickRoom = this.sickRoomModelData.bedIds.split(",");
          console.log(this.selSickRoom);
        }
      }
    });
    this.sickRoomModel = true;
  }
  sickRoomModelCancel() {
    this.sickRoomModel = false;
  }
  sickRoomModelOk() {
    this.dealData(this.selSickRoom);
    const sendData = {
      id: this.sickRoomModelData.id,
      roomIds: this.roomIds,
      roomNames: this.roomNames
    };
    this.httpReq.post("sickWard/bindingBed", null, sendData, data => {
      if (data["code"] == 0) {
        this.msg.success("分配病房成功");
        this.updateList();
      }
    });
    this.sickRoomModel = false;
  }
  onChange($event: NzTreeNode): void {}
  dealData(value: string[]) {
    let ids = [];
    let names = [];
    if (value.indexOf("1", 0) != -1) {
      this.buildingTree.children.forEach(e => {
        e.children.forEach(e2 => {
          e2.children.forEach(e3 => {
            ids.push(e3.key);
            names.push(e3.name);
          });
        });
      });
    }

    this.buildingTree.children.forEach(e => {
      if (value.indexOf(e.key, 0) != -1) {
        e.children.forEach(e2 => {
          e2.children.forEach(e3 => {
            ids.push(e3.key);
            names.push(e3.name);
          });
        });
      }

      e.children.forEach(e2 => {
        if (value.indexOf(e2.key, 0) != -1) {
          e2.children.forEach(e3 => {
            ids.push(e3.key);
            names.push(e3.name);
          });
        }

        e2.children.forEach(e6 => {
          if (value.indexOf(e6.key, 0) != -1) {
            ids.push(e6.key);
            names.push(e6.name);
          }
        });
      });
    });
    this.roomIds = ids.join(",");
    this.roomNames = names.join(",");
  }
}
