import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-storehouse",
  templateUrl: "./storehouse.component.html",
  styleUrls: ["./storehouse.component.css"]
})
export class StorehouseComponent implements OnInit {
  storehouseClassificationList;
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    name: "",
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
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
    }

  

    this.updateList();
  }

  turnToAdd() {
    this.router.navigate(["addEdit", { state: "add" }], {
      relativeTo: this.route
    });
  }

  turnToEdit(storehouse) {
    this.router.navigate(
      ["addEdit", { storehouse: JSON.stringify(storehouse), state: "edit" }],
      { relativeTo: this.route }
    );
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;

    this.httpReq.post("donatedWarehouse/listCondition", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];

        let accountNamesList = [];
        let accountIds = [];
        this.list.forEach(element => {
          accountNamesList = [];
          accountIds = [];
          element.accounts.forEach(e => {
            if (e) {
              accountNamesList.push(e.name);
              accountIds.push(e.id);
            }
            
          });
          element.accountNames = accountNamesList.join("，");
          
          
          element.accountIds = accountIds;
        });
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("donatedWarehouse/delete", null, { id: id }, data => {
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
}
