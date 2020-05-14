import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
import { GlobalMethod } from "src/app/common/service/GlobalMethod";
import { AgeCountPipe } from "src/app/common/pipe/age_pipe";
import * as _ from "underscore"; // JS工具类
@Component({
  selector: "app-personal-info",
  templateUrl: "./personal-info.component.html",
  styleUrls: ["./personal-info.component.css"]
})
export class PersonalInfoComponent implements OnInit {
  isPersonCardLoading = false; // 个人信息加载状态
  isLoadingData;

  elderInfo;
  userInfo;

  saveHealthBtnLoading = false; // 保存健康按钮状态

  tabIndex = 0;

  listOfDrugs = [];
  isLoading = false;
  isDrugsLoading = false;

  validateForm: FormGroup;
  public healthForm: FormGroup; // 定义健康情况表单对象
  public user; // 用户登录信息

  outmode = [
    { label: '执行请销假制度', value: '执行请销假制度', checked: false },
    { label: '不执行请销假制度', value: '不执行请销假制度', checked: false },
    { label: '允许老人独自外出', value: '允许老人独自外出', checked: false },
    { label: '在家属陪同下外出', value: '在家属陪同下外出', checked: false }
  ];

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
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private fb: FormBuilder,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {
    this.user = this.localStroage.getUser();

    this.validateForm = this.fb.group({
      name: ["", []],
      sex: ["", [Validators.required]],
      nation: [""],
      birthYearMonth: ["", [Validators.required]],
      cardno: [
        "",
        [Validators.pattern(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)]
      ],
      marriage: ["", []],
      nativePlace: ["", []],
      address: ["", []],
      phone: ["", []],
      education: ["", []],
      political: ["", []],
      occupation: ["", []],
      hopy: ["", []],
      religion: [""],
      religionMemo: ["", []],
      medicalPayment: [""],
      medicalPaymentMemo: ["", []],
      medicalCard: ["", []],
      personnelSort: [""],
      personnelSortMemo: ["", []],
      cultivation: ["", []],
      livingSituation: ["", []],
      financialResources: ["", []]
    });

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
    this.elderInfo = {};

    this.elderInfo.EconomicProvider = {};
    this.elderInfo.Contacts = [];
    this.elderInfo.HealthHistory = {};
    this.elderInfo.DrugUse = {};
    this.elderInfo.DrugUse.drugMemo = [
      { label: "青霉素类", value: "青霉素类", checked: false },
      { label: "庆大霉素类", value: "庆大霉素类", checked: false },
      { label: "磺胺类", value: "磺胺类", checked: false },
      { label: "其他（注明）", value: "其他", checked: false }
    ];
    this.elderInfo.DrugUse.DrugRecord = [];
    this.userInfo = this.localStroage.getUser();

    let elderInfoId = this.route.snapshot.paramMap.get("id");
    if (elderInfoId) {
      let that = this;
      // that.httpService.doPostHttp(
      //   "/oldman/findById",
      //   { id: elderInfoId },
      //   function(successful, data, res) {
      //     that.elderInfo = JSON.parse(data);
      //     console.log("入住时间" + that.elderInfo.inDate);
      //     if (!that.elderInfo.DrugUse.drugMemo) {
      //       that.elderInfo.DrugUse.drugMemo = [
      //         { label: "青霉素类", value: "青霉素类", checked: false },
      //         { label: "庆大霉素类", value: "庆大霉素类", checked: false },
      //         { label: "磺胺类", value: "磺胺类", checked: false },
      //         { label: "其他（注明）", value: "其他", checked: false }
      //       ];
      //     } else {
      //       that.elderInfo.DrugUse.drugMemo = JSON.parse(
      //         that.elderInfo.DrugUse.drugMemo
      //       );
      //     }
      //     // console.log(that.elderInfo.DrugUse.DrugRecord);
      //     if (that.elderInfo.DrugUse.DrugRecord instanceof Array) {
      //       that.elderInfo.DrugUse.DrugRecord.forEach(e => {
      //         e.usages = JSON.parse(e.usages);
      //         e.frequency = JSON.parse(e.frequency);
      //       });
      //     } else {
      //       that.elderInfo.DrugUse.DrugRecord = [];
      //     }
      //   },
      //   function(successful, msg, err) {
      //     const toastCfg = new ToastConfig(ToastType.ERROR, "", msg, 3000);
      //     that.toastService.toast(toastCfg);
      //   }
      // );

      this.httpReq.post("/oldman/findById", null, { id: elderInfoId }, data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.elderInfo = JSON.parse(data["data"]);
            if(that.elderInfo.outmode instanceof Array){
              that.outmode = that.elderInfo.outmode;
            }
            console.log("入住时间" + that.elderInfo.inDate);
            if (!that.elderInfo.DrugUse.drugMemo) {
              that.elderInfo.DrugUse.drugMemo = [
                { label: "青霉素类", value: "青霉素类", checked: false },
                { label: "庆大霉素类", value: "庆大霉素类", checked: false },
                { label: "磺胺类", value: "磺胺类", checked: false },
                { label: "其他（注明）", value: "其他", checked: false }
              ];

              let healthAge: any = new AgeCountPipe().transform(
                this.elderInfo.birthYearMonth
              );
              if (healthAge == 0 || healthAge == "") {
                healthAge = 1;
              }
              const healthObj: any = {
                name: this.elderInfo.name,
                sex: this.elderInfo.sex,
                birthYearMonth: this.elderInfo.birthYearMonth,
                age: healthAge,
                phone: this.elderInfo.phone,
                address: this.elderInfo.address
              };
              GlobalMethod.setForm(this.healthForm, healthObj); // 表单赋值
              console.log(this.elderInfo);
            } else {
              that.elderInfo.DrugUse.drugMemo = JSON.parse(
                that.elderInfo.DrugUse.drugMemo
              );
            }
            // console.log(that.elderInfo.DrugUse.DrugRecord);
            // if (that.elderInfo.DrugUse.DrugRecord instanceof Array) {
            //   that.elderInfo.DrugUse.DrugRecord.forEach(e => {
            //     e['usages'] = JSON.parse(e['usages']);
            //     e['frequency']= JSON.parse(e['frequency']);
            //   });
            // } else {
            //   that.elderInfo.DrugUse.DrugRecord = [];
            // }
          } else {
            that.message.error(data["msg"]);
          }
        }
      });

      this.httpReq.post(
        "oldman/listOldmanHealth",
        null,
        { oldmanId: elderInfoId },
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
            console.log("=============================", data["data"]);
            // delete data["data"].allergicDrug;
            // delete data["data"].interview.takingMeds;
            this.healthForm
              .get("healthComment")
              .setValue(data["data"].healthComment);
            GlobalMethod.setForm(this.healthForm, data["data"]); // 表单赋值
          }
        }
      );
    }
  }

  onSelectedIndexChange(selectIndex: number) {
    // console.log(selectIndex);
    // alert(selectIndex);

    if (selectIndex === 1) {
      // alert('tab1');
      this.onSearch("");
    }
  }

  onReligionChange(value) {
    if (this.elderInfo.religion === "无") {
      this.elderInfo.religionMemo = "";
    }
  }

  onMedicalPaymentChange(value) {
    if (this.elderInfo.medicalPayment !== "其他") {
      this.elderInfo.medicalPaymentMemo = "";
    }
  }

  onPersonnelSortChange(value) {
    if (this.elderInfo.personnelSort === "社会代养") {
      this.elderInfo.personnelSortMemo = "";
    }
  }

  onDrugAllergyChange(value) {
    if (value == 0) {
      // alert(value);
      this.elderInfo.DrugUse.drugMemo.forEach(e => {
        e.checked = false;
      });
      this.elderInfo.DrugUse.drugMemoOther = "";
    }
  }

  onDrugMemoChange(value: string[]): void {
    this.elderInfo.DrugUse.drugMemo.forEach(e => {
      if (!e.checked) {
        this.elderInfo.DrugUse.drugMemoOther = "";
      }
    });
  }

  back() {
    history.back();
  }

  onSavePersonalInfo() {
    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[i].markAsDirty();
    //   this.validateForm.controls[i].updateValueAndValidity();
    // }

    // if (this.validateForm.status === "INVALID") {
    //   return;
    // }

    // this.elderInfo.birthYearMonth = this.jsUtil.dateFormat(
    //   this.elderInfo.birthYearMonth
    // );
    this.elderInfo.outmode = this.outmode;
    if (this.elderInfo.id) {
      // alert('修改');
      this.elderInfo.modifier = this.userInfo.name;
      const that = this;
      // this.httpService.doPostHttp(
      //   "/oldman/updateFirst",
      //   this.elderInfo,
      //   function(successful, data, res) {
      //     const toastCfg = new ToastConfig(
      //       ToastType.SUCCESS,
      //       "",
      //       "保存成功！",
      //       3000
      //     );
      //     that.toastService.toast(toastCfg);
      //   },
      //   function(successful, msg, err) {
      //     const toastCfg = new ToastConfig(ToastType.ERROR, "", msg, 3000);
      //     that.toastService.toast(toastCfg);
      //   }
      // );

      this.httpReq.post("/oldman/updateFirst", null, this.elderInfo, data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.message.success("保存成功！");
            let healthAge: any = new AgeCountPipe().transform(
              this.elderInfo.birthYearMonth
            );
            if (healthAge == 0 || healthAge == "") {
              healthAge = 1;
            }
            const healthObj: any = {
              name: this.elderInfo.name,
              sex: this.elderInfo.sex,
              birthYearMonth: this.elderInfo.birthYearMonth,
              age: healthAge,
              phone: this.elderInfo.phone,
              address: this.elderInfo.address
            };
            GlobalMethod.setForm(this.healthForm, healthObj); // 表单赋值
            console.log(this.elderInfo);
          } else {
            that.message.error(data["msg"]);
          }
        }
      });
    } else {
      // alert('添加');

      this.elderInfo.noteTaker = this.userInfo.name;
      const that = this;
      // this.httpService.doPostHttp(
      //   "/oldman/saveFirst",
      //   this.elderInfo,
      //   function(successful, data, res) {
      //     const toastCfg = new ToastConfig(
      //       ToastType.SUCCESS,
      //       "",
      //       "保存成功！",
      //       3000
      //     );
      //     that.toastService.toast(toastCfg);
      //     that.elderInfo.id = data.id;
      //   },
      //   function(successful, msg, err) {
      //     const toastCfg = new ToastConfig(ToastType.ERROR, "", msg, 3000);
      //     that.toastService.toast(toastCfg);
      //   }
      // );

      this.httpReq.post("/oldman/saveFirst", null, this.elderInfo, data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.message.success("保存成功！");
            that.elderInfo.id = data.id;
            let healthAge: any = new AgeCountPipe().transform(
              this.elderInfo.birthYearMonth
            );
            if (healthAge == 0 || healthAge == "") {
              healthAge = 1;
            }
            const healthObj: any = {
              name: this.elderInfo.name,
              sex: this.elderInfo.sex,
              birthYearMonth: this.elderInfo.birthYearMonth,
              age: healthAge,
              phone: this.elderInfo.phone,
              address: this.elderInfo.address
            };
            GlobalMethod.setForm(this.healthForm, healthObj); // 表单赋值
            console.log(this.elderInfo);
          } else {
            that.message.error(data["msg"]);
          }
        }
      });
    }
  }

  onSaveHealthInfo() {
    this.elderInfo.modifier = this.userInfo.name;
    const that = this;
    // this.httpService.doPostHttp(
    //   "/oldman/updateSecond",
    //   this.elderInfo,
    //   function(successful, data, res) {
    //     const toastCfg = new ToastConfig(
    //       ToastType.SUCCESS,
    //       "",
    //       "保存成功！",
    //       3000
    //     );
    //     that.toastService.toast(toastCfg);
    //   },
    //   function(successful, msg, err) {
    //     const toastCfg = new ToastConfig(ToastType.ERROR, "", msg, 3000);
    //     that.toastService.toast(toastCfg);
    //   }
    // );

    this.httpReq.post("/oldman/updateSecond", null, this.elderInfo, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          that.message.success("保存成功！");
          this.back();
        } else {
          that.message.error(data["msg"]);
        }
      }
    });
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.elderInfo.Contacts.length > 0
        ? this.elderInfo.Contacts[this.elderInfo.Contacts.length - 1].id + 1
        : 0;

    const jiatingchengyuan = {
      name: "",
      relationship: "",
      address: "",
      phone: "",
      isJjlxr: false
    };
    // const index = this.ContactsList.push(jiatingchengyuan);

    this.elderInfo.Contacts = [...this.elderInfo.Contacts, jiatingchengyuan];
  }

  removeField(
    i: {
      name: string;
      relationship: string;
      address: string;
      phone: string;
      isJjlxr: boolean;
    },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.elderInfo.Contacts.length > 0) {
      this.elderInfo.Contacts = this.elderInfo.Contacts.filter(d => d !== i);
    }
  }

  addDrug(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    let drugList = this.elderInfo.DrugUse.DrugRecord;

    const id = drugList.length > 0 ? drugList[drugList.length - 1].id + 1 : 0;

    const drug = {
      drugsId: undefined,
      usages: undefined,
      num: undefined,
      frequency: undefined,
      memo: undefined
    };
    // const index = drugList.push(jiatingchengyuan);

    this.elderInfo.DrugUse.DrugRecord = [...drugList, drug];
  }

  removeDrug(
    i: {
      name: string;
      relationship: string;
      address: string;
      phone: string;
      isJjlxr: boolean;
    },
    e: MouseEvent
  ): void {
    e.preventDefault();
    let drugList = this.elderInfo.DrugUse.DrugRecord;
    if (drugList.length > 0) {
      // const index = this.drugList.indexOf(i);
      // this.drugList.splice(index, 1);

      this.elderInfo.DrugUse.DrugRecord = drugList.filter(d => d !== i);
      // console.log(this.elderInfo.DrugUse.DrugRecord);
    }
  }

  /**
   * 创建正在使用的药物信息对象
   * @public
   * @returns 返回正在使用的药物信息对象
   * @memberof AddComponent
   */
  public creTakingInfoObj() {
    const takingInfoObj: any = this.fb.group({
      drugsAndDosage: [], // 药物的名称与剂型
      usage: [], // 用法
      perUse: [""], // 每次用量
      frequency: [], // 频率
      comment: [""] // 备注
    });
    return takingInfoObj;
  }

  /**
   * 添加正在使用的药物信息对象进表单组数
   * @public
   * @memberof AddComponent
   */
  public addTakingInfoObj() {
    const takingInfoArr = this.healthForm.get("takingMeds") as FormArray;
    takingInfoArr.push(this.creTakingInfoObj()); // 推送新表单
  }

  /**
   * 删除正在使用的药物信息对象
   * @public
   * @memberof AddComponent
   */
  public rmTakingInfoObj(i: number) {
    const takingInfoArr = this.healthForm.get("takingMeds") as FormArray;
    takingInfoArr.removeAt(i); // 根据索引移除对应的表单对象
  }

  /**
   * 改变路由跳转页面
   * @param {string} url 相对路由或绝对路径 ex:'info'或'../info'或'/nursingHome/medical'
   * @param {*} paramObj 要传递的参数信息
   */
  public jumpPage(url: string, param?: any): void {
    if (param) {
      GlobalMethod.changeRoute(url, this.router, this.route, param);
    } else {
      GlobalMethod.changeRoute(url, this.router, this.route);
    }
  }

  /**
   * 保存表单数据
   * @returns
   * @memberof ConsultAddComponent
   */
  public saveHealthForm() {
    const that = this;
    const healthFormCtrl = this.healthForm.controls;
    const healthForm = this.jsUtil.deepClone(this.healthForm.value); // 深度拷贝表单数据
    for (const i in healthFormCtrl) {
      // 较验整个表单标记非法字段
      healthFormCtrl[i].markAsDirty();
      healthFormCtrl[i].updateValueAndValidity();
    }

    if (this.healthForm.invalid) {
      // 表单较验未通过
      return;
    }

    healthForm.fillDate = this.jsUtil.dateFormat(healthForm.fillDate); // 填表日期
    healthForm.inHosDate = this.jsUtil.dateFormat(healthForm.inHosDate); // 入院时间
    healthForm.oldmanId = this.elderInfo.id; // 个人信息ID
    for (let i = 0; i < healthForm.takingMeds.length; i++) {
      // 修改保存的数据格式
      if (
        _.isArray(healthForm.takingMeds[i].frequency) &&
        healthForm.takingMeds[i].frequency.length > 0
      ) {
        healthForm.takingMeds[i].frequency =
          healthForm.takingMeds[i].frequency[0];
      }
      if (
        _.isArray(healthForm.takingMeds[i].usage) &&
        healthForm.takingMeds[i].usage.length > 0
      ) {
        healthForm.takingMeds[i].usage = healthForm.takingMeds[i].usage[0];
      }
    }
    healthForm.allergicDrug = this.drugMemoDefault; // 过敏药物

    console.log(healthForm);
    this.saveHealthBtnLoading = true;

    this.httpReq.post(
      "oldman/saveOrUpdateOldmanHealth",
      null,
      healthForm,
      data => {
        that.saveHealthBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("保存成功！");
          this.back();
        } else {
          that.message.error(data["message"]);
        }
      }
    );
  }

  onSearch(value: string): void {
    this.isDrugsLoading = true;

    this.httpReq.post("drugs/AllList", null, { search: value }, data => {
      this.isDrugsLoading = false;
      if (data["status"] == 200) {
        this.listOfDrugs = data["data"];
      }
    });
  }
}
