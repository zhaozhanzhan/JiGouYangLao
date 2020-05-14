import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { JsUtilsService } from "src/app/common/service/JsUtils.Service";
import { GlobalMethod } from "src/app/common/service/GlobalMethod";
import { AgeCountPipe } from "src/app/common/pipe/age_pipe";

@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.css"]
})
export class CheckComponent implements OnInit {
  isPersonCardLoading = false; // 个人信息加载状态
  interview;
  userInfo;

  tabIndex = 0;
  dateFormat = "yyyy-MM-dd";

  listOfDrugs = [];
  isLoading = false;
  registration;

  public healthForm: FormGroup; // 定义健康情况表单对象
  public user; // 用户登录信息

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

  drugMemoDefault = [
    { label: "青霉素类", value: "青霉素类", checked: false },
    { label: "庆大霉素类", value: "庆大霉素类", checked: false },
    { label: "磺胺类", value: "磺胺类", checked: false },
    { label: "其他（注明）", value: "其他", checked: false }
  ]; // 身体状况

  constructor(
    private httpService: HttpReqService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private localStroage: LocalStorage,
    private fb: FormBuilder,
    private jsUtil: JsUtilsService,
    private router: Router
  ) {
    this.user = this.localStroage.getUser();
    this.healthForm = this.fb.group({
      oldmanId: [""], // 调防表id
      fillDate: [""], // 填表日期
      inHosDate: [""], // 入院时间
      roomNum: [""], // 房间号
      name: [""], // 姓名
      sex: [""], // 性别
      age: [""], // 年龄
      birthYearMonth: [""], // 出生日期
      phone: [""], // 联系电话
      address: [""], // 家庭住址
      checkInMode: [""], // 入住方式1.步行2.助行3.轮椅4.平车
      historyOfPast: [""], // 既往史
      historyOfNow: [""], // 现病史
      diet: [""], // 饮食1.普2.半3.流4.特饮
      relieve: [""], // 大小便
      temperature: [""], // 体温
      pulse: [""], // 脉搏
      breathing: [""], // 呼吸
      bloodPressure: [""], // 血压
      eyeAndVision: [""], // 眼及视力
      earAndListen: [""], // 耳及听力
      mouth: [""], // 口腔
      noise: [""], // 鼻部
      heart: [""], // 心
      liverSpleen: [""], // 肝脾
      lung: [""], // 肺
      limbsAndPelvis: [""], // 四肢及骨盆
      phyCpndition: [""], // 身体状况1.自理2.半自理3.半丧失生活能力4.完全丧失生活能力
      pain: [""], // 皮肤
      consciousness: [""], // 思维意识
      languageExpress: [""], // 语言表达能力
      mentalState: [""], // 精神状况
      sleep: [""], // 睡眠
      hasPsyDrugsLastWeek: [""], // 在过去7天内是否使用精神药物（镇静剂、安眠药等）
      isAllergic: [""], // 是否对某些药物过敏 1.青霉素类2.庆大霉素类3.磺胺类4其他（注明）
      otherAllergicDrug: [""], // 其他过敏药物
      takingMeds: this.fb.array([]), // 正在使用的药物
      healthComment: [""], // 备注
      accountId: [""] // 登录账户id
    });

    GlobalMethod.setForm(this.healthForm, {
      noteTaker: this.user.data.name, // 记录人
      accountId: this.user.data.id // 记录人
    });
  }

  ngOnInit() {
    this.registration = {};
    this.registration.EconomicProvider = {};
    this.registration.Contacts = [];
    this.registration.HealthHistory = {};
    this.registration.DrugUse = {};
    this.registration.DrugUse.drugMemo = [
      { label: "青霉素类", value: "青霉素类", checked: false },
      { label: "庆大霉素类", value: "庆大霉素类", checked: false },
      { label: "磺胺类", value: "磺胺类", checked: false },
      { label: "其他（注明）", value: "其他", checked: false }
    ];
    this.registration.DrugUse.DrugRecord = [];
    this.userInfo = this.localStroage.getUser();

    let registrationId = this.route.snapshot.paramMap.get("id");
    if (registrationId) {
      let that = this;

      this.isPersonCardLoading = true;
      this.httpService.post(
        "oldman/findById",
        null,
        { id: registrationId },
        data => {
          this.isPersonCardLoading = false;
          if (data["status"] == 200) {
            that.registration = JSON.parse(data["data"]);
            if (!that.registration.DrugUse.drugMemo) {
              that.registration.DrugUse.drugMemo = [
                { label: "青霉素类", value: "青霉素类", checked: false },
                { label: "庆大霉素类", value: "庆大霉素类", checked: false },
                { label: "磺胺类", value: "磺胺类", checked: false },
                { label: "其他（注明）", value: "其他", checked: false }
              ];
            } else {
              that.registration.DrugUse.drugMemo = JSON.parse(
                that.registration.DrugUse.drugMemo
              );
            }

            //页面select返回的数据为数组，此处需要转换成数组；
            const interDrugArr = that.registration.DrugUse.DrugRecord;
            if (interDrugArr instanceof Array) {
              for (let i = 0; i < interDrugArr.length; i++) {
                let drugRecord = interDrugArr[i];
                interDrugArr[i].usagesArray = [drugRecord.usages];
                interDrugArr[i].frequencyArray = [drugRecord.frequency];
              }
            }
            let healthAge: any = new AgeCountPipe().transform(
              this.registration.birthYearMonth
            );
            if (healthAge == 0 || healthAge == "") {
              healthAge = 1;
            }
            const healthObj: any = {
              name: this.registration.name,
              sex: this.registration.sex,
              birthYearMonth: this.registration.birthYearMonth,
              age: healthAge,
              phone: this.registration.phone,
              address: this.registration.address
            };
            GlobalMethod.setForm(this.healthForm, healthObj); // 表单赋值
            console.log(this.registration);
          }
        }
      );

      this.httpService.post(
        "oldman/listOldmanHealth",
        null,
        { oldmanId: registrationId },
        data => {
          this.isPersonCardLoading = false;
          if (data["code"] == 0) {
            data["data"].hasPsyDrugsLastWeek = data[
              "data"
            ].hasPsyDrugsLastWeek.toString();
            this.drugMemoDefault = JSON.parse(data["data"].allergicDrug);

            const takingMedsArr = JSON.parse(data["data"]["takingMeds"]);
            for (let i = 0; i < takingMedsArr.length; i++) {
              const takObj = this.fb.group({
                drugsAndDosage: [takingMedsArr[i].drugsAndDosage], // 回访信息id(新增传空)
                usage: [takingMedsArr[i].usage], // 次数
                perUse: [takingMedsArr[i].perUse], // 时间
                frequency: [takingMedsArr[i].frequency], // 回访内容
                comment: [takingMedsArr[i].comment] // 回访结果
              });
              const takArr = this.healthForm.get("takingMeds") as FormArray;
              takArr.push(takObj); // 推送新表单
            }
            data["data"]["takingMeds"] = this.healthForm.get("takingMeds");
            this.healthForm
              .get("healthComment")
              .setValue(data["data"].healthComment);
            GlobalMethod.setForm(this.healthForm, data["data"]); // 表单赋值
          }
        }
      );
    }
  }

  onSearch(value: string): void {
    const that = this;
    this.isLoading = true;
    let queryParams = { page: "0", size: "10", search: value };
    this.httpService.post("drugs/AllList", null, queryParams, data => {
      that.isLoading = false;
      if (data["status"] == 200) {
        that.listOfDrugs = data["data"];
      }
    });
  }

  onSelectedIndexChange(selectIndex: number) {}

  back() {
    history.back();
  }
}
