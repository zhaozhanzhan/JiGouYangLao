import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.css"]
})
export class CheckComponent implements OnInit {
  interview;
  userInfo;

  tabIndex = 0;
  dateFormat = "yyyy-MM-dd";

  listOfDrugs = [];
  isLoading = false;

  listOfUsages = [
    { label: "口服", value: "1" },
    { label: "肌注", value: "2" },
    { label: "静脉注射/点滴", value: "3" },
    { label: "舌下", value: "4" },
    { label: "肛门给药", value: "5" },
    { label: "皮下注射", value: "6" },
    { label: "外用", value: "7" },
    { label: "吸入", value: "8" }
  ];

  listOfFrequency = [
    { label: "prn(需要时使用)", value: "prn(需要时使用)" },
    { label: "qh 每小时1次", value: "qh 每小时1次" },
    { label: "q2h 每小时2次", value: "q2h 每小时2次" },
    { label: "qd 每日1次", value: "qd 每日1次" },
    { label: "bid 每日2次", value: "bid 每日2次" },
    { label: "tid 每次3次", value: "tid 每次3次" },
    { label: "qcd 每2日1次", value: "qcd 每2日1次" },
    { label: "qw 每周1次", value: "qw 每周1次" }
  ];

  constructor(
    private httpService: HttpReqService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    this.interview = {};
    this.interview.InterviewEconomicProvider = {};
    this.interview.InterviewContacts = [];
    this.interview.InterviewHealthHistory = {};
    this.interview.InterviewDrugUse = {};
    this.interview.InterviewDrugUse.drugMemo = [
      { label: "青霉素类", value: "青霉素类", checked: false },
      { label: "庆大霉素类", value: "庆大霉素类", checked: false },
      { label: "磺胺类", value: "磺胺类", checked: false },
      { label: "其他（注明）", value: "其他", checked: false }
    ];
    this.interview.InterviewDrugUse.InterviewDrugRecord = [];
    this.userInfo = this.localStroage.getUser();

    let interviewId = this.route.snapshot.paramMap.get("id");

    if (interviewId) {
      let that = this;
      this.httpService.post(
        "interview/findById",
        null,
        { id: interviewId },
        data => {
          if (data["code"] == 0) {
            that.interview = JSON.parse(data);
            if (!that.interview.InterviewDrugUse.drugMemo) {
              that.interview.InterviewDrugUse.drugMemo = [
                { label: "青霉素类", value: "青霉素类", checked: false },
                {
                  label: "庆大霉素类",
                  value: "庆大霉素类",
                  checked: false
                },
                { label: "磺胺类", value: "磺胺类", checked: false },
                { label: "其他（注明）", value: "其他", checked: false }
              ];
            } else {
              that.interview.InterviewDrugUse.drugMemo = JSON.parse(
                that.interview.InterviewDrugUse.drugMemo
              );
            }
            that.interview.InterviewDrugUse.InterviewDrugRecord.forEach(e => {
              e.usages = JSON.parse(e.usages);
              e.frequency = JSON.parse(e.frequency);
            });
          }
        }
      );
    }
  }

  onSelectedIndexChange(selectIndex: number) {}

  back() {
    history.back();
  }
}
