import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  baseUrl;
  list;
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

  isTableLoading = true;
  user;
  accountId;
  // 绑定部门
  officeModel = false;
  officeModelData: any;
  allOffice = [];
  selOffice = [];
  //分配主管、医生
  groupModel = false;
  groupModelData: any;
  kind;
  allGroup = [];
  selGroup = [];
  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage //存储
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    this.accountId = this.user.data.id;

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
    this.httpReq.post("section_office/listPage", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["list"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post(
        "section_office/delete",
        null,
        { id: id, accountId: this.accountId },
        data => {
          if (data["code"] == 0) {
            this.message.success("删除成功！");
            this.updateList();
          }
        }
      );
    });
  }

  // 跳转到添加页面
  addAdministrative() {
    this.router.navigate(["addEdit"], { relativeTo: this.route });
  }
  // 跳转到修改页面
  editAdministrative(data, e) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["addEdit", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }

  // 绑定部门弹框
  showOfficeModel(data) {
    this.officeModelData = data;
    this.selOffice = [];
    const url = this.baseUrl + "department/listAll";
    fetch(url, { method: "post", body: null })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        if (res.code == 0) {
          this.allOffice = res.data;
          if (this.officeModelData.departmentName) {
            this.selOffice = this.allOffice.filter(item => {
              return item.name == this.officeModelData.departmentName;
            })[0].id;
          }
        } else {
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.officeModel = true;
  }
  officeModelCancel() {
    this.officeModel = false;
  }
  officeModelOk() {
    const sendData = {
      id: this.officeModelData.id,
      departmentId: this.selOffice
    };
    this.httpReq.post(
      "section_office/bindingDepartment",
      null,
      sendData,
      data => {
        if (data["code"] == 0) {
          this.message.success("绑定部门成功");
          this.updateList();
        }
      }
    );
    this.officeModel = false;
  }

  // 分配主管、医生
  showGroupModel(data, kind) {
    if (kind !== 1 && kind !== 2) {
      console.log("No such url can be connected, Please check Function params");
      return;
    }
    this.selGroup = [];
    this.groupModelData = data;
    this.kind = kind;
    const kind1URL = this.baseUrl + "doctorNew/listAll"; // 分配主管
    const kind2URL = this.baseUrl + "/doctorNew/listAllNoBingding"; // 分配医生
    let url;
    if (this.kind == 1) url = kind1URL;
    else if (this.kind == 2) url = kind2URL;
    fetch(url, { method: "post", body: null })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        if (res.code == 0) {
          this.allGroup = res.data;
          this.allGroup.forEach(item => {
            if (item.isRemove == 1) item["isTrans"] = false;
            else if (item.isRemove == 0) item["isTrans"] = true;
          });
          if (this.kind == 1) {
            if (this.groupModelData.governorNameStr) {
              let doctorNames = this.groupModelData.governorNameStr.split(",");
              for (let i = 0, j = doctorNames.length; i < j; i++) {
                let doctorname = this.allGroup.filter(item => {
                  return item.name == doctorNames[i];
                })[0].id;
                this.selGroup.push(doctorname);
              }
              console.log(this.selGroup);
            }
          } else if (this.kind == 2) {
            if (this.groupModelData.doctorIdStr) {
              this.selGroup = this.groupModelData.doctorIdStr.split(",");
              this.selGroup.forEach(element => {
                this.allGroup.forEach(item => {
                  if (item.id == element && item.isRemove == 1)
                    item["isTrans"] = true;
                });
              });
              console.log(this.allGroup);
              // console.log(this.groupModelData.doctorIdStr);
            }
          }
        } else {
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.groupModel = true;
  }
  groupModelCancel() {
    this.groupModel = false;
  }
  groupModelOk() {
    const sendData = {
      id: this.groupModelData.id,
      doctorIds: this.selGroup.join(",")
    };
    const kind1URL = "section_office/allocationGovernor"; // 分配主管
    const kind2URL = "section_office/allocationDoctor"; // 分配医生
    let url;
    if (this.kind == 1) url = kind1URL;
    else if (this.kind == 2) url = kind2URL;
    this.httpReq.post(url, null, sendData, data => {
      if (data["code"] == 0) {
        let name = this.kind == 1 ? "主管" : "医生";
        this.message.success("分配" + name + "成功");
        this.updateList();
      }
    });
    this.groupModel = false;
  }
  // 分配医生是否可选
  changeDoctorSel() {
    let noSelEl = document.getElementsByClassName("prohibitSel"),
      noSelElLength = noSelEl.length;
    for (let i = 0; i < noSelElLength; i++) {
      noSelEl[i].addEventListener("click", function(e) {
        e.stopPropagation();
      });
    }
  }
}
