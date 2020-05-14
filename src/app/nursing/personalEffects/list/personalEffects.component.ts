import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";

@Component({
  selector: "app-personalEffects",
  templateUrl: "personalEffects.component.html"
})
export class PersonalEffectsComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    oldman: "",
    name: ""
  };

  loading = true;

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    this.updateList();

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }
  }

  turnToCheck(personalEffects, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    console.log(personalEffects);
    window.open(personalEffects.url);
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.loading = true;
    this.httpReq.post("property/list", null, this.reqObj, data => {
      console.log(data);
      this.loading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"]; // 数据列表
        this.page.total = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  searchList() {
    this.updateList();
  }
}
