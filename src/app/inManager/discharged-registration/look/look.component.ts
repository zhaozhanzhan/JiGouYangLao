import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-look",
  templateUrl: "./look.component.html",
  styleUrls: ["./look.component.css"]
})
export class LookComponent implements OnInit {
  discharged;
  oldman;
  id;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.discharged = {};
    this.discharged.des = {};
    this.oldman = {};

    let dischargedId = this.route.snapshot.paramMap.get("id");
    this.id = dischargedId;
    if (dischargedId) {
      let that = this;
      this.httpReq.post(
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
    }
  }

  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  onSave() {
    let that = this;
    let param = this.httpReq.post(
      "/dischargeRegistration/doApply",
      null,
      { id: that.id },
      data => {
        if (data["status"] == 200) {
          that.createMessage("success", "审核成功");
          that.back();
        }
      }
    );
  }
  back() {
    history.back();
  }
}
