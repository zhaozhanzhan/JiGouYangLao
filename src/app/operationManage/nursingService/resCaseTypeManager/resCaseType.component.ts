import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-resCaseType",
  templateUrl: "resCaseType.component.html"
})
export class ResCaseTypeComponent implements OnInit {
  isEditDialogShow = false;
  isSaveLoading = false;
  saveParams = { id: "", categoryName: "" };
  list;

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

  updateList(): void {
    this.isTableLoading = true;
    this.httpReq.get("resCaseBaseCustom/allList", {}, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"];
      }
    });
  }

  delResCaseBase(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("resCaseBaseCustom/del", null, { id: id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }

  doShowAddDialog(id, name) {
    this.saveParams.id = id;
    this.saveParams.categoryName = name;
    this.isEditDialogShow = true;
  }

  doDialogSave() {
    let that = this;
    this.isSaveLoading = true;
    this.httpReq.post(
      "resCaseBaseCustom/saveOrUpdate",
      null,
      this.saveParams,
      data => {
        that.isSaveLoading = false;
        if (data["code"] == 0) {
          that.isEditDialogShow = false;
          this.message.success("保存成功！");
          that.updateList();
        }
      }
    );
  }
}
