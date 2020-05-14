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
  selector: "app-createAssess",
  templateUrl: "createAssess.component.html",
  styleUrls: ["./createAssess-manager.component.css"]
})
export class CreateAssessComponent implements OnInit {
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
    beginTime: "",
    endTime: ""
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
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.params = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.params.beginTime) &&
        !Utils.isEmpty(this.params.endTime)
      ) {
        this.selectedDate.push(new Date(this.params.beginTime));
        this.selectedDate.push(new Date(this.params.endTime));
      }
    }

    this.updateList();
  }

  //  添加页面
  turnToAddApply(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["apply"], { relativeTo: this.route });
  }
  // 编辑页面
  turnToEdit(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["apply", { info: JSON.stringify(data) }], {
      relativeTo: this.route
    });
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

    const that = this;

    let param = this.httpReq.post(
      "/careAssessment/pagelist",
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
    this.httpReq.post("careAssessment/del", null, { id: id }, data => {
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
      this.params.beginTime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.params.endTime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.params.beginTime = "";
      this.params.endTime = "";
    }
  }
}
