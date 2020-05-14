import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { until } from "protractor";
 
@Component({
  selector: "app-refundMedicine",
  templateUrl: "./refundMedicine.component.html",
  styleUrls: ["./refundMedicine.component.css"]
})
export class RefundMedicineComponent implements OnInit {
  isBtnLoading=false;//保存加载
  userInfo;//用户信息
  objInfo={
    medDrugInventoryId:"",///药品库存Id
    backNum:"",//退药数量
    backDate:"",////退药时间
    operator:"",////操作人
    backComment:"",//退药备注
    accountId:"",//账户Id
  }
  NewbackDate=new Date()
  result
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStroage: LocalStorage,
    private jsUtils: JsUtilsService
  ) {}

  ngOnInit() {

    const data = this.route.snapshot.paramMap.get("data");
    if (data) {
      this.result=JSON.parse(data)
      this.objInfo.medDrugInventoryId= this.result.id;
    }

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    this.objInfo.operator=this.userInfo.name
   
  }

  back() {
    history.back();
  }

  // 科室退药保存
  saveForm() {
    this.objInfo.accountId = this.userInfo.id;

    this.objInfo.backDate = this.jsUtils.dateFormat(
      this.NewbackDate,
      "YYYY-MM-DD HH:mm:ss"
    );
    if(this.objInfo.backNum==""){
      this.message.error("请输入退回数量");
      return;
    }

    if(this.objInfo.backDate==""){
      this.message.error("请输入退回时间");
      return;
    }

    if(this.objInfo.operator==""){
      this.message.error("请输入操作人");
      return;
    }
   
   
    this.isBtnLoading = true;
    this.httpReq.post("/back_med_drug/saveOrUpdate", null, this.objInfo, data => {
      this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        } else {
          this.message.error(data.message);
        }
    });
  }



 
}
