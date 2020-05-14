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
  reqObjGoodName="请选择物品类别";
  categoryInfo=""
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
      this.categoryInfo=JSON.parse(sessionStorage.getItem(that.router.url)).categoryInfo;
      console.log("JSON.parse(sessionStorage.getItem(that.router.url)).categoryInfo"+JSON.parse(sessionStorage.getItem(that.router.url)).categoryInfo)
      that.page.index = that.reqObj.page + 1;
      that.page.size = that.reqObj.size;
    }

  

    this.goodsClassificationNodes = [];
    this.httpReq.post("goodsCategory/listAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        console.log("categoryInfo"+this.categoryInfo)
        this.reqObj.categoryInfo=this.categoryInfo
        result.forEach(element => {
          that.goodsClassificationNodes.push(new NzTreeNode(element));
        });
        if(this.categoryInfo=="" || this.categoryInfo==null){
          this.reqObjGoodName="请选择物品类别"
        }else{
          this.getReqObjGoodName(this.goodsClassificationNodes,this.categoryInfo);
        } 
      }
    });

    this.updateList();

    this.httpReq.post("goods/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });
  }
  // 递归循环树形结构获得所属部门
  getReqObjGoodName(arr , departmentID:string){
    if(arr.length>0){
      arr.forEach(e => {
        if(e.key==departmentID){
          this.reqObjGoodName = e.title;
          return;
        }else{
          this.getReqObjGoodName(e.children,departmentID);
        }
      });
    }

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
    if(this.reqObj.categoryInfo=="" || this.reqObj.categoryInfo==null){
      this.reqObjGoodName="请选择物品类别"
    }
    
  
    this.httpReq.post("goods/listCondition", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("goods/delete", null, { id: id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }
}
