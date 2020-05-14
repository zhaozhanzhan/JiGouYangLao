import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-groupAdd",
  templateUrl: "./groupAdd.component.html",
  styleUrls: ["./groupAdd.component.css"]
})
export class GroupAddComponent implements OnInit {
  // 显示老人弹出框
  isShowOldDialog = false;
  // 加载老人的参数
  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    beginTime: "",
    endTime: ""
  };
  //老年人选择对话框检索
  searchOldName = "";
  //老年人列表table加载状态
  isOldTableLoading = false;
  // 老人的列表
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };
  // 获得用户信息变量
  userInfo;
  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private localStroage: LocalStorage
  ) {}

  savePersonalBtnLoading = false;

  recureObj = {
    id: "",
    recureDate: "",
    recureContent: "",
    oldmanGroup: [],
    number: "",
    accountId: ""
  };
  ngOnInit() {
    // 获得个人信息  accountId
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    this.recureObj.accountId = this.userInfo.id;
    this.getOldmanName();
    // 编辑时获得的信息
    const rehabilitaitionGroupStr = this.route.snapshot.paramMap.get("info");
    if (rehabilitaitionGroupStr) {
      const rehabilitaitionGroup = JSON.parse(rehabilitaitionGroupStr);
      this.recureObj.id = rehabilitaitionGroup.id;
      this.recureObj.recureDate = rehabilitaitionGroup.recureDate;
      this.recureObj.recureContent = rehabilitaitionGroup.recureContent;
      if (rehabilitaitionGroup.oldmanGroup != "") {
        this.recureObj.oldmanGroup = JSON.parse(
          rehabilitaitionGroup.oldmanGroup
        );
      } else {
        this.recureObj.oldmanGroup = [];
      }
      this.recureObj.number = rehabilitaitionGroup.number;
    }
  }

  // 保存事件
  onSavePersonalInfo() {
    this.httpReq.post("/rcGroup/saveOrUpdate", null, this.recureObj, data => {
      this.savePersonalBtnLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        } else {
          this.message.error(data.message);
        }
      }
    });
  }

  oldman = {
    name: ""
  };
  oldmanList = [];
  // 获得需要团体个案的老人
  getOldmanName() {
    this.httpReq.post("/oldman/listAll", null, this.oldman, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          const oldmanInfo = data["data"];
          let number = 0;
          oldmanInfo.forEach(element => {
            const info = {
              label: "",
              value: number
            };
            info.label = element.name;
            info.value = info.value++;
            number++;
            this.oldmanList.push(info);
            console.log(this.oldmanList);
          });
        } else {
          this.message.error(data.message);
        }
      }
    });
  }
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  // 返回
  back() {
    history.back();
  }
}
