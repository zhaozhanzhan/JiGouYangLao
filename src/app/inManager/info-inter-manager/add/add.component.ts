import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "../../../../../node_modules/ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { FormValidService } from "src/app/common/service/FormValid.Service";
import { RegexpConfig } from "src/app/common/service/GlobalConfig";
import { GlobalMethod } from "src/app/common/service/GlobalMethod";
import { AgeCountPipe } from "src/app/common/pipe/age_pipe";
import * as _ from "underscore"; // JS工具类

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  isPersonCardLoading = false; // 个人信息加载状态
  isHealthCardLoading = false;

  saveHealthBtnLoading = false; // 保存健康按钮状态

  savePersonalBtnLoading = false; // 保存个人信息按钮状态

  dialogStyle = {
    width: "800px",
    padding: "0 0 100px"
  }; // 显示咨询列表老人的对话框

  isShowOldDialog = false;

  consultOldList = [];

  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    btime: "",
    etime: "",
    ebtime: "",
    eetime: ""
  }; // 长者列表查询对象

  searchOldName = ""; // 老年人选择对话框检索

  isOldTableLoading = false; // 老年人列表table加载状态

  oldDataArray = []; // 长者列表

  oldResultData = {
    totalElements: 0
  }; // 列表总条数

  interview; // 个人信息表单对象
  userInfo;

  tabIndex = 0; // 选择的Tab索引

  listOfDrugs = [];
  isLoading = false;

  validateForm: FormGroup; // 个人信息表单较验对象

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
    private httpService: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private fb: FormBuilder,
    private message: NzMessageService,
    private jsUtil: JsUtilsService,
    private localStorage: LocalStorage
  ) {
    this.user = this.localStorage.getUser();

    this.validateForm = this.fb.group({
      name: ["", [Validators.required]],
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
      religion: ["", []],
      religionMemo: ["", []],
      medicalPayment: ["", []],
      medicalPaymentMemo: ["", []],
      medicalCard: ["", []],
      personnelSort: [""],
      personnelSortMemo: ["", []],
      cultivation: ["", []],
      livingSituation: ["", []],
      financialResources: ["", []]
    });

    this.healthForm = this.fb.group({
      interviewId: [""], // 调防表id
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

  interviewId;

  ngOnInit() {
    const DrugMemoDefault = [
      { label: "青霉素类", value: "青霉素类", checked: false },
      { label: "庆大霉素类", value: "庆大霉素类", checked: false },
      { label: "磺胺类", value: "磺胺类", checked: false },
      { label: "其他（注明）", value: "其他", checked: false }
    ];

    this.interview = {};
    this.interview.InterviewEconomicProvider = {};
    this.interview.InterviewContacts = [];
    this.interview.InterviewHealthHistory = {};
    this.interview.InterviewDrugUse = {};
    this.interview.InterviewDrugUse.drugMemo = DrugMemoDefault;
    this.interview.InterviewDrugUse.InterviewDrugRecord = [];
    this.userInfo = this.localStroage.getUser();

    let interviewId = this.route.snapshot.paramMap.get("id");
    if (interviewId) {
      let that = this;

      this.isPersonCardLoading = true;
      this.httpService.post(
        "interview/findById",
        null,
        { id: interviewId },
        data => {
          this.isPersonCardLoading = false;
          if (data["status"] == 200) {
            that.interview = JSON.parse(data["data"]);
            if(that.interview.outmode instanceof Array){
              that.outmode = that.interview.outmode;
            }
            if (!that.interview.InterviewDrugUse.drugMemo) {
              that.interview.InterviewDrugUse.drugMemo = DrugMemoDefault;
            } else {
              that.interview.InterviewDrugUse.drugMemo = JSON.parse(
                that.interview.InterviewDrugUse.drugMemo
              );
            }

            //页面select返回的数据为数组，此处需要转换成数组；
            const interDrugArr =
              that.interview.InterviewDrugUse.InterviewDrugRecord;
            if (interDrugArr instanceof Array) {
              for (let i = 0; i < interDrugArr.length; i++) {
                let drugRecord = interDrugArr[i];
                interDrugArr[i].usagesArray = [drugRecord.usages];
                interDrugArr[i].frequencyArray = [drugRecord.frequency];
              }
            }
            let healthAge: any = new AgeCountPipe().transform(
              this.interview.birthYearMonth
            );
            if (healthAge == 0 || healthAge == "") {
              healthAge = 1;
            }
            const healthObj: any = {
              name: this.interview.name,
              sex: this.interview.sex,
              birthYearMonth: this.interview.birthYearMonth,
              age: healthAge,
              phone: this.interview.phone,
              address: this.interview.address
            };
            GlobalMethod.setForm(this.healthForm, healthObj); // 表单赋值
            console.log(this.interview);
          }
        }
      );

      this.httpService.post(
        "interview/listFitnessCondition",
        null,
        { interviewId: interviewId },
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
            console.log(
              "=============================",
              data["data"].healthComment
            );
            delete data["data"].allergicDrug;
            delete data["data"].interview.takingMeds;
            this.healthForm
              .get("healthComment")
              .setValue(data["data"].healthComment);
            GlobalMethod.setForm(this.healthForm, data["data"]); // 表单赋值
          }
        }
      );
    } else {
      this.interview.personnelSort = "社会代养";
    }
  }

  onSelectedIndexChange(selectIndex: number) {
    if (selectIndex === 1) {
      this.onSearch("");
    }
  }

  onReligionChange(value) {
    if (this.interview.religion === "无") {
      this.interview.religionMemo = "";
    }
  }

  onMedicalPaymentChange(value) {
    if (this.interview.medicalPayment !== "其他") {
      this.interview.medicalPaymentMemo = "";
    }
  }

  onPersonnelSortChange(value) {
    if (this.interview.personnelSort === "社会代养") {
      this.interview.personnelSortMemo = "";
    }
  }

  onDrugAllergyChange(value) {
    if (value == 0) {
      // alert(value);
      this.interview.InterviewDrugUse.drugMemo.forEach(e => {
        e.checked = false;
      });
      this.interview.InterviewDrugUse.drugMemoOther = "";
    }
  }

  onDrugMemoChange(value: string[]): void {
    this.interview.InterviewDrugUse.drugMemo.forEach(e => {
      if (!e.checked) {
        this.interview.InterviewDrugUse.drugMemoOther = "";
      }
    });
  }

  back() {
    history.back();
  }

  /**
   * 保存个人信息
   * @returns
   * @memberof AddComponent
   */
  onSavePersonalInfo() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    console.log(this.validateForm);
    if (this.validateForm.status === "INVALID") {
      window.scrollTo(0, 0);
      return;
    }

    this.savePersonalBtnLoading = true;

    this.interview.birthYearMonth = this.jsUtil.dateFormat(
      this.interview.birthYearMonth
    );
    this.interview.outmode = this.outmode;
    console.log(this.interview);

    if (this.interview.id) {
      this.interview.modifier = this.userInfo.name;
      const that = this;
      this.httpService.post(
        "interview/updateFirst",
        null,
        this.interview,
        data => {
          that.savePersonalBtnLoading = false;
          if (data["status"] == 200) {
            that.savePersonalBtnLoading = false;
            that.message.success("保存成功！");
            let healthAge: any = new AgeCountPipe().transform(
              this.interview.birthYearMonth
            );
            if (healthAge == 0 || healthAge == "") {
              healthAge = 1;
            }
            const healthObj: any = {
              name: this.interview.name,
              sex: this.interview.sex,
              birthYearMonth: this.interview.birthYearMonth,
              age: healthAge,
              phone: this.interview.phone,
              address: this.interview.address
            };
            GlobalMethod.setForm(this.healthForm, healthObj); // 表单赋值
            console.log(this.interview);
          }
        }
      );
    } else {
      this.interview.noteTaker = this.userInfo.name;
      const that = this;
      this.httpService.post(
        "interview/saveFirst",
        null,
        this.interview,
        data => {
          that.savePersonalBtnLoading = false;
          if (data["status"] == 200) {
            that.message.success("保存成功！");
            that.interview.id = data["data"].id;
            let healthAge: any = new AgeCountPipe().transform(
              this.interview.birthYearMonth
            );
            if (healthAge == 0 || healthAge == "") {
              healthAge = 1;
            }
            const healthObj: any = {
              name: this.interview.name,
              sex: this.interview.sex,
              birthYearMonth: this.interview.birthYearMonth,
              age: healthAge,
              phone: this.interview.phone,
              address: this.interview.address
            };
            GlobalMethod.setForm(this.healthForm, healthObj); // 表单赋值
            console.log(this.interview);
          }
        }
      );
    }
  }

  /**
   * 保存健康信息
   * @memberof AddComponent
   */
  onSaveHealthInfo() {
    console.log(this.interview);

    if (this.interview.InterviewDrugUse.InterviewDrugRecord) {
      for (
        let i = 0;
        i < this.interview.InterviewDrugUse.InterviewDrugRecord.length;
        i++
      ) {
        let drugRecord = this.interview.InterviewDrugUse.InterviewDrugRecord[i];
        if (drugRecord.usagesArray && drugRecord.usagesArray.length > 0) {
          drugRecord.usages = drugRecord.usagesArray[0];
        }

        if (drugRecord.frequencyArray && drugRecord.frequencyArray.length > 0) {
          drugRecord.frequency = drugRecord.frequencyArray[0];
        }
      }
    }
    this.interview.modifier = this.userInfo.name;
    this.saveHealthBtnLoading = true;
    const that = this;
    this.httpService.post(
      "interview/updateSecond",
      null,
      this.interview,
      data => {
        this.saveHealthBtnLoading = false;
        this.message.success("保存成功！");
      }
    );
  }

  /**
   * 新增家庭成员
   * @param {MouseEvent} [e]
   * @memberof AddComponent
   */
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.interview.InterviewContacts.length > 0
        ? this.interview.InterviewContacts[
            this.interview.InterviewContacts.length - 1
          ].id + 1
        : 0;

    const jiatingchengyuan = {
      name: "",
      relationship: "",
      address: "",
      phone: "",
      isJjlxr: false
    };
    // const index = this.interviewContactsList.push(jiatingchengyuan);

    this.interview.InterviewContacts = [
      ...this.interview.InterviewContacts,
      jiatingchengyuan
    ];
    // console.log(this.interview.InterviewContacts[this.interview.InterviewContacts.length - 1]);
    // console.log(this.interview.InterviewContacts);
  }

  /**
   * 移除家庭成员
   * @param i
   * @param e
   */
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
    if (this.interview.InterviewContacts.length > 0) {
      // const index = this.interviewContactsList.indexOf(i);
      // this.interviewContactsList.splice(index, 1);

      this.interview.InterviewContacts = this.interview.InterviewContacts.filter(
        d => d !== i
      );
      // console.log(this.interview.InterviewContacts);
    }
  }

  addDrug(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    if (!this.interview.InterviewDrugUse.InterviewDrugRecord) {
      this.interview.InterviewDrugUse.InterviewDrugRecord = [];
    }
    let drugList = this.interview.InterviewDrugUse.InterviewDrugRecord;
    const id = drugList.length > 0 ? drugList[drugList.length - 1].id + 1 : 0;

    const drug = {
      drugName: "",
      drugsId: "",
      usagesArray: [],
      usages: "",
      num: "",
      frequencyArray: [],
      frequency: "",
      memo: ""
    };
    // const index = drugList.push(jiatingchengyuan);

    this.interview.InterviewDrugUse.InterviewDrugRecord = [...drugList, drug];
    // console.log(this.interview.InterviewDrugUse.InterviewDrugRecord);
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
    let drugList = this.interview.InterviewDrugUse.InterviewDrugRecord;
    if (drugList.length > 0) {
      // const index = this.drugList.indexOf(i);
      // this.drugList.splice(index, 1);

      this.interview.InterviewDrugUse.InterviewDrugRecord = drugList.filter(
        d => d !== i
      );
      // console.log(this.interview.InterviewDrugUse.InterviewDrugRecord);
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

  public getDrugMemo(ev) {
    console.log(ev);
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
    healthForm.interviewId = this.interview.id; // 个人信息ID
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

    this.httpService.post(
      "interview/saveOrUpdateFitness",
      null,
      healthForm,
      data => {
        that.saveHealthBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("保存成功！");
          that.jumpPage("../");
        } else {
          that.message.error(data["message"]);
        }
      }
    );
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

  /**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }

  /**
   * 显示老年人选择对话框，并加载老年人列表
   */
  showOldDialog() {
    this.isShowOldDialog = true;
    this.loadingOldList();
  }

  /**
   * 老年人选择对话框中选择了某个老年人；
   */
  chooseOld(oldInfo) {
    this.isShowOldDialog = false;
    if (oldInfo != null) {
      this.interview.name = oldInfo.name;
      this.interview.sex = oldInfo.sex;
      this.interview.birthYearMonth = oldInfo.birthYearMonth;
      this.interview.address = oldInfo.address;
      this.interview.phone = oldInfo.phone;
      if (oldInfo.isProvider == false) {
        this.interview.InterviewEconomicProvider.name = "";
      } else {
        this.interview.InterviewEconomicProvider.name = oldInfo.theName;
      }

      this.interview.InterviewEconomicProvider.relationship =
        oldInfo.relationship;
    }
  }

  /**
   * 加载老年人列表
   */
  loadingOldList(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.oldQueryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldQueryParams.page = this.oldQueryParams.page - 1;
      if (this.oldQueryParams.page < 0) {
        this.oldQueryParams.page = 0;
      }
    }
    that.oldQueryParams.name = that.searchOldName;
    that.isOldTableLoading = true;
    let param = this.httpService.post(
      "consulting/list",
      null,
      this.oldQueryParams,
      data => {
        that.oldQueryParams.page++;
        that.isOldTableLoading = false;
        if (data["status"] == 200) {
          this.oldDataArray = data["data"]["content"]; // 数据列表
          this.oldResultData.totalElements = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }
}
