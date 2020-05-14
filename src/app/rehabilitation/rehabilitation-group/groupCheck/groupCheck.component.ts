import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
@Component({
  selector: "app-groupCheck",
  templateUrl: "./groupCheck.component.html",
  styleUrls: ["./groupCheck.component.css"]
})
export class GroupCheckComponent implements OnInit {
  userInfo;
  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {}

  recureObj = {
    id: "",
    recureDate: "",
    recureContent: "",
    oldmanGroup: [],
    number: "",
    accountId: ""
  };
  ngOnInit() {
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
  // 返回
  back() {
    history.back();
  }
}
