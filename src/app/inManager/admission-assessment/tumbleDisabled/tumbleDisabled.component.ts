import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-tumbleDisabled",
  templateUrl: "./tumbleDisabled.component.html",
  // styles: [`
  //   :host /deep/ .ant-card-extra {
  //     padding: 6.5px 0;
  //   }
  // `],
  styleUrls: ["./tumbleDisabled.component.css"]
})
export class TumbleDisabledComponent implements OnInit {
  id; //老年人的ID
  resulDetails; //获得详细信息
  fallResults;
  asser;
  assDate;
  sum; //总分
  date; //日期
  signatureName; //老年人签名
  errSum;
  muscleWeakness; //下肢肌无力
  balanceCoordination; //平衡协调
  ageAndSex; //年龄和性别
  nutrition; //营养
  chronicDisease; //慢性病
  fracture; //下肢骨折
  sleep; //睡眠
  vision; //视力
  drugFactors; //药物因素
  equipment; //助行器械
  historyOfFalls; //跌倒史
  chaperonage; //陪护

  Params = {
    oldmanId: ""
  };
  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {}

  ngOnInit() {
    // this.addField();
    let tumbleId = this.route.snapshot.paramMap.get("id");
    this.Params.oldmanId = tumbleId;
    let that = this;

    this.httpReq.post(
      "assessmentFall/findByOldman",
      null,
      this.Params,
      data => {
        if (data["code"] == 0) {
          let result = data["data"];
          that.resulDetails = result.fallMemo;
          that.resulDetails = JSON.parse(that.resulDetails);
          that.fallResults = result.fallResults;
          that.muscleWeakness = that.resulDetails.muscleWeakness;
          that.balanceCoordination = that.resulDetails.balanceCoordination;
          that.ageAndSex = that.resulDetails.ageAndSex;
          that.nutrition = that.resulDetails.nutrition;
          that.chronicDisease = that.resulDetails.chronicDisease;
          that.fracture = that.resulDetails.fracture;
          that.sleep = that.resulDetails.sleep;
          that.vision = that.resulDetails.vision;
          that.drugFactors = that.resulDetails.drugFactors;
          that.equipment = that.resulDetails.equipment;
          that.historyOfFalls = that.resulDetails.historyOfFalls;
          that.chaperonage = that.resulDetails.chaperonage;
          that.signatureName = that.resulDetails.signatureName;
          that.sum = result.totalScore;
          that.date = that.resulDetails.date;

          that.asser = result.asser;
          that.assDate = result.assDate;
        }
      }
    );
  }

  back() {
    history.back();
  }

  onSubmit() {}

  log(value: string[]): void {}
}
