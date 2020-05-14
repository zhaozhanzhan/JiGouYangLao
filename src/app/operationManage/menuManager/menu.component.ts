import { Component, OnInit } from "@angular/core";
import { NzTreeNode, NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { Router } from "@angular/router";
import { LocalStorage } from "../../common/service/local.storage";
import { Utils } from "../../common/utils/utils";

@Component({
  selector: "app-menu",
  templateUrl: "menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  resultMenuList;
  menuTreeList = [];
  dialogStyle = {
    marginBottom: "100px"
  };
  isDialogBtnLoading = false;
  isShowModifyDialog = false;

  //当前选择的菜单名称
  selectedMenuTitle = "";
  menuInfo = {
    id: "", //菜单id(新增时不传值)
    code: "", //菜单编号
    pcode: "", //菜单父编号
    name: "", //菜单名
    icon: "", //菜单图标
    url: "", //请求地址
    num: "", //菜单排序号
    ismenu: "1", //是否是菜单（1：是 0：不是）
    tips: "", //备注
    status: "1", //权限状态: 1: 启用 0: 不启用
    isopen: "1", //是否打开: 1:打开 0:不打开
    accountId: "" //账户Id
  };

  expandKeys = [0];
  nodes = [];

  queryParams = {
    page: 1,
    size: 10,
    name: "",
    levels: "",
    code: "",
    isuse: ""
  };

  //左侧选择树上选中的菜单
  selectedTreeInfo;

  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };

  constructor(
    private router: Router,
    private modalService: NzModalService,
    private localStroage: LocalStorage,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  userInfo;
  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.updateTree();
    this.updateList();
  }

  mouseAction(name: string, e: any): void {
    if (name != "click") {
      return;
    }
    this.queryParams.code = e.node.origin.key;

    this.selectedTreeInfo = e.node.origin;
    console.log("tag", this.selectedTreeInfo);
    let selectedTitle = e.node.origin.title;
    if (selectedTitle == "顶级") {
      this.selectedMenuTitle = "";
    } else {
      this.selectedMenuTitle = selectedTitle;
    }
    this.updateList();
  }

  updateTree() {
    this.nodes = [];
    this.httpReq.post(
      "sysMenu/listTreeAll",
      null,
      { pcode: "0", showAll: "1" },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          const result = JSON.parse(data["data"]);
          this.resultMenuList = JSON.parse(JSON.stringify(result));
          result.children.forEach(level1 => {
            if (Utils.isArray(level1.children)) {
              level1.children.forEach(level2 => {
                level2.icon = "";
              });
            }
          });
          this.nodes.push(new NzTreeNode(result));
        }
      }
    );
  }

  updateList(reset: boolean = false): void {
    let that = this;
    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }

    that.isTableLoading = true;
    this.httpReq.post("sysMenu/listPage", null, this.queryParams, data => {
      that.queryParams.page++;
      sessionStorage.setItem(that.router.url, JSON.stringify(that.queryParams));
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.dataArray = data["data"]["content"]; // 数据列表
        that.resultData.totalElements = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  showEnDisableConfirm(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    let text;
    if (data.isuse == 1) {
      text = "禁用";
    } else {
      text = "启用";
    }

    this.modalService.confirm({
      nzTitle: "请确认是否" + text + "？",
      // nzContent   : '<b style="color: red;">Some descriptions</b>',
      nzOkText: "确认",
      nzOkType: data.isuse == 1 ? "danger" : "default",
      nzOnOk: () => {
        this.enDisable(data);
      },
      nzCancelText: "取消",
      nzOnCancel: () => console.log("单击取消按钮！")
    });
  }

  enDisable(data) {
    let text;
    if (data.isuse == 1) {
      text = "禁用";
    } else {
      text = "启用";
    }

    const reqObj: any = {};
    reqObj.code = data.code;

    let that = this;
    that.isTableLoading = true;
    this.httpReq.post("sysMenu/enOrDisable", null, reqObj, data => {
      that.isTableLoading = false;
      if (data["status"] == 200 && data["code"] == 0) {
        that.message.success(text + "成功！");
        that.updateList();
      }
    });
  }

  showDeleteConfirm(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.globalService.delModal(() => {
      this.deleteData(id);
    });
  }

  deleteData(id) {
    const reqObj: any = {};
    reqObj.id = id;

    let that = this;
    that.isTableLoading = true;
    this.httpReq.post("sysMenu/delete", null, reqObj, data => {
      that.isTableLoading = false;
      if (data["code"] == 0) {
        that.message.success("删除成功！");
        that.updateList();
        that.updateTree();
      }
    });
  }

  //显示角色编辑对话框
  showModifyDialog(item) {
    if (item) {
      this.menuInfo = item;
    } else {
      this.menuInfo = {
        id: "", //菜单id(新增时不传值)
        code: "", //菜单编号
        pcode: "", //菜单父编号
        name: "", //菜单名
        icon: "", //菜单图标
        url: "", //请求地址
        num: "", //菜单排序号
        ismenu: "1", //是否是菜单（1：是 0：不是）
        tips: "", //备注
        status: "1", //权限状态: 1: 启用 0: 不启用
        isopen: "1", //是否打开: 1:打开 0:不打开
        accountId: "" //账户Id
      };

      if (this.selectedTreeInfo) {
        this.menuInfo.pcode = this.selectedTreeInfo.key;
      }
    }
    this.menuTreeList = [];
    this.menuTreeList.push(this.resultMenuList);
    this.isShowModifyDialog = true;
  }

  doSaveModify() {
    this.menuInfo.accountId = this.userInfo.id;
    if (Utils.isEmpty(this.menuInfo.code)) {
      this.message.warning("请输入菜单编号！");
      return;
    }

    if (Utils.isEmpty(this.menuInfo.pcode)) {
      this.message.warning("请输入父菜单编号！");
      return;
    }

    if (Utils.isEmpty(this.menuInfo.name)) {
      this.message.warning("请输入菜单名称！");
      return;
    }

    if (Utils.isEmpty(this.menuInfo.num)) {
      this.message.warning("请输入排序号");
      return;
    }

    this.isDialogBtnLoading = true;
    this.httpReq.post("sysMenu/saveOrUpdate", null, this.menuInfo, data => {
      this.isDialogBtnLoading = false;
      if (data["status"] == 200 && data["code"] == 0) {
        this.message.success("保存成功！");
        this.updateTree();
        this.updateList();
        this.isShowModifyDialog = false;
      }
    });
  }
}
