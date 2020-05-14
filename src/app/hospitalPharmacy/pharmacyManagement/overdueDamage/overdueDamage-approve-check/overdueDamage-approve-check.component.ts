import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-overdueDamage-approve-check",
  templateUrl: "./overdueDamage-approve-check.component.html",
  styleUrls: ["./overdueDamage-approve-check.component.css"]
})
export class OverdueDamageApproveCheckComponent implements OnInit {
  isBtnLoading = false; //审批按钮
  isShowSaveGoodsDialog = false; //弹出框显示
  listDetailInfo = {
    sectionOfficeName: "",
    comment: "",
    mdOverdueDamages: [],
    operator: "",
    odDate: "",
    approve: ""
  };

  approvalUrl; //图片上传
  expiredDrugDetails = {
    drugName: "", //药品名称
    batchNum: "", //批次号
    mdBatchNum: "", //批号
    specification: "", //药品规格
    manufacturers: "", //生产厂商
    odNum: "", //过期破损数量
    reason: "", //报废原因
    odComment: "", //备注
    quantity: "", //剩余数量
    supplier: "", //供应商
    inDate: "" //入库日期
  };

  result;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}
  ngOnInit() {
    this.result = JSON.parse(this.route.snapshot.paramMap.get("data"));
    const id = this.result.id;
    let that = this;
    this.httpReq.post(
      "/md_overdue_damage/listDetail",
      null,
      { mdOverdueDamageId: id },
      data => {
        if (data["code"] == 0) {
          let result = data["data"];
          this.listDetailInfo = result;
        }
      }
    );
  }

  back() {
    history.back();
  }

  // 查看过期药品详情
  check(data) {
    this.expiredDrugDetails = data;
    this.isShowSaveGoodsDialog = true;
    this.expiredDrugDetails.drugName = data.medDrug.drugName;
    this.expiredDrugDetails.specification = data.medDrug.specification;
    this.expiredDrugDetails.manufacturers = data.medDrug.manufacturers;
    this.httpReq.post(
      "/med_drug/listByMdBatchNum",
      null,
      {
        batchNum: data.batchNum,
        medDrugsId: data.medDrug.id,
        mdBatchNum: data.mdBatchNum
      },
      data => {
        if (data["code"] == 0) {
          const result = data["data"][0];
          this.expiredDrugDetails.inDate = result.inDate;
          this.expiredDrugDetails.quantity = result.quantity;
          this.expiredDrugDetails.supplier = result.supplier;
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
}
