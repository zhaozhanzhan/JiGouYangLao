import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";

@Component({
  selector: "app-goods",
  templateUrl: "./goods.component.html",
  styleUrls: ["./goods.component.css"]
})
export class GoodsComponent implements OnInit {
  goodsClassificationNodes;
  list = [];

  goodsList = [];
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    categoryInfo: "",
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
    let that = this;
    if (sessionStorage.getItem(that.router.url) !== null) {
      that.reqObj = JSON.parse(sessionStorage.getItem(that.router.url));
      that.page.index = that.reqObj.page + 1;
      that.page.size = that.reqObj.size;
    }

    that.reqObj.categoryInfo = "";
    this.goodsClassificationNodes = [];
    this.httpReq.post("donatedGoodsCategory/listAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        result.forEach(element => {
          that.goodsClassificationNodes.push(new NzTreeNode(element));
        });
      }
    });

    this.updateList();

    this.httpReq.post("donatedGoods/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });
  }

  turnToAdd() {
    this.router.navigate(["addEdit"], {
      relativeTo: this.route
    });
  }

  turnToEdit(goods) {
    this.router.navigate(["addEdit", { goods: JSON.stringify(goods) }], {
      relativeTo: this.route
    });
  }

  turnToStock(goods) {
    this.router.navigate(["stock", { goodId: goods.id }], {
      relativeTo: this.route
    });
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;

    this.httpReq.post("donatedGoods/listCondition", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("donatedGoods/delete", null, { id: id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }
}
