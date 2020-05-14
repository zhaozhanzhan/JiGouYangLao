import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { FormBuilder } from "@angular/forms";
import { NzMessageService, NzTreeNode, NzModalService } from "ng-zorro-antd";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { Utils } from "../../common/utils/utils";
import { LocalStorage } from "../../common/service/local.storage";
// import { ConfigInfoComponent } from "./configInfo/configInfo.component";
@Component({
  selector: "app-personnelFileManage",
  templateUrl: "personnelFileManage.component.html",
  styleUrls: ["./personnelFileManage.component.css"]
})
export class PersonnelFileManageComponent implements OnInit {
  goodsClassificationNodes;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    departmentId: "",
    status: "",
    btime: "",
    etime: "",
    personType: ""
  };
  list = [];
  isVisible = false;
  selectedDate = [];
  isTableLoading = false;
  reqObjGoodName = "请选择部门";
  departmentId;
  profileLeaveObj = {
    employeeId: "",
    accountId: "",
    leaveDate: "",
    status: ""
  };
  user;
  disable = false;
  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private fb: FormBuilder, // 响应式表单
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService,
    private localStorage: LocalStorage,
    private modalService: NzModalService //提示
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.departmentId = this.reqObj.departmentId;
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.btime));
        this.selectedDate.push(new Date(this.reqObj.etime));
      }
    }

    // 获得所有的部门信息
    this.goodsClassificationNodes = [];
    this.httpReq.post("/department/listTreeAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        result.forEach(element => {
          this.goodsClassificationNodes.push(new NzTreeNode(element));
          this.getReqObjGoodName(
            this.goodsClassificationNodes,
            this.departmentId
          );
        });
      }
    });
    this.updateList();
  }

  // 递归循环树形结构获得所属部门
  getReqObjGoodName(arr, departmentID: string) {
    if (arr.length > 0) {
      arr.forEach(e => {
        if (e.key == departmentID) {
          this.reqObjGoodName = e.title;
          return;
        } else {
          this.getReqObjGoodName(e.children, departmentID);
        }
      });
    }
  }

  // 跳转到添加页面
  turnToAdd(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save"], { relativeTo: this.route });
  }

  // 跳转到修改页面
  turnToModifier(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }

  // 删除
  delete(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.user = this.localStorage.getUser();
    let accId = this.user.data.id;
    this.modalService.confirm({
      nzTitle: `确定是否删除？`,
      nzOnOk: () => {
        this.httpReq.post(
          "employees/profileDelete",
          null,
          { employeeId: id, accountId: accId },
          (data: any) => {
            if (data["code"] == 0) {
              this.message.success("删除成功！");
              this.updateList();
            }
          }
        );
      }
    });
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.post("/employees/listCondition", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          const result = JSON.parse(data["data"]);
          this.list = result.memo;
          this.page.total = result["totalElements"];
        }
      }
    });
  }

  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]);
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]);
    } else {
      this.reqObj.btime = "";
      this.reqObj.etime = "";
    }
  }
  status;
  stString;
  modifierStatus(st, id, leaveDate, status, e) {
    this.stString = st;
    this.profileLeaveObj = {
      employeeId: "",
      accountId: "",
      leaveDate: "",
      status: ""
    };
    if (e) {
      e.preventDefault();
    }
    if (leaveDate != "") {
      this.profileLeaveObj.leaveDate = leaveDate;
    }
    if (st == "1") {
      this.disable = false;
      this.profileLeaveObj.status = "1";
    } else {
      this.disable = true;
      this.profileLeaveObj.status = "0";
    }
    this.profileLeaveObj.employeeId = id;
    // this.profileLeaveObj.status=status;
    this.status = status;
    this.user = this.localStorage.getUser();
    this.profileLeaveObj.accountId = this.user.data.id;
    this.isVisible = true;
  }

  handleOk(): void {
    if (
      this.profileLeaveObj.leaveDate == "" ||
      this.profileLeaveObj.status == ""
    ) {
      this.message.error("工作状态或离职时间不能为空");
      return;
    }
    this.profileLeaveObj.leaveDate = this.jsUtil.dateFormat(
      this.profileLeaveObj.leaveDate
    );
    this.httpReq.post(
      "/employees/profileLeave",
      null,
      this.profileLeaveObj,
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            this.updateList();
            this.isVisible = false;
          } else {
            this.message.error(data["message"]);
          }
        }
      }
    );
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // 跳转到查看页面
  turnToCheck(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }
}
