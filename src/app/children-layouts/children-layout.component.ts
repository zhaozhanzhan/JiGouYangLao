import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorage } from "../common/service/local.storage";
import { NzIconService } from "ng-zorro-antd";
import { Utils } from "../common/utils/utils";

@Component({
  selector: "app-children",
  templateUrl: "./children-layout.component.html",
  styleUrls: ["./children-layout.component.scss"]
})
export class ChildrenLayoutComponent implements OnInit {
  isCollapsed = false;
  user;
  rolesMemo;
  bottom = "";
  constructor(
    private localStorage: LocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    private iconService: NzIconService
  ) {
    iconService.fetchFromIconfont({
      scriptUrl: "https://at.alicdn.com/t/font_1038679_h9oe4uua1gr.js"
    });
  }

  ngOnInit(): void {
    const systemInfo: any = JSON.parse(localStorage.getItem("systemInfo"));
    this.bottom = systemInfo.sysBottom;
    this.showDrow = false;
    const urlType = this.router.url.split("/")[2];
    this.user = this.localStorage.getUser();
    //根据当前访问Url获取对应的功能菜单列表
    let menuList = this.localStorage.getUserMenuList();
    //获取所有1级菜单列表
    let menuLevel1 = menuList.children;
    for (let i = 0; i < menuLevel1.length; i++) {
      let tempKey = menuLevel1[i].url;
      if (urlType == tempKey) {
        let childrenRoleMenu = menuLevel1[i].children;
        for (let index = 0; index < childrenRoleMenu.length; index++) {
          if (
            Utils.isArray(childrenRoleMenu[index].children) &&
            childrenRoleMenu[index].children.length > 0 &&
            childrenRoleMenu[index].children[0].ismenu == "0"
          ) {
            childrenRoleMenu[index].children = undefined;
          }
        }
        this.rolesMemo = childrenRoleMenu;
      }
    }
  }

  showDrow = false;
  showDrowMenu() {
    if (this.showDrow == true) {
      this.showDrow = false;
    } else {
      this.showDrow = true;
    }
  }
}
