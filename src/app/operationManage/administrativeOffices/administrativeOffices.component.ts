import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../common/service/local.storage";

@Component({
  selector: "app-administrativeOffices",
  templateUrl: "administrativeOffices.component.html",
  styleUrls: ["./administrativeOffices.component.css"]
})
export class AdministrativeOfficesComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
  };

  isTableLoading = false;
  user;
  accountId
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage,//存储
  ) {}



  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.accountId=this.user.data.id

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
    this.httpReq.post("/section_office/listPage", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("/section_office/delete", null, { id: id,accountId: this.accountId}, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }

  // 跳转到添加页面
  addAdministrative(){

    this.router.navigate(["addEdit"], { relativeTo: this.route });
  }
// 跳转到修改页面
  editAdministrative(data,e){
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["addEdit",{data:JSON.stringify(data)}], { relativeTo: this.route });
  }
  // 跳转到添加页面
  toCheck(data,e){
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check",{data:JSON.stringify(data)}], { relativeTo: this.route });
  }
}