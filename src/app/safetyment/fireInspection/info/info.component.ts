import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { LocalStorage } from "../../../common/service/local.storage";

import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private modalService: NzModalService
  ) {}
  FireAreaID = {
    //请求巡查的详情参数
    id: ""
  };
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  // 巡查记录的数组
  PatrolRecordList = [];
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.FireAreaID.id = id;
    let param = this.httpReq.post(
      "/ffdMemo/findByAreaMemoId",
      null,
      this.FireAreaID,
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            data["data"] = JSON.parse(data["data"]);
            this.PatrolRecordList = data["data"];
            console.log(this.PatrolRecordList);
          } else {
            this.createMessage("error", data["message"]);
          }
        }
      }
    );
  }

  back() {
    history.back();
  }
  // 点击查看显示模态框
  showFirePatrol(infoDetails, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (infoDetails == null) {
      this.router.navigate(["../../infoDetails", "{}"], {
        relativeTo: this.route
      });
    } else {
      this.router.navigate(["../../infoDetails", JSON.stringify(infoDetails)], {
        relativeTo: this.route
      });
    }
  }
}
