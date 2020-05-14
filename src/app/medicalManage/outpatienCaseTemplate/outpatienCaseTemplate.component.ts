import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
@Component({
  selector: "app-outpatienCaseTemplate",
  templateUrl: "./outpatienCaseTemplate.component.html",
  styleUrls: ["./outpatienCaseTemplate.component.css"]
})
export class OutpatienCaseTemplateComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    /**  请求参数
     * {"page":"页面",
     * "size":"每页数量",
     * "templateName": "模板名称",
     * "templateType": "模板类型"
     */
    page: 1,
    size: 10,
    templateName: "",
    templateType: "",
  };
  list = [];
  isTableLoading = false;

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
    }

    this.updateList();
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
    this.httpReq.get(
      "clinic/listAll",
      this.reqObj,
      data => {
        this.isTableLoading = false;
        if (data["status"] == 200) {
          this.list = data["data"]["content"];
          this.page.total = data["data"]["totalElements"];
        }
      }
    );
  }
  // 禁用
  forbidden(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.httpReq.post("dictMgt/startoff", null, { id: id }, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.message.success("禁用成功！");
          this.updateList();
        } else {
          this.message.error(data.message);
        }
      }
    });
  }

  // 删除
  delete(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.globalService.delModal(() => {
      this.httpReq.post("dictMgt/del", null, { id: id }, data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("删除成功！");
            this.updateList();
          } else {
            this.message.error(data.message);
          }
        }
      });
    });
  }

  // 跳转到保存和修改页面
  turnToAdd(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (data == "") {
      this.router.navigate(["addDigitalDictionary"], {
        relativeTo: this.route
      });
    } else {
      this.router.navigate(
        ["addDigitalDictionary", { info: JSON.stringify(data) }],
        { relativeTo: this.route }
      );
    }
  }

  // 跳转到添加模板数据
  turnToEdit(id, templateType, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    // console.log(id);
    this.router.navigate(["dictionaryData", { id: id, templateType: templateType }], {
      relativeTo: this.route
    });
  }
}
