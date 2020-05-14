import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../../common/service/local.storage";
@Component({
  selector: "app-overdueDamage-approve",
  templateUrl: "./overdueDamage-approve.component.html",
  styleUrls: ["./overdueDamage-approve.component.css"]
})
export class OverdueDamageApproveComponent implements OnInit {
  isBtnLoading = false; //审批按钮
  isShowSaveGoodsDialog = false; //弹出框显示
  listDetailInfo = {
    sectionOfficeName: "",
    comment: "",
    mdOverdueDamages: [],
    operator: "",
    odDate: ""
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
  // 审批参数
  objApproval = {
    mdOverdueDamageId: "", //过期破损列表id
    approvalUrl: "", //审批人签名
    approve: "" //审批人
  };
  user;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage //存储
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.objApproval.mdOverdueDamageId = id;
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

    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.objApproval.approve = this.user.data.name;
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

  saveForm(approvalUrl) {
    if (this.objApproval.approve == "") {
      this.message.error("请填写审批人");
      return;
    }
    this.objApproval.approvalUrl = approvalUrl;
    this.isBtnLoading = true;
    this.httpReq.post(
      "/md_overdue_damage/approve",
      null,
      this.objApproval,
      data => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.message.success("审批成功");
          this.back();
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
}
