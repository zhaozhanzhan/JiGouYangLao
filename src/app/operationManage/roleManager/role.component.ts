import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { Utils } from "../../common/utils/utils";
import { GlobalService } from "../../common/service/GlobalService";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";
import { LocalStorage } from "../../common/service/local.storage";

@Component({
  selector: "app-role",
  templateUrl: "role.component.html",
  styleUrls: ["./role.component.css"]
})
export class RoleManagerComponent implements OnInit {
  //菜单树列表
  menuTreeList = [];

  //是否显示权限配置对话框
  isShowModifyMenuDialog = false;
  isMenuDialogBtnLoading = false;

  //修改权限配置请求参数
  //{ menuId: "菜单Id", isConfig: "是否配置:必填(1:配置,0:不配置)" }
  modifyMenuInfo = {
    roleId: "",
    accountId: "",
    menuInfo: [],
    selectedMenu: []
  };

  //角色树列表
  roleTreeList = [];
  //当前绑定的上级角色名称
  selectedParentRoleName = "";

  //是否显示角色对话框
  isShowModifyRoleDialog = false;
  isRoleDialogBtnLoading = false;
  dialogStyle = {
    marginBottom: "100px"
  };

  modifyInfo = {
    id: "", //角色id(新增时不传值)
    name: "", //角色名
    tips: "", //备注
    accountId: "", //账户Id
    num: "", //排序号
    pName: ""
  };

  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: ""
  };

  isTableLoading = false;

  userInfo;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post("sysRole/listPage", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("sysRole/delete", null, { id: id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }

  //显示角色编辑对话框
  showModifyRoleDialog(item) {
    if (item) {
      this.modifyInfo = item;
    } else {
      this.modifyInfo = {
        id: "",
        name: "",
        tips: "",
        accountId: "",
        num: "",
        pName: ""
      }; //角色id(新增时不传值) //父角色Id //角色名 //备注 //账户Id
    }

    this.isShowModifyRoleDialog = true;
  }

  doSaveModifyRole() {
    this.modifyInfo.accountId = this.userInfo.id;
    console.log("tag", this.modifyInfo);
    if (Utils.isEmpty(this.modifyInfo.name)) {
      this.message.warning("请输入角色名称！");
      return;
    }

    if (Utils.isEmpty(this.modifyInfo.num)) {
      this.message.warning("请输入排序号");
      return;
    }

    this.isRoleDialogBtnLoading = true;
    this.httpReq.post("sysRole/saveOrUpdate", null, this.modifyInfo, data => {
      this.isRoleDialogBtnLoading = false;
      if (data["code"] == 0) {
        this.isShowModifyRoleDialog = false;
        this.message.success("保存成功");
        this.updateList();
      }
    });
  }

  //显示权限配置对话框
  showModifyMenuDialog(id, hasMenuList) {
    this.menuTreeList = [];
    //  获得角色列表
    this.httpReq.post(
      "sysRelation/listRelationAll",
      null,
      { roleId: id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          const result = JSON.parse(data["data"]);
          result.children.forEach(level1 => {
            if (Utils.isArray(level1.children)) {
              level1.children.forEach(level2 => {
                level2.icon = "";
              });
            }
          });
          this.menuTreeList.push(new NzTreeNode(result));
          this.modifyMenuInfo.selectedMenu = this.getCheckedArray(
            result.children
          );
        }
      }
    );
    this.modifyMenuInfo.roleId = id;
    this.isShowModifyMenuDialog = true;
  }
  clickListener(event) {
    event.node.setChecked(event.node.isSelected);
    this.checkedChange(event);
  }
  checkedChange(event) {
    let isCurentChecked = event.node.isChecked;
    let childrens = event.node.children;
    let parentNode = event.node.parentNode;

    //遍历子节点，同步更改子节点的选择状态
    function changeChildrenStates(arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].setChecked(isCurentChecked);
        if (arr[i].children) {
          changeChildrenStates(arr[i].children);
        }
      }
    }

    //当某个子节点被选中时，父节点也必须被选中；
    function changeParentStates(parentNode) {
      if (parentNode) {
        parentNode.setChecked(true);
        if (parentNode.parentNode) {
          changeParentStates(parentNode.parentNode);
        }
      }
    }
    if (childrens) {
      changeChildrenStates(childrens);
    }
    changeParentStates(parentNode);
  }
  /**
   *
   *  根据配置的菜单权限获取选择控件选中的内容
   * @param {*} arr
   * @returns
   * @memberof RoleManagerComponent
   */
  getCheckedArray(arr) {
    var newArr = [];
    function fun(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].status) {
          newArr.push(arr[i].key);
        }
        if (Array.isArray(arr[i].children) && arr[i].id) {
          fun(arr[i].children);
        }
      }
    }
    fun(arr);
    return newArr;
  }
  /**
   * 从选择树控件中获取到所有菜单列表，从树结构转变为单层数组结构；
   * @memberof RoleManagerComponent
   */
  treeChangeArray(arr) {
    var newArr = [];
    function fun(arr) {
      for (var i = 0; i < arr.length; i++) {
        let info = { menuId: arr[i].id, isConfig: arr[i].checked };
        newArr.push(info);
        if (Array.isArray(arr[i].children) && arr[i].id) {
          fun(arr[i].children);
        }
      }
    }
    fun(arr);
    return newArr;
  }

  doSaveModifyMenu() {
    let tempArray = this.menuTreeList[0].origin.children;
    this.modifyMenuInfo.menuInfo = this.treeChangeArray(tempArray);
    this.modifyMenuInfo.accountId = this.userInfo.id;
    this.isMenuDialogBtnLoading = true;
    this.httpReq.post(
      "sysRelation/roleMenuConf",
      null,
      this.modifyMenuInfo,
      data => {
        this.isMenuDialogBtnLoading = false;
        if (data["code"] == 0) {
          this.isShowModifyMenuDialog = false;
          this.message.success("保存成功");
          this.updateList();
        }
      }
    );
  }
}
