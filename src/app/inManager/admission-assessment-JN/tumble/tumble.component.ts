import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-tumble",
  templateUrl: "./tumble.component.html",
  // styles: [`
  //   :host /deep/ .ant-card-extra {
  //     padding: 6.5px 0;
  //   }
  // `],
  styleUrls: ["./tumble.component.css"]
})
export class TumbleComponent implements OnInit {
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
  fallResults;
  asser;
  assDate;
  Params = {
    oldman_id: "",
    noteTaker: "",
    fallResults: "",
    asser: "",
    assDate: "",
    fallMemo: {
      muscleWeakness: "",
      balanceCoordination: "",
      ageAndSex: "",
      nutrition: "",
      chronicDisease: "",
      fracture: "",
      sleep: "",
      vision: "",
      drugFactors: "",
      equipment: "",
      historyOfFalls: "",
      chaperonage: "",
      signatureName: "",
      date: "",
      sum: ""
    },
    totalScore: ""
  };
  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    // this.addField();
    let interviewId = this.route.snapshot.paramMap.get("id");
    this.Params.oldman_id = interviewId;
  }

  back() {
    history.back();
  }

  onSubmit() {}

  log(value: string[]): void {}
  //计算总分数
  addCount() {
    this.errSum =
      parseInt(this.muscleWeakness) +
      parseInt(this.balanceCoordination) +
      parseInt(this.ageAndSex) +
      parseInt(this.nutrition) +
      parseInt(this.chronicDisease) +
      parseInt(this.fracture) +
      parseInt(this.sleep) +
      parseInt(this.vision) +
      parseInt(this.drugFactors) +
      parseInt(this.equipment) +
      parseInt(this.historyOfFalls) +
      parseInt(this.chaperonage);
    if (!isNaN(this.errSum)) {
      this.sum = this.errSum;
      if (this.sum <= 17) {
        this.fallResults = "极度危险";
      } else if (this.sum >= 23 && this.sum <= 24) {
        this.fallResults = "轻度危险";
      } else if (this.sum > 20 && this.sum <= 22) {
        this.fallResults = "中度危险";
      } else if (this.sum > 17 && this.sum <= 20) {
        this.fallResults = "高度危险";
      } else {
        this.fallResults = "暂无危险";
      }
    }
  }

  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  isLoadingOne = false;

  loadOne(): void {
    this.isLoadingOne = true;
    setTimeout(_ => {
      this.isLoadingOne = false;
    }, 5000);
  }
  showDeleteConfirm(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.del(() => {
      this.save();
    });
  }
  del(fun: Function) {
    this.modalService.confirm({
      nzTitle: "确认保存",
      nzContent: "入院评估内容保存成功后，可以到评估管理功能中修改。",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => fun(),
      nzCancelText: "取消",
      nzOnCancel: () => console.log("Cancel")
    });
  }
  //保存

  save() {
    if (
      this.sum == undefined ||
      this.asser == undefined ||
      this.assDate == undefined
    ) {
      this.createMessage("error", "请填写完整信息");
    } else {
      this.Params.noteTaker = this.signatureName;
      this.Params.fallResults = this.fallResults;
      this.Params.totalScore = this.sum;
      this.Params.asser = this.asser;
      // this.Params.assDate=this.assDate;
      this.Params.assDate = this.jsUtil.dateFormat(this.assDate);

      this.Params.fallMemo.muscleWeakness = this.muscleWeakness;
      this.Params.fallMemo.balanceCoordination = this.balanceCoordination;
      this.Params.fallMemo.ageAndSex = this.ageAndSex;
      this.Params.fallMemo.nutrition = this.nutrition;
      this.Params.fallMemo.chronicDisease = this.chronicDisease;
      this.Params.fallMemo.fracture = this.fracture;
      this.Params.fallMemo.sleep = this.sleep;
      this.Params.fallMemo.vision = this.vision;
      this.Params.fallMemo.drugFactors = this.drugFactors;
      this.Params.fallMemo.equipment = this.equipment;
      this.Params.fallMemo.historyOfFalls = this.historyOfFalls;
      this.Params.fallMemo.chaperonage = this.chaperonage;
      this.Params.fallMemo.signatureName = this.signatureName;
      this.Params.fallMemo.date = this.jsUtil.dateFormat(this.date);
      this.Params.fallMemo.sum = this.sum;
      let that = this;
      this.loadOne();

      let param = this.httpReq.post(
        "/assessmentFall/save",
        null,
        this.Params,
        data => {
          if (data["status"] == 200) {
            that.createMessage("success", "保存成功");
            history.back();
          } else {
            that.createMessage("error", "保存失败");
          }
        }
      );

      // this.httpService.doPostHttp(
      //   '/assessmentFall/save',
      //   this.Params,
      //   function(successful, result, res) {
      //     that.createMessage('success','保存成功');
      //     history.back();
      //   },
      //   function(successful, msg, err) {
      //     that.createMessage('error','保存失败');
      //   }
      // );
    }
  }
}
