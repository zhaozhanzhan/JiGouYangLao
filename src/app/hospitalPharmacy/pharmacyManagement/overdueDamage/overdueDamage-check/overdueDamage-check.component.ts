import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService} from "ng-zorro-antd";

@Component({
  selector: "app-overdueDamage-check",
  templateUrl: "./overdueDamage-check.component.html",
  styleUrls: ["./overdueDamage-check.component.css"]
})
export class OverdueDamageCheckComponent implements OnInit {
  isLoading = false;
  isShowSaveGoodsDialog=false;
  listDetailInfo = {
    operator: "",
    odDate:"",
    comment: "",
    mdOverdueDamages: [],
  };

  expiredDrugDetails={
    drugName:"",//药品名称
    batchNum:"",//批次号
    mdBatchNum:"",//批号
    specification:"",//药品规格
    manufacturers:"",//生产厂商
    odNum:"",//过期破损数量
    reason:"",//报废原因
    odComment:"",//备注
    quantity:"",//剩余数量
    supplier:"",//供应商
    inDate:"",//入库日期

  }
  constructor(
    private route: ActivatedRoute, 
    private httpReq: HttpReqService,
    private message: NzMessageService,
    ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    let that = this;
    this.isLoading = true;
    this.httpReq.post(
      "/md_overdue_damage/listDetail",
      null,
      { mdOverdueDamageId: id },
      data => {
        that.isLoading = false;
        if (data["code"] == 0) {
          let result = data["data"];
          this.listDetailInfo=result
          // this.listDetailInfo.operator=result.operator;
          // this.listDetailInfo.comment=result.comment

        }
      }
    );
  }

  back() {
    history.back();
  }

  check(data){
    this.expiredDrugDetails=data;
    this.isShowSaveGoodsDialog=true;
    // expiredDrugDetails={
    //   drugName:"",//药品名称
    //   batchNum:"",//批次号
    //   specification:"",//药品规格
    //   manufacturers:"",//生产厂商
    //   odNum:"",//过期破损数量
    //   reason:"",//报废原因
    //   odComment:"",//备注
    //   quantity:"",//剩余数量
    //   supplier:"",//供应商
    //   inDate:"",//入库日期
  
    // }

    this.expiredDrugDetails.drugName=data.medDrug.drugName
    this.expiredDrugDetails.batchNum=data.batchNum
    this.expiredDrugDetails.specification=data.medDrug.specification
    this.expiredDrugDetails.manufacturers=data.medDrug.manufacturers
    this.expiredDrugDetails.mdBatchNum=data.mdBatchNum
    this.expiredDrugDetails.odNum=data.odNum
    this.expiredDrugDetails.reason=data.reason
    this.expiredDrugDetails.odComment=data.odComment
    this.httpReq.post("/med_drug/listByMdBatchNum", null, {batchNum: data.batchNum,medDrugsId:data.medDrug.id,mdBatchNum: data.mdBatchNum}, data => {
      if (data["code"] == 0) {
        const result=data["data"][0];
        this.expiredDrugDetails.inDate=result.inDate
        this.expiredDrugDetails.quantity=result.quantity
        this.expiredDrugDetails.supplier=result.supplier
      } else {
        this.message.error(data.message);
      }
    });

  }
}
