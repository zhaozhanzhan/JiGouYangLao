import { Utils } from "../common/utils/utils";
import { Component, OnInit, Directive } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";
import { HttpReqService } from "../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../common/service/local.storage";
@Component({
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"]
})
export class LoginComponent implements OnInit {
  _success = new Subject<string>();
  userName = "";
  password = "";

  data = {
    num: "",
    password: "",
    validateCode: "",
    pictureCode: ""
  };
  isRemember = false;
  isBtnLoging = false;
  title = "";
  bottom = "";
  constructor(
    private router: Router,
    private localStorage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    const systemInfo: any = JSON.parse(localStorage.getItem("systemInfo"));
    this.title = systemInfo.sysTitle;
    this.bottom = systemInfo.sysBottom;
    document.getElementById("sysLogo").setAttribute("src", systemInfo.sysLogo);

    let temp = this.localStorage.getLoginUserName();
    if (!Utils.isEmpty(temp)) {
      this.data.num = temp;
      this.isRemember = true;
    }
    // 请求验证码图片
    this.code();
  }
  // 请求验证码图片
  code() {
    this.httpReq.get("account/getValidateCode", null, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        const codeImgStr = result["codeImgStr"];
        document
          .getElementById("img")
          .setAttribute("src", "data:image/png;base64," + codeImgStr);
        this.data.pictureCode = result["vCode"];
      }
    });
  }
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  public doLogin() {
    const that = this;
    if (that.data.num == "" || that.data.password == "") {
      this.createMessage("error", "用户名或密码不能为空");
      return;
    }

    if (that.data.validateCode == "") {
      this.createMessage("error", "验证码不能为空");
      return;
    }

    if (that.isRemember) {
      that.localStorage.saveLoginUserName(that.data.num);
    } else {
      that.localStorage.saveLoginUserName("");
    }
    this.isBtnLoging = true;
    this.httpReq.post("account/vcodelogin", null, this.data, data => {
      this.isBtnLoging = false;
      if (data.code == "0") {
        that.localStorage.saveLoginTime();
        that.localStorage.saveUser(JSON.stringify(data));
        sessionStorage.setItem("userName", JSON.stringify(that.data.num));
        sessionStorage.setItem("personName", data["data"]["name"]);
        if (data["data"]["role"]) {
          this.getRoleMenuList(data["data"]["role"]["id"]);
        }
      }
    });
  }

  //根据角色获取菜单列表
  getRoleMenuList(id) {
    if (!id) {
      return;
    }
    this.isBtnLoging = true;
    //  获得角色列表
    this.httpReq.post(
      "sysRelation/listRelationAllLogin",
      null,
      { roleId: id },
      data => {
        this.isBtnLoging = false;
        if (data["status"] == 200 && data["code"] == 0) {
          this.createMessage("success", "登录成功!");
          this.localStorage.saveUserMenuList(data["data"]);
          this.router.navigate(["nursingHome"]);
        }
      }
    );
  }

  /**
   * alert
   */
  notifyMsg: string = "";
  alertType: string = "";

  /**
   *
   * @param msg 提示信息
   * @param type success，info，warning，danger
   */
  public showAlert(msg: string, type: string) {
    this.notifyMsg = msg;
    this.alertType = type;
    setTimeout(() => (this.notifyMsg = null), 2000);
  }
}
