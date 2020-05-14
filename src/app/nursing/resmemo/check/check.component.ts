import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

export class EmergencyContact {
  name: string;
  relationship: string;
  address: string;
  phone: string;
}

@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.scss"]
})
export class CheckComponent implements OnInit {
  resMemo;

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    this.resMemo = {};

    this.route.params.subscribe((params: Params) => {
      const resMemoStr = params["resMemo"];
      // console.log(resMemoStr);
      if (resMemoStr != "{}") {
        this.resMemo = JSON.parse(resMemoStr);
      }
    });
  }
  chType() {
    if (this.resMemo.checktype == "buhege") {
      this.resMemo.checkmemo = "";
    }
  }
  back() {
    history.back();
  }

  onSave() {
    const param = {
      id: this.resMemo.id,
      checktype: this.resMemo.checktype,
      checkmemo: this.resMemo.checkmemo
    };
    this.httpReq.post("resMemo/doCheck1", null, param, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.back();
      }
    });
    // console.log(this.resMemo);
    // const that = this;
    // this.httpService.doCheckResMemo(this.resMemo.id, this.resMemo.checktype, this.resMemo.checkmemo, function (successful, data, res) {
    //   const toastCfg = new ToastConfig(ToastType.SUCCESS, '', "长者信息保存成功！", 3000);
    //   that.toastService.toast(toastCfg);
    //   that.back();
    // }, function (successful, msg, err) {
    //   const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
    //   that.toastService.toast(toastCfg);
    // });
  }
}
