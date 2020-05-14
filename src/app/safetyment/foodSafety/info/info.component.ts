import { Utils } from "../../../common/utils/utils";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorage } from "../../../common/service/local.storage";

import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  upload_imgArr = [];
  food = {
    name: "", //食品名称
    timeFrame: "", //留样时段
    reservedAmount: "", //留样量
    createTime: "", //留样时间
    reservedPeople: "", //留样人
    pinTime: "", //销样时间
    pinPeople: "", //销样人
    reservedImg: "" //样品图片
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    console.log(id);
    let param = this.httpReq.post(
      "/foodRetention/findById",
      null,
      { id: id },
      data => {
        if (data["status"] == 200) {
          this.food.name = data["data"].name;
          this.food.timeFrame = data["data"].timeFrame;
          this.food.reservedAmount = data["data"].reservedAmount;
          this.food.createTime = data["data"].createTime;
          this.food.reservedPeople = data["data"].reservedPeople;
          this.food.pinTime = data["data"].pinTime;
          this.food.pinPeople = data["data"].pinPeople;
          this.upload_imgArr = data["data"].reservedImg.split(",");
          //  this.food.reservedImg=data["data"].reservedImg;
        }
      }
    );
  }

  back() {
    history.back();
  }
}
