import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-aTraining",
  templateUrl: "./aTraining.component.html",
  styleUrls: ["./aTraining.component.css"]
})
export class ATrainingComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10
  };

  selectedDates = [];
  storehouseList = [];
  isTableLoading = false;
  user;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    this.updateList();
  }

  checkIn(data) {
    this.router.navigate(
      ["trainingRe", { id: data.id, data: JSON.stringify(data) }],
      {
        relativeTo: this.route
      }
    );
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    this.isTableLoading = true;
    this.httpReq.get("/training/personalList", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }
}
