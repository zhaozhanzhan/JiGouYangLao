import { Directive, ElementRef, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorage } from "../service/local.storage";
import { Utils } from "../utils/utils";

@Directive({ selector: "[roleBtnControll]" })
export class RoleBtnDirective implements OnInit {
  @Input() roleBtnKey: string;

  constructor(
    private el: ElementRef,
    private router: Router,
    private localStorage: LocalStorage
  ) {}
  ngOnInit(): void {
    if (Utils.isNotEmpty(this.roleBtnKey)) {
      let menuList = this.localStorage.getUserMenuList();
      let isShowBtn = this.queryBtnLimit(menuList.children, this.roleBtnKey);

      if (isShowBtn === false) {
        this.el.nativeElement.style.display = "none";
      }
    }
  }
  /**
   * 从配置的权限中查询按钮的权限
   */
  queryBtnLimit(menuList, btnKey) {
    //根据当前访问Url获取对应的功能菜单列表
    let routeArray = this.router.url.split("/");
    const level1UrlName = routeArray[2];
    const level2UrlName = routeArray[routeArray.length - 1];

    //按钮控制为第三级控制，第一级为功能模块，第二级为功能菜单；
    if (Utils.isNotEmpty(level1UrlName) && Utils.isNotEmpty(level2UrlName)) {
      //根据一级、二级菜单检索是否配置按钮；
      for (let level1Index = 0; level1Index < menuList.length; level1Index++) {
        const menu1Level = menuList[level1Index];

        //识别第一级菜单
        if (
          menu1Level &&
          Utils.isNotEmpty(menu1Level.url) &&
          menu1Level.url == level1UrlName &&
          Utils.isArray(menu1Level.children)
        ) {
          for (
            let level2Index = 0;
            level2Index < menu1Level.children.length;
            level2Index++
          ) {
            const menu2Level = menu1Level.children[level2Index];
            //识别二级菜单组和二级菜单
            if (Utils.isEmpty(menu2Level.url)) {
              //空url为二级菜单组
              for (
                let level3Index = 0;
                level3Index < menu2Level.children.length;
                level3Index++
              ) {
                const menu3Level = menu2Level.children[level3Index];
                if (
                  (menu3Level.url == level2UrlName ||
                    menu3Level.url.indexOf(level2UrlName) != -1) &&
                  Utils.isArray(menu3Level.children)
                ) {
                  //遍历到按钮控制层
                  for (
                    let level4Index = 0;
                    level4Index < menu3Level.children.length;
                    level4Index++
                  ) {
                    const menu4Level = menu3Level.children[level4Index];
                    if (menu4Level.url == btnKey) {
                      return menu4Level.status && menu4Level.isuse == 1;
                    }
                  }
                }
              }
            } else {
              //url有值标识为二级菜单
              if (
                (menu2Level.url == level2UrlName ||
                  menu2Level.url.indexOf(level2UrlName) != -1) &&
                Utils.isArray(menu2Level.children)
              ) {
                //遍历到按钮控制层
                for (
                  let level3Index = 0;
                  level3Index < menu2Level.children.length;
                  level3Index++
                ) {
                  const menu3Level = menu2Level.children[level3Index];
                  if (menu3Level.url == btnKey) {
                    return menu3Level.status && menu3Level.isuse == 1;
                  }
                }
              }
            }
          }
        }
      }
    }
    return true;
  }
}
