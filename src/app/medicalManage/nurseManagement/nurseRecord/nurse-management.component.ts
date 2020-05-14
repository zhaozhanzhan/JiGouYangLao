import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";

@Component({
  selector: "app-nurse-management",
  templateUrl: "./nurse-management.component.html",
  styleUrls: ["./nurse-management.component.css"]
})
export class NurseManagementComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    phone: "",
    nurseTeams: "",
    status: "0",
    btime: "",
    etime: "",
    personType: "2"
  };
  isTableLoading = true;
  selectedDate = [];
  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.btime));
        this.selectedDate.push(new Date(this.reqObj.etime));
      }
    }

    this.updateList();
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    const that = this;
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    const baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    const url = baseUrl + "nurseTeam/nurseList";
    fetch(url, { method: "post", body: JSON.stringify(that.reqObj) })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        that.isTableLoading = false;
        if (res.code == 0) {
          this.list = res.data.list;
          this.page.total = res["data"]["totalElements"];
        } else {
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  turnToAdd() {
    this.router.navigate(["add"], { relativeTo: this.route });
  }

  turnToEdit(employee, e) {
    if (e) {
      e.preventDefault();
    }

    this.router.navigate(["add", { data: JSON.stringify(employee) }], {
      relativeTo: this.route
    });
  }

  turnToLinkGroup(employee) {
    this.router.navigate(["linkGroup", JSON.stringify(employee)], {
      relativeTo: this.route
    });
  }

  deLinkGroup(id) {
    this.modalService.confirm({
      nzTitle: "请确认是否从该班组移除？",
      nzContent: "",
      nzOkText: "确定",
      nzOkType: "danger",
      nzOnOk: () => {
        this.httpReq.post("nurseTeam/teamRemove", null, { id: id }, data => {
          this.isTableLoading = false;
          if (data["status"] == 200) {
            this.message.success("移除成功！");
            this.updateList();
          }
        });
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
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
}
