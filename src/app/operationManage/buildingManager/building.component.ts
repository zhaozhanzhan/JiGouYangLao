import { Component, OnInit } from "@angular/core";
import { NzTreeNode, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";

@Component({
  selector: "app-building",
  templateUrl: "building.component.html",
  styleUrls: ["./building.component.css"]
})
export class BuildingComponent implements OnInit {
  cardToSee = "listBuilding";
  buildingList;
  building;
  floorList;
  floor;
  roomList;
  room;
  bedList;
  bed;
  buildingId;
  floorId;
  roomId;

  expandKeys = ["1"];
  nodes = [];

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  mouseAction(name: string, e: any): void {
    if (name != "click") {
      return;
    }
    if (e.node.level == 0) {
      this.cardToSee = "listBuilding";
      this.updateBuildingList();
    } else if (e.node.level == 1) {
      this.cardToSee = "listFloor";
      this.buildingId = e.node.key;
      this.updateFloorList();
    } else if (e.node.level == 2) {
      this.cardToSee = "listRoom";
      this.floorId = e.node.key;
      this.updateRoomList();
    } else if (e.node.level == 3) {
      this.cardToSee = "listBed";
      this.roomId = e.node.key;
      this.updateBedList();
    } else {
    }
  }

  ngOnInit() {
    this.building = {};
    this.floor = {};
    this.room = {};
    this.bed = {};

    this.updateBuildingTree();
    this.updateBuildingList();
  }

  updateBuildingTree() {
    this.nodes = [];
    this.httpReq.get("building/all1", null, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        this.nodes.push(new NzTreeNode(result));
      }
    });
  }

  turnToAddBuilding() {
    this.cardToSee = "addBuilding";
  }

  turnToEditBuilding(building) {
    this.building = building;
    this.cardToSee = "editBuilding";
  }

  backToBuildingList() {
    this.building = {};
    this.cardToSee = "listBuilding";
  }

  updateBuildingList() {
    this.httpReq.get("building/list", null, data => {
      if (data["status"] == 200) {
        this.buildingList = data["data"];
      }
    });
  }

  onAddBuilding() {
    this.httpReq.post("building/save", null, this.building, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBuildingTree();
        this.updateBuildingList();
        this.backToBuildingList();
      }
    });
  }

  onEditBuilding() {
    this.httpReq.post("building/edit", null, this.building, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBuildingTree();
        this.updateBuildingList();
        this.backToBuildingList();
      }
    });
  }

  deleteBuilding(building) {
    this.globalService.delModal(() => {
      this.httpReq.post("building/del", null, { id: building.id }, data => {
        if (data["status"] == 200) {
          this.message.success("删除成功！");
          this.updateBuildingTree();
          this.updateBuildingList();
          this.backToBuildingList();
        }
      });
    });
  }

  turnToAddFloor() {
    this.cardToSee = "addFloor";
  }

  turnToEditFloor(floor) {
    this.floor = floor;
    this.cardToSee = "editFloor";
  }

  backToFloorList() {
    this.floor = {};
    this.cardToSee = "listFloor";
  }

  updateFloorList() {
    this.httpReq.post(
      "floor/list",
      null,
      { buildingId: this.buildingId },
      data => {
        if (data["status"] == 200) {
          this.floorList = data["data"];
        }
      }
    );
  }

  onAddFloor() {
    this.floor.buildingId = this.buildingId;
    this.httpReq.post("floor/save", null, this.floor, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBuildingTree();
        this.updateFloorList();
        this.backToFloorList();
      }
    });
  }

  onEditFloor() {
    this.floor.buildingId = this.buildingId;
    this.httpReq.post("floor/edit", null, this.floor, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBuildingTree();
        this.updateFloorList();
        this.backToFloorList();
      }
    });
  }

  deleteFloor(floor) {
    this.globalService.delModal(() => {
      this.httpReq.post("floor/del", null, { id: floor.id }, data => {
        if (data["status"] == 200) {
          this.message.success("删除成功！");
          this.updateBuildingTree();
          this.updateFloorList();
          this.backToFloorList();
        }
      });
    });
  }

  turnToAddRoom() {
    this.cardToSee = "addRoom";
  }

  turnToEditRoom(room) {
    this.room = room;
    this.cardToSee = "editRoom";
  }

  backToRoomList() {
    this.room = {};
    this.cardToSee = "listRoom";
  }

  updateRoomList() {
    this.httpReq.post("room/list", null, { floorId: this.floorId }, data => {
      if (data["status"] == 200) {
        this.roomList = data["data"];
      }
    });
  }

  onAddRoom() {
    this.room.floorId = this.floorId;
    this.httpReq.post("room/save", null, this.room, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBuildingTree();
        this.updateRoomList();
        this.backToRoomList();
      }
    });
  }

  onEditRoom() {
    this.room.floorId = this.floorId;
    this.httpReq.post("room/edit", null, this.room, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBuildingTree();
        this.updateRoomList();
        this.backToRoomList();
      }
    });
  }

  deleteRoom(room) {
    this.globalService.delModal(() => {
      this.httpReq.post("room/del", null, { id: room.id }, data => {
        if (data["status"] == 200) {
          this.message.success("删除成功！");
          this.updateBuildingTree();
          this.updateRoomList();
          this.backToRoomList();
        }
      });
    });
  }

  turnToAddBed() {
    this.cardToSee = "addBed";
  }

  turnToEditBed(bed) {
    this.bed = bed;
    this.cardToSee = "editBed";
  }

  backToBedList() {
    this.bed = {};
    this.cardToSee = "listBed";
  }

  updateBedList() {
    this.httpReq.post("bed/list", null, { roomId: this.roomId }, data => {
      if (data["status"] == 200) {
        this.bedList = data["data"];
      }
    });
  }

  onAddBed() {
    this.bed.roomId = this.roomId;
    this.httpReq.post("bed/save", null, this.bed, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBedList();
        this.backToBedList();
        this.backToBedList();
      }
    });
  }

  onEditBed() {
    this.bed.roomId = this.roomId;
    this.httpReq.post("bed/edit", null, this.bed, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateBedList();
        this.backToBedList();
        this.backToBedList();
      }
    });
  }

  deleteBed(bed) {
    this.globalService.delModal(() => {
      this.httpReq.post("bed/del", null, { id: bed.id }, data => {
        if (data["status"] == 200) {
          this.message.success("删除成功！");
          this.updateBedList();
          this.backToBedList();
        }
      });
    });
  }
}
