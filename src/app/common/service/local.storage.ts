import { Provider } from "@angular/core";
export class LocalStorage {
  public localStorage: any;

  constructor() {
    if (!localStorage) {
      throw new Error("Current browser does not support Local Storage");
    }
    this.localStorage = localStorage;
  }

  set(key: string, value: string): void {
    this.localStorage[key] = value;
  }

  get(key: string): string {
    return this.localStorage[key] || "";
  }

  setObject(key: string, value: any): void {
    this.localStorage[key] = JSON.stringify(value);
  }

  getObject(key: string): any {
    return JSON.parse(this.localStorage[key] || "{}");
  }

  public remove(key: string): any {
    this.localStorage.removeItem(key);
  }

  /**
   * 保存登录时间
   */
  public saveLoginTime() {
    let curTime: number = new Date().getTime();
    this.set("LoginTime", curTime.toString());
  }
  /**
   * 获取登录时间
   */
  public getLoginTime() {
    return Number(this.get("LoginTime"));
  }

  /**
   * 记住用户名
   * @param userName
   */
  public saveLoginUserName(userName: string) {
    this.set("LoginUserName", userName);
  }

  /**
   * 获取记住的用户名
   */
  public getLoginUserName() {
    return this.get("LoginUserName");
  }
  /**
   * 保存登录的用户信息
   * @param user
   */
  public saveUser(user: string) {
    this.set("UserInfo", user);
  }

  /**
   * 获取已登录的用户信息
   */
  public getUser() {
    let userInfo: Object = null;
    try {
      userInfo = JSON.parse(this.get("UserInfo"));
    } catch (error) {}
    return userInfo;
  }

  /**
   * 保存登录的用户菜单信息
   * @param user
   */
  public saveUserMenuList(menuList: string) {
    this.set("UserMenuList", menuList);
  }

  /**
   * 获取已登录的用户菜单信息
   */
  public getUserMenuList() {
    let menuList = null;
    try {
      menuList = JSON.parse(this.get("UserMenuList"));
    } catch (error) {}
    return menuList;
  }
}
