import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";

export class EmergencyContact {
  name: string;
  relationship: string;
  address: string;
  phone: string;
}
@Component({
  selector: "app-apply",
  templateUrl: "./apply.component.html",
  styleUrls: ["./apply.component.scss"]
})
export class ApplyComponent implements OnInit {
  mentality1 = [];
  // 显示压疮评分的弹窗
  isLoadingOne = false;
  saveIsLoadingOne = false;
  // // 保存压疮表的分数
  // radioValue;
  // moist;
  // mobility;
  // locomotivity;
  // nutrition;
  // friction;
  // BradenSum;
  //是否显示选择老人对话框
  isShowOldDialog = false;
  //  请求老人信息时的参数
  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    graranteesno: "",
    hasbed: "",
    nursinglevel: "",
    building: "",
    floor: "",
    room: ""
  };
  //老人列表table加载状态
  isOldTableLoading = false;
  // 名称显示
  searchOldName = "";
  //  获得老人信息的数组
  oldDataArray = [];
  // 获得老人的页数
  oldResultData = {
    totalElements: 0
  };
  // 选择老人时保存的数据
  saveContractParams = {
    oldman_id: "",
    name: "", //姓名
    birthYearMonth: "", //出生年月
    education: "", //文化程度：
    admissionNo: "", //住院号
    occupation: "", //职业
    sex: "", //性别
    marriage: "", //婚姻状况
    inDate: "", //入院时间
    zhend: "", //诊断
    nation: "", //名族
    religion: "", //宗教信仰
    religionMemo: "" //宗教信仰有的时候显示
  };
  Braden = false;

  // 保存照护评估参数
  careAssessParams = {
    id: "", //"入住照护评估表id（新增传空）",
    occupation: "", //"原职业",
    nationality: "", //"国籍",
    nativePlace: "", //"籍贯",
    emergencyLiaison: "", //"紧急联络人",
    relationship: "", //"紧急联络人关系",
    emergencyPhone: "", //"紧急电话",
    inType: "", //"入住方式",
    inTypeOther: "", //"入住方式其他",
    childrens: "", //"子女情况",
    familys: "", //"家庭关系",
    smoke: "", //"烟酒嗜好",
    smokeOther: "", //"烟酒嗜好其他",
    wine: "", //酒嗜好
    wineOther: "", //"酒嗜好其他"
    clothes: "", //"衣冠",
    consciousness: "", //"意识",
    thinking: "", //"思维",
    thinkingOther: "", //"思维其他",
    talking: "", //"语言交流",
    talkingOther: "", //"语言交流其他",
    language: "", //"语言",
    languageOther: "", //"语言其他",
    emotion: "", //"态度",
    behavior: "", //"性格类型",
    communication: "", //"兴趣爱好",
    vision: "", //"视力",
    hearing: "", //"听力",
    chew: "", //"咀嚼功能",
    diet: "", //"饮食",
    appetite: "", //"食欲",
    shape: "", //"体型",
    weight: "", //"体重",
    weightOther: "", //"体重其他",
    comfort: "", //"舒适程度",
    comfortOther: "", //"舒适程度其他",
    membrane: "", //"皮肤黏膜",
    membraneOther: "", //"皮肤黏膜其他",
    circulation: "", //"末梢循环",
    circulationOther: "", //"末梢循环其他",
    morphology: "", //"呼吸形态",
    morphologyOther: "", //"呼吸形态其他",
    respiration: "", //"辅助呼吸",
    respirationOther: "", //"辅助呼吸其他",
    rate: "", //"心率",
    pee: "", //"排尿",
    peeOther: "", //"排尿其他",
    shit: "", //"排便",
    shitOther: "", //"排便其他",
    habits: "", //"睡眠习惯",
    morphologic: "", //"睡眠形态",
    morphologicOther: "", //"睡眠形态其他",
    ability: "", //"自理能力",
    abilityOther: "", //"自理能力其他",
    risk: "", //"跌倒风险",
    riskOther: "", //"跌倒风险其他",
    selfcognition: "", //"自我健康认知",
    homecognition: "", //"家人对长者健康认知",
    signs: "", //"生命体征",
    anaphylaxis: "", //"过敏史",
    anaphylaxisOther: "", //"过敏史其他",
    history: "", //"现存病史",
    drugs: "", //"所用药物",
    careq: "", //"照护问题",
    carem: "", //"照护措施",
    oldman_id: "", //"老人id",
    conclusion: "", //"评估结论",
    employeesName: "", //"护理员",
    stayDate: "" //"入住时间"
  };
  communication = [];
  careq = [];
  stayDate;
  value;
  // 吸烟其他
  smokeOther = {
    daily: "",
    sucked: "",
    quit: ""
  };

  // 喝酒其他
  wineOther = {
    daily: "",
    drink: ""
  };

  // 舒适程度其他
  comfortOther = {
    part: "",
    nature: "",
    law: "",
    simultaneous: "",
    painScore: "",
    other: ""
  };

  // 皮肤黏膜其他
  membraneOther = {
    site: "",
    size: "",
    aging: "",
    other: "",
    radioValue: "",
    moist: "",
    mobility: "",
    locomotivity: "",
    nutrition: "",
    friction: "",
    BradenSum: ""
  };

  // 睡眠习惯
  habitsOther = {
    sleepTime: "",
    lateTime: "",
    morningTime: ""
  };

  // 生命体征其他
  signsOther = {
    animalHeat: "",
    pulse: "",
    breathe: "",
    bloodPressure: "",
    weight: "",
    height: "",
    glucose: ""
  };
  // 过敏史其他
  anaphylaxisOther = {
    food: "",
    drug: ""
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService
  ) {}
  ngOnInit() {
    const createAssessStr = this.route.snapshot.paramMap.get("info");
    if (createAssessStr) {
      const createAssessInfo = JSON.parse(createAssessStr);
      this.careAssessParams.id = createAssessInfo.id;
      this.smokeOther = JSON.parse(createAssessInfo.smokeOther);
      this.wineOther = JSON.parse(createAssessInfo.wineOther);
      this.comfortOther = JSON.parse(createAssessInfo.comfortOther);
      this.membraneOther = JSON.parse(createAssessInfo.membraneOther);
      this.habitsOther = JSON.parse(createAssessInfo.habits);
      this.signsOther = JSON.parse(createAssessInfo.signs);
      this.anaphylaxisOther = JSON.parse(createAssessInfo.anaphylaxisOther);
      this.communication = JSON.parse(createAssessInfo.communication);
      this.careq = JSON.parse(createAssessInfo.careq);
      this.careAssessParams.occupation = createAssessInfo.occupation;
      this.careAssessParams.nationality = createAssessInfo.nationality;
      this.careAssessParams.nativePlace = createAssessInfo.nativePlace;
      this.careAssessParams.emergencyLiaison =
        createAssessInfo.emergencyLiaison;
      this.careAssessParams.relationship = createAssessInfo.relationship;
      this.careAssessParams.emergencyPhone = createAssessInfo.emergencyPhone;
      this.careAssessParams.inType = createAssessInfo.inType;
      this.careAssessParams.inTypeOther = createAssessInfo.inTypeOther;
      this.careAssessParams.childrens = createAssessInfo.childrens;
      this.careAssessParams.familys = createAssessInfo.familys;
      this.careAssessParams.smoke = createAssessInfo.smoke;
      this.careAssessParams.wine = createAssessInfo.wine;
      this.careAssessParams.clothes = createAssessInfo.clothes;
      this.careAssessParams.consciousness = createAssessInfo.consciousness;
      this.careAssessParams.thinking = createAssessInfo.thinking;
      this.careAssessParams.thinkingOther = createAssessInfo.thinkingOther;
      this.careAssessParams.talking = createAssessInfo.talking;
      this.careAssessParams.talkingOther = createAssessInfo.talkingOther;
      this.careAssessParams.language = createAssessInfo.language;
      this.careAssessParams.languageOther = createAssessInfo.languageOther;
      this.careAssessParams.emotion = createAssessInfo.emotion;
      this.careAssessParams.behavior = createAssessInfo.behavior;
      console.log("behavior" + this.careAssessParams.behavior);
      this.careAssessParams.vision = createAssessInfo.vision;
      this.careAssessParams.hearing = createAssessInfo.hearing;
      this.careAssessParams.chew = createAssessInfo.chew;
      this.careAssessParams.diet = createAssessInfo.diet;
      this.careAssessParams.appetite = createAssessInfo.appetite;
      this.careAssessParams.shape = createAssessInfo.shape;
      this.careAssessParams.weightOther = createAssessInfo.weightOther;
      this.careAssessParams.weight = createAssessInfo.weight;
      this.careAssessParams.comfort = createAssessInfo.comfort;
      this.careAssessParams.membrane = createAssessInfo.membrane;
      this.careAssessParams.circulation = createAssessInfo.circulation;
      this.careAssessParams.circulationOther =
        createAssessInfo.circulationOther;
      this.careAssessParams.morphology = createAssessInfo.morphology;
      this.careAssessParams.morphologyOther = createAssessInfo.morphologyOther;
      this.careAssessParams.respiration = createAssessInfo.respiration;
      this.careAssessParams.respirationOther =
        createAssessInfo.respirationOther;
      this.careAssessParams.rate = createAssessInfo.rate;
      this.careAssessParams.pee = createAssessInfo.pee;
      this.careAssessParams.peeOther = createAssessInfo.peeOther;
      this.careAssessParams.shit = createAssessInfo.shit;
      this.careAssessParams.shitOther = createAssessInfo.shitOther;
      this.careAssessParams.morphologic = createAssessInfo.morphologic;
      this.careAssessParams.morphologicOther =
        createAssessInfo.morphologicOther;
      this.careAssessParams.ability = createAssessInfo.ability;
      this.careAssessParams.abilityOther = createAssessInfo.abilityOther;
      this.careAssessParams.risk = createAssessInfo.risk;
      this.careAssessParams.riskOther = createAssessInfo.riskOther;
      this.careAssessParams.selfcognition = createAssessInfo.selfcognition;
      this.careAssessParams.homecognition = createAssessInfo.homecognition;
      this.careAssessParams.anaphylaxis = createAssessInfo.anaphylaxis;
      this.careAssessParams.history = createAssessInfo.history;
      this.careAssessParams.drugs = createAssessInfo.drugs;
      this.careAssessParams.carem = createAssessInfo.carem;
      this.careAssessParams.employeesName = createAssessInfo.employeesName;
      this.careAssessParams.oldman_id = createAssessInfo.oldman.id;
      this.saveContractParams.name = createAssessInfo.oldman.name;
      this.saveContractParams.birthYearMonth =
        createAssessInfo.oldman.birthYearMonth;
      this.saveContractParams.education = createAssessInfo.oldman.education;
      this.saveContractParams.admissionNo = createAssessInfo.oldman.admissionNo;
      this.saveContractParams.occupation = createAssessInfo.oldman.occupation;
      this.saveContractParams.sex = createAssessInfo.oldman.sex;
      this.saveContractParams.marriage = createAssessInfo.oldman.marriage;
      this.saveContractParams.nation = createAssessInfo.oldman.nation;
      this.saveContractParams.religion = createAssessInfo.oldman.religion;
      this.saveContractParams.religionMemo =
        createAssessInfo.oldman.religionMemo;
      this.stayDate = createAssessInfo.stayDate;
    }
  }

  // 保存
  save() {
    this.saveIsLoadingOne = true;
    this.careAssessParams.smokeOther = JSON.stringify(this.smokeOther);
    this.careAssessParams.wineOther = JSON.stringify(this.wineOther);
    this.careAssessParams.comfortOther = JSON.stringify(this.comfortOther);
    this.careAssessParams.membraneOther = JSON.stringify(this.membraneOther);
    this.careAssessParams.habits = JSON.stringify(this.habitsOther);
    this.careAssessParams.signs = JSON.stringify(this.signsOther);
    this.careAssessParams.careq = JSON.stringify(this.careq);
    this.careAssessParams.communication = JSON.stringify(this.communication);
    this.careAssessParams.anaphylaxisOther = JSON.stringify(
      this.anaphylaxisOther
    );

    // console.log(this.value)
    // this.careAssessParams.carem=this.value;
    console.log(this.careAssessParams.carem);
    if (this.stayDate == undefined) {
      this.careAssessParams.stayDate = "";
    } else {
      this.careAssessParams.stayDate = this.jsUtil.dateFormat(this.stayDate);
    }

    let param = this.httpReq.post(
      "/careAssessment/saveOrUpdate",
      null,
      this.careAssessParams,
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.saveIsLoadingOne = false;
            this.createMessage("success", "保存成功");
            this.careAssessParams.stayDate = "";
            this.stayDate;
            this.back();
          } else {
            this.saveIsLoadingOne = false;
            this.createMessage("error", data["message"]);
          }
        }
      }
    );
  }
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  // 返回
  back() {
    history.back();
  }
  //点击取消的事件
  cancel() {
    this.Braden = false;
  }
  BradenPingfen() {
    this.Braden = true;
  }
  //确定按钮计算总值
  sure() {
    this.isLoadingOne = true;
    if (
      this.membraneOther.radioValue == "" ||
      this.membraneOther.moist == "" ||
      this.membraneOther.mobility == "" ||
      this.membraneOther.locomotivity == "" ||
      this.membraneOther.nutrition == "" ||
      this.membraneOther.friction == ""
    ) {
      this.createMessage("error", "请选择分数");
      this.isLoadingOne = false;
    } else {
      this.isLoadingOne = false;
      this.membraneOther.BradenSum = JSON.stringify(
        parseInt(this.membraneOther.radioValue) +
          parseInt(this.membraneOther.moist) +
          parseInt(this.membraneOther.mobility) +
          parseInt(this.membraneOther.locomotivity) +
          parseInt(this.membraneOther.nutrition) +
          parseInt(this.membraneOther.friction)
      );
      this.cancel();
    }
  }

  /**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }

  /**
   * 显示老人选择对话框，并加载老人列表
   */
  showOldDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowOldDialog = true;
    this.loadingOldList();
  }
  /**
   * 加载老人列表
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
    let param = this.httpReq.post(
      "oldman/list1",
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
  /**
   * 老人选择对话框中选择了某个老人；
   */
  chooseOld(oldInfo) {
    this.isShowOldDialog = false;
    this.careAssessParams.oldman_id = oldInfo.id;
    this.saveContractParams.name = oldInfo.name;
    this.saveContractParams.birthYearMonth = oldInfo.birthYearMonth;
    this.saveContractParams.education = oldInfo.education;
    this.saveContractParams.admissionNo = oldInfo.admissionNo;
    this.saveContractParams.occupation = oldInfo.occupation;
    this.saveContractParams.sex = oldInfo.sex;
    this.saveContractParams.marriage = oldInfo.marriage;
    this.saveContractParams.inDate = oldInfo.inDate;
    this.saveContractParams.nation = oldInfo.nation;
    this.saveContractParams.religion = oldInfo.religion;
    this.saveContractParams.religionMemo = oldInfo.religionMemo;
  }
}
