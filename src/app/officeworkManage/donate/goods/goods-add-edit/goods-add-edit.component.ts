import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
 
@Component({
  selector: "app-goods-add-edit",
  templateUrl: "./goods-add-edit.component.html",
  styleUrls: ["./goods-add-edit.component.css"]
})
export class GoodsAddEditComponent implements OnInit {
  formatterDollar = value => `￥ ${value}`;
  parserDollar = value => value.replace("￥ ", "");

  goodsCategoryName = "请选择物品类别";

  goodsId;

  validateForm;

  isBtnLoading = false;

  goodsClassificationNodes;
  userInfo;

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      categoryId: ["", [Validators.required]],
      name: ["", [Validators.required]],
      model: ["", []],
      unit: ["", []],
      comment: ["", []],
      shelfLife: ["", []]
    });

    const goodsStr = this.route.snapshot.paramMap.get("goods");
    if (goodsStr) {
      const goods = JSON.parse(goodsStr);
      this.goodsCategoryName = goods.donatedGoodsCategory.name;
      this.goodsId = goods.id;
      this.validateForm.patchValue(goods);
      this.validateForm.patchValue({
        categoryId: goods.donatedGoodsCategory.id
      });
    }

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.goodsClassificationNodes = [];
    this.httpReq.post("donatedGoodsCategory/listAll", null, {}, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        result.forEach(element => {
          this.goodsClassificationNodes.push(new NzTreeNode(element));
        });
      }
    });
  }

  back() {
    history.back();
  }

  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    let reqObj = this.validateForm.value;
    reqObj.accountId = this.userInfo.id;
    this.isBtnLoading = true;

    if (this.goodsId) {
      reqObj.id = this.goodsId;
    }
    this.httpReq.post("donatedGoods/saveOrEdit", null, reqObj, data => {
      this.isBtnLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        } else {
          this.message.error(data.message);
        }
      }
    });
  }
}
