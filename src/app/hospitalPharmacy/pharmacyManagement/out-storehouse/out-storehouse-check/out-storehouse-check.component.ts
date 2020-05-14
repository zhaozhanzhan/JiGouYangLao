import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
@Component({
  selector: "app-out-storehouse-check",
  templateUrl: "./out-storehouse-check.component.html",
  styleUrls: ["./out-storehouse-check.component.css"]
})
export class OutStorehouseCheckComponent implements OnInit {
  outDrug = {
    allocatingPharmacy: "", //调拨药房
    allocatingPharmacyid: "", //调拨药房Id
    receiver: "", //领用人员
    receiverName: "", //领用人员名字
    recorder: "", //操作人
    recDate: "", //领用时间
    outComment: "", //备注
    outMedDrugs: [],
    receiverUrl: "", //领用人
    operatorUrl: "", //经办人

    sectionOfficeOutId: "" //科室ID
  };
  receiverList = []; //领用人员数组
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");
    // 获得详情
    this.httpReq.post(
      "/out_med_drug/listDetail",
      null,
      { outMedDrugId: id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          const result = data["data"];
          this.outDrug = result;
          this.outDrug.allocatingPharmacy = result.sectionOfficeOut.name;
          this.outDrug.allocatingPharmacyid = result.sectionOfficeOut.id;
          this.outDrug.sectionOfficeOutId = result.sectionOfficeOut.id;
          // 获得领用人员
          this.httpReq.post(
            "/out_med_drug/listReceiverBySo",
            null,
            { sectionOfficeRecId: this.outDrug.allocatingPharmacyid },
            data => {
              if (data["code"] == 0) {
                this.receiverList = data["data"];
                this.receiverList.forEach(element => {
                  if (element.id == this.outDrug.receiver) {
                    this.outDrug.receiverName = element.name;
                  }
                });
              } else {
                this.message.error(data.message);
              }
            }
          );
        }
      }
    );
  }
  back() {
    history.back();
  }
}
