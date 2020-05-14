import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-resCaseBase",
  templateUrl: "resCaseBase.component.html"
})
export class ResCaseBaseComponent implements OnInit {
  list;

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10
  };

  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.updateList();
  }

  turnToAdd() {
    this.router.navigate(["info"], { relativeTo: this.route });
  }

  turnToEdit(resCaseBase) {
    this.router.navigate(
      ["info", { resCaseBase: JSON.stringify(resCaseBase) }],
      { relativeTo: this.route }
    );
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    this.isTableLoading = true;
    this.httpReq.post("resCaseBase/pagelist", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  delResCaseBase(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("resCaseBase/del", null, { id: id }, data => {
        if (data["status"] == 200) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }
}
