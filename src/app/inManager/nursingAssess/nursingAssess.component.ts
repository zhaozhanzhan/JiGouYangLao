import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { Utils } from "../../common/utils/utils";
import { GlobalService } from "../../common/service/GlobalService";
@Component({
  selector: "app-nursingAssess",
  templateUrl: "nursingAssess.component.html",
  styleUrls: ["./nursingAssess-manager.component.css"]
})
export class NursingAssessComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };
  name;

  params = {
    name: "",
    page: this.page.index - 1,
    size: this.page.size,
    btime: "",
    etime: ""
  };
  isTableLoading = false;
  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService
  ) {}
  selectedDate = [];
  ngOnInit() {
    // if (sessionStorage.getItem(this.router.url) !== undefined) {
    //   this.name = JSON.parse(sessionStorage.getItem(this.router.url));
    //   this.updateList();
    // } else {
    //   this.name = "";
    //   this.updateList();
    // }

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.params = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.params.btime) &&
        !Utils.isEmpty(this.params.etime)
      ) {
        this.selectedDate.push(new Date(this.params.btime));
        this.selectedDate.push(new Date(this.params.etime));
      }
    }

    this.updateList();
  }

  turnToAdd(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save"], { relativeTo: this.route });
  }

  turnToEdit(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["assessment", id], { relativeTo: this.route });
  }

  turnToCheck(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", id], { relativeTo: this.route });
  }

  updateList(reset: boolean = false): void {
    this.isTableLoading = true;
    if (reset) {
      this.params.page = 0;
    } else {
      //接口page从0下标位开始
      this.params.page = this.params.page - 1;
      if (this.params.page < 0) {
        this.params.page = 0;
      }
    }
    // const params = {
    //   name: this.name,
    //   page: this.page.index - 1,
    //   size: this.page.size,
    //   btime: "",
    //   etime: ""
    // };

    const that = this;

    let param = this.httpReq.post(
      "/nursingGrade/pagelist",
      null,
      that.params,
      data => {
        that.params.page++;
        that.isTableLoading = false;
        sessionStorage.setItem(that.router.url, JSON.stringify(that.params));
        if (data["status"] == 200) {
          that.list = data["data"]["content"]; // 数据列表
          that.page.total = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }

  searchList() {
    this.updateList();
  }

  resetSearch() {
    this.name = "";

    this.searchList();
  }

  turnToAddApply(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["apply"], { relativeTo: this.route });
  }
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  // 删除信息

  showDeleteConfirm(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.clickDelBtn(id);
  }

  // del(fun: Function) {
  //   this.modalService.confirm({
  //     nzTitle: "请确认是否删除？",
  //     // nzContent: '<b style="color: red;">评估记录删除后无法恢复，请谨慎操作！</b>',
  //     nzOkText: "确认",
  //     nzOkType: "danger",
  //     nzOnOk: () => fun(),
  //     nzCancelText: "取消",
  //     nzOnCancel: () => console.log("Cancel")
  //   });
  // }

  /**
   * 单击删除按钮
   * @param {any} id 要删除的数据对象ID
   */
  public clickDelBtn(id: any): void {
    this.globalService.delModal(() => {
      this.deleteData(id);
    });
  }
  deleteData(id) {
    const that = this;
    that.httpReq.post("nursingGrade/del", null, { id: id }, data => {
      if (data["code"] == 0) {
        that.createMessage("success", "删除成功");
        that.updateList();
      }
    });
  }

  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.params.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.params.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.params.btime = "";
      this.params.etime = "";
    }
  }
}
