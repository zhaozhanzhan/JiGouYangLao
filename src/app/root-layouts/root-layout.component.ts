import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorage } from "../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../common/service/HttpUtils.Service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./root-layout.component.html",
  styleUrls: ["./root-layout.component.css"]
})
export class RootLayoutComponent implements OnInit {
  public disabled = false;
  public status: { isopen: boolean } = { isopen: false };

  user;

  rolesMemo = [];
  notifyList = [];
  title = "";
  bottom = "";
  isVisible = false;

  editPasswordObj = {
    id: "", // "账号id",
    oldPwd: "", // "旧密码",
    newPwd: "", // "新密码"
    newPwd2: "" // "新密码"
  };
  constructor(
    private localStorage: LocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService
  ) {}

  public toggled(open: boolean): void {
    // console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void {
    const systemInfo: any = JSON.parse(localStorage.getItem("systemInfo"));
    this.title = systemInfo.sysTitle;
    this.bottom = systemInfo.sysBottom;
    // document.getElementById("sysLogo").setAttribute("src", systemInfo.sysLogo);

    this.user = this.localStorage.getUser();
    let menuList = this.localStorage.getUserMenuList();

    this.rolesMemo = menuList.children;

    this.getNotifyList();
  }

  logout() {
    // this.localStorage.saveLoginUserName('');
    this.localStorage.saveUser("");
    this.router.navigate(["/"], { relativeTo: this.route });
  }

  getNotifyList() {
    const that = this;
    // that.httpService.doGetNotifyList(1, 20, function (successful, data, res) {
    //   that.notifyList = data.HList;
    //   // setTimeout(() => {
    //   //   document.querySelector('body').classList.toggle('aside-menu-hidden');
    //   // }, 5000);
    // }, function (successful, msg, err) {
    //   const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
    //   that.toastService.toast(toastCfg);
    // });
  }

  // 修改密码
  edit() {
    this.isVisible = true;
  }

  handleOk() {
    if (this.editPasswordObj.newPwd != this.editPasswordObj.newPwd2) {
      this.message.error("新密码和确认密码输入不一致");
      return;
    }

    if (this.editPasswordObj.oldPwd == "") {
      this.message.error("旧密码不能为空");
      return;
    }

    this.editPasswordObj.id = this.user.data.id;

    this.httpReq.post(
      "account/changeShowPwd",
      null,
      this.editPasswordObj,
      data => {
        if (data["code"] == 0) {
          this.message.success("修改密码成功");
          this.logout();
        } else {
          // this.message.error(data["message"]);
        }
      }
    );
  }
}
