/**
 * name:全局服务类
 * describe:全局共用的方法服务类
 * author:赵展展
 * QQ:799316652
 * Email:zhanzhan.zhao@mirrortech.cn
 */
import { Injectable } from "@angular/core"; // 注入服务注解
import { NzModalService } from "ng-zorro-antd";

@Injectable()
export class GlobalService {
  constructor(private modalService: NzModalService) {}

  /**
   * 删除提示弹出框
   * @param {*} delFun 传入要执行的删除方法以及删除完成的回调操作
   * @memberof GlobalService
   */
  public delModal(delFun: any) {
    this.modalService.confirm({
      nzTitle: "请确认是否删除？",
      // nzContent   : '<b style="color: red;">Some descriptions</b>',
      nzOkText: "取消",
      nzOkType: "default",
      nzOnOk: () => console.log("单击取消按钮！"),
      nzCancelText: "删除",
      nzOnCancel: delFun
    });
  }
}
