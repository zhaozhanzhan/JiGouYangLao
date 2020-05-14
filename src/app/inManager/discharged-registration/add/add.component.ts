import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  discharged;
  userInfo;
  oldman;

  elderlyList = [];
  isLoading = false;

  constructor(
    private httpReq: HttpReqService,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private message: NzMessageService
  ) {}
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  isAdd = true;
  isTableLoading = false;
  ngOnInit() {
    this.discharged = {};
    this.discharged.des = {};
    this.oldman = {};
    this.userInfo = this.localStroage.getUser();

    let dischargedId = this.route.snapshot.paramMap.get("id");
    if (dischargedId) {
      this.isAdd = false;
      let that = this;
      let param = this.httpReq.post(
        "/dischargeRegistration/findById",
        null,
        { id: dischargedId },
        data => {
          if (data["status"] == 200) {
            that.discharged = data["data"];
            that.oldman = data["data"].oldman;
            that.discharged.des = JSON.parse(data["data"].des);
          }
        }
      );
    } else {
      this.onSearch("");
    }
  }

  onSave(applicantName, huliName, caiwuName) {
    this.isTableLoading = true;
    this.discharged.des.applicantName = applicantName;
    this.discharged.des.huliName = huliName;
    this.discharged.des.caiwuName = caiwuName;

    if (this.discharged.id) {
      this.discharged.modifier = this.userInfo.name;
      this.edit();
    } else {
      this.discharged.noteTaker = this.userInfo.name;
      this.add();
    }
  }

  add() {
    console.log(this.discharged.oldid);
    if (this.discharged.oldid == undefined) {
      this.isTableLoading = false;
      this.createMessage("error", "出院老人不能为空！");
      return;
    }

    if (this.discharged.leavetime == undefined) {
      this.isTableLoading = false;
      this.createMessage("error", "出院日期不能为空！");
      return;
    }

    const that = this;
    let param = this.httpReq.post(
      "/dischargeRegistration/save",
      null,
      this.discharged,
      data => {
        if (data["status"] == 200) {
          that.createMessage("success", "保存成功");
          that.back();
        } else {
          this.createMessage("error", "保存失败");
        }
      }
    );
  }

  edit() {
    // if (this.discharged.oldid == undefined) {
    //   this.isTableLoading = false;
    //   this.createMessage("error", "出院老人不能为空！");
    //   return;
    // }

    // if (this.discharged.leavetime == undefined) {
    //   this.isTableLoading = false;
    //   this.createMessage("error", "出院日期不能为空！");
    //   return;
    // }

    const that = this;
    let param = this.httpReq.post(
      "/dischargeRegistration/edit",
      null,
      this.discharged,
      data => {
        if (data["status"] == 200) {
          that.createMessage("success", "保存成功");
          that.back();
        } else {
          this.createMessage("error", "保存失败");
        }
      }
    );
  }

  back() {
    history.back();
  }

  onOldChange(oldid) {
    this.elderlyList.forEach(ele => {
      if (ele.id == oldid) {
        this.discharged.roomName = ele.bed ? ele.bed.room.roomName : "";
        this.discharged.bedName = ele.bed ? ele.bed.bedName : "";
      }
    });
    // for(var i=0;i<this.elderlyList.length;i++){
    //       if(this.elderlyList[i].id==oldid){
    //         this.discharged.room = this.elderlyList[i].bed ? this.elderlyList[i].bed.room.roomName : '';
    //         this.discharged.bed = this.elderlyList[i].bed ? this.elderlyList[i].bed.bedName : '';
    //       }
    // }
  }

  onSearch(value: string): void {
    this.isLoading = true;
    const that = this;
    let param = this.httpReq.post(
      "/oldman/listAll",
      null,
      { name: value },
      data => {
        if (data["status"] == 200) {
          that.elderlyList = data["data"];
          that.isLoading = false;
        }
      }
    );
  }

  /**
   * 显示老人选择对话框，并加载老人列表
   */
  isShowOldDialog = false;
  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    graranteesno: "",
    hasbed: "",
    nursinglevel: "",
    building: "",
    floor: "",
    room: ""
  };
  isOldTableLoading = false;
  searchOldName = "";
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };

  showOldDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowOldDialog = true;
    this.loadingOldList();
  }

  /**
   * 加载老人列表
   */
  loadingOldList(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.oldQueryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldQueryParams.page = this.oldQueryParams.page - 1;
      if (this.oldQueryParams.page < 0) {
        this.oldQueryParams.page = 0;
      }
    }
    that.oldQueryParams.name = that.searchOldName;
    that.isOldTableLoading = true;
    let param = this.httpReq.post(
      "oldman/listAll",
      null,
      this.oldQueryParams,
      data => {
        that.oldQueryParams.page++;
        that.isOldTableLoading = false;
        if (data["status"] == 200) {
          this.oldDataArray = data["data"]; // 数据列表
        }
      }
    );
  }
  /**
   * 老人选择对话框中选择了某个老人；
   */
  oldName = "";
  chooseOld(oldInfo, name, bedname, roomname) {
    this.oldName = name;
    this.discharged.oldid = oldInfo;
    this.discharged.bedName = bedname;
    this.discharged.roomName = roomname;
    this.isShowOldDialog = false;
    // this.saveContractParams.oldman_id = oldInfo.id;
    // this.saveContractParams.name = oldInfo.name;
    // this.saveContractParams.birthYearMonth = oldInfo.birthYearMonth;
    // this.saveContractParams.education = oldInfo.education;
    // // this.saveContractParams.bed = this.oldInfo.bed;
    // this.saveContractParams.admissionNo = oldInfo.admissionNo;
    // this.saveContractParams.occupation = oldInfo.occupation;
    // this.saveContractParams.sex = oldInfo.sex;
    // this.saveContractParams.marriage = oldInfo.marriage;
    // this.saveContractParams.inDate = oldInfo.inDate;
  }
  /**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }
}
