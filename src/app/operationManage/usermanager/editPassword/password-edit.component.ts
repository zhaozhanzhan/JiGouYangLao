import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";

@Component({
  selector: "app-user-password",
  templateUrl: "./password-edit.component.html",
  styleUrls: ["./password-edit.component.scss"]
})
export class PasswordEditComponent implements OnInit {
  user = {
    id: "",
    num: "",
    newPwd: "",
    comfirmPwd: ""
  };

  isSaveBtnLoading = false;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    let that = this;
    that.route.params.subscribe((params: Params) => {
      const userStr = params["user"];
      let tempInfo = JSON.parse(userStr);
      that.user.id = tempInfo.id;
      that.user.num = tempInfo.num;
    });
  }

  back() {
    history.back();
  }

  onSubmit() {
    if (Utils.isEmpty(this.user.newPwd)) {
      this.message.warning("请设置新密码！");
      return;
    }

    if (this.user.newPwd != this.user.comfirmPwd) {
      this.message.warning("两次新密码输入有误！");
      return;
    }
    this.isSaveBtnLoading = true;
    this.httpReq.post("account/changePwd", null, this.user, data => {
      this.isSaveBtnLoading = false;
      if (data["code"] == 0) {
        this.message.success("保存成功！");
        this.back();
      }
    });
  }
}
