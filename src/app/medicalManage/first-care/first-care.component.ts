import { Component, OnInit, Input, ElementRef, Renderer } from "@angular/core";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { LocalStorage } from "src/app/common/service/local.storage";
@Component({
  selector: "app-first-care",
  templateUrl: "./first-care.component.html",
  styleUrls: ["./first-care.component.css"]
})
export class FirstCareComponent implements OnInit {
  @Input() inHospitalInfoId;
  formData = {
    id: "",
    inHospitalInfoId: "",
    sectionOfficeName: "", //科别
    sickWardName: "", //病区
    bedNumber: "", //床号
    inHospitalDate: "", //入院时间
    inHospitalNumber: "", //住院号
    // 一般资料
    name: "", //姓名
    sex: "", //性别
    age: "", //年龄
    profession: "", //职业
    nation: "", //民族
    nativePlace: "", //籍贯
    marriage: "", //婚姻
    education: "", //文化程度
    contactAddress: "", //联系地址【电话】
    dataCollectionDate: "", //资料收集时间
    inHospitalDispose: [
      //入院处置
      { label: "沐浴", value: "沐浴" },
      { label: "更衣", value: "更衣" },
      { label: "未处理", value: "未处理" }
    ],
    inHospitalWay: [
      //入院方式
      { label: "步行", value: "步行" },
      { label: "扶走", value: "扶走" },
      { label: "轮椅", value: "轮椅" },
      { label: "平车", value: "平车" },
      { label: "担架", value: "担架" },
      { label: "背入", value: "背入" }
    ],
    inHospitalIntroduce: [
      //入院介绍
      { label: "住院须知", value: "住院须知" },
      { label: "对症宣教", value: "对症宣教" },
      { label: "饮食", value: "饮食" },
      { label: "作息", value: "作息" },
      { label: "探陪", value: "探陪" },
      { label: "卫生", value: "卫生" },
      { label: "物资管理", value: "物资管理" }
    ],
    medicalDiagnosis: "", //入院医疗诊断
    allergicHistory: "", //过敏史
    allergicHistory2: [
      //过敏史2
      { label: "药物", value: "药物" },
      { label: "食物", value: "食物" },
      { label: "其他", value: "其他" }
    ],
    previousHistory: "", //既往史
    previousHistory2: [
      //既往史2
      { label: "高血压", value: "高血压" },
      { label: "冠心病", value: "食物冠心病" },
      { label: "糖尿病", value: "糖尿病" },
      { label: "精神病", value: "精神病" },
      { label: "肿瘤", value: "肿瘤" },
      { label: "遗传", value: "遗传" },
      { label: "其他", value: "其他" }
    ],
    dietaryHabit: [
      // 饮食习惯
      { label: "米面", value: "米面" },
      { label: "高蛋白", value: "高蛋白" },
      { label: "高碳水化合物", value: "高碳水化合物" },
      { label: "高脂肪", value: "高脂肪" },
      { label: "素食", value: "素食" },
      { label: "偏食", value: "偏食" },
      { label: "忌食", value: "忌食" },
      { label: "其他", value: "其他" }
    ],
    appetite: "", //食欲
    appetite2: "", //食欲2
    appetite3: "", //食欲3
    dysmasesia: "", //咀嚼困难
    dysmasesia2: "", //咀嚼困难原因
    dysphagia: "", //吞咽困难
    dysphagia2: "", //吞咽困难原因
    sleep: [
      //睡眠
      { label: "正常", value: "正常" },
      { label: "入睡困难", value: "入睡困难" },
      { label: "易睡", value: "易睡" },
      { label: "多梦", value: "多梦" },
      { label: "失眠", value: "失眠" }
    ],
    sleepAid: "", //辅助睡眠
    shit: "", // 大便
    shit2: "", // 大便 天
    shit3: "", // 大便 次
    pee: "", // 小便
    pee2: [
      { label: "尿路中断", value: "尿路中断" },
      { label: "尿频", value: "尿频" },
      { label: "尿急", value: "尿急" },
      { label: "尿痛", value: "尿痛" },
      { label: "留置导尿", value: "留置导尿" }
    ], // 小便 症状
    pee3: "", // 小便 次
    pee4: "", // 小便 色
    abilityOfSelf: "", //自理能力
    abilityOfSelf2: [
      //自理能力2
      { label: "进食", value: "进食" },
      { label: "排便", value: "排便" },
      { label: "洗漱", value: "洗漱" },
      { label: "穿着", value: "穿着" },
      { label: "床上运动", value: "床上运动" },
      { label: "其他", value: "其他" }
    ],
    activityOfLiving: "", // 活动能力
    activityOfLiving2: [
      { label: "自行翻身", value: "自行翻身" },
      { label: "辅助翻身", value: "辅助翻身" }
    ], // 活动能力2
    healthConsciousness: "", //健康意识
    healthConsciousness2: "", //健康意识2
    smoking: "", //吸烟
    drink: "", //饮酒
    psychologicalStates: [
      //心理状态
      { label: "健康", value: "健康" },
      { label: "悲哀", value: "悲哀" },
      { label: "易激动", value: "易激动" },
      { label: "焦虑", value: "焦虑" },
      { label: "恐惧", value: "恐惧" },
      { label: "孤独", value: "孤独" },
      { label: "沮丧", value: "沮丧" },
      { label: "欣快", value: "欣快" },
      { label: "无反应", value: "无反应" }
    ],
    socialCompetence: "", //社会能力
    inHospitalScruple: "", //住院顾虑
    inHospitalScruple2: [
      //住院顾虑2
      { label: "经济问题", value: "经济问题" },
      { label: "自理能力", value: "自理能力" },
      { label: "角色改变", value: "角色改变" },
      { label: "其他", value: "其他" }
    ],
    children: "", // 子女
    children2: "", // 子女
    children3: "", // 子女
    letterT: "", // T
    letterP: "", // P
    letterR: "", // R
    letterBP: "", // BP
    letterBP2: "", // BP2
    weight: "", // 体重
    mind: [
      // 神志
      { label: "清楚", value: "清楚" },
      { label: "恍惚", value: "恍惚" },
      { label: "模糊", value: "模糊" },
      { label: "嗜睡", value: "嗜睡" },
      { label: "昏迷", value: "昏迷" }
    ],
    face: "", // 表情
    pupil: "", // 瞳孔
    pupil2: "", // 瞳孔
    pupil3: "", // 瞳孔
    lightReflex: "", // 对光反射
    nutriture: [
      // 全身营养状况
      { label: "良好", value: "良好" },
      { label: "中等", value: "中等" },
      { label: "欠佳", value: "欠佳" },
      { label: "肥胖", value: "肥胖" },
      { label: "消瘦", value: "消瘦" },
      { label: "恶病质", value: "恶病质" }
    ],
    skinAndMucosa: [
      //皮肤粘膜
      { label: "正常", value: "正常" },
      { label: "黄染", value: "黄染" },
      { label: "紫钳", value: "紫钳" },
      { label: "水肿", value: "水肿" },
      { label: "潮红", value: "潮红" },
      { label: "失水", value: "失水" },
      { label: "皮疹", value: "皮疹" },
      { label: "褥疮", value: "褥疮" }
    ],
    skinAndMucosa2: "", //皮肤粘膜
    facialFeatures: [
      // 五官功能
      { label: "正常", value: "正常" },
      { label: "口眼歪斜", value: "口眼歪斜" },
      { label: "失明", value: "失明" },
      { label: "右", value: "眼右" },
      { label: "左", value: "眼左" },
      { label: "失聪", value: "失聪" },
      { label: "右", value: "耳右" },
      { label: "左", value: "耳左" },
      { label: "失语", value: "失语" }
    ],
    oralCavity: [
      // 口腔
      { label: "正常", value: "正常" },
      { label: "溃疡", value: "溃疡" },
      { label: "假膜", value: "假膜" },
      { label: "出诊", value: "出诊" }
    ],
    tongue: [
      // 舌
      { label: "正常", value: "正常" },
      { label: "偏斜", value: "偏斜" },
      { label: "震颤", value: "震颤" }
    ],
    gingiva: [
      // 牙龈
      { label: "正常", value: "正常" },
      { label: "红肿", value: "红肿" },
      { label: "出血", value: "出血" },
      { label: "溃疡", value: "溃疡" }
    ],
    tooth: "", // 牙
    woundCondition: "", // 伤口情况
    degreeOfComfort: "", // 舒适程度
    degreeOfComfort2: "", // 疼痛部位
    degreeOfComfort3: "", // 程度
    otherStr: "", // 其他
    nurseSignature: "", // 责任护士签名
    headNurseSignature: "" // 护士长签名
  };
  clientData: Object;
  printCSS = [];
  systemInfo; //系统信息
  public isDisable: boolean = false; // 是否禁用

  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private el: ElementRef, // 获取DOM元素对象
    private renderer: Renderer, // 对DOM进行操作
    private modalService: NzModalService, //提示
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // console.log(this.clientData);
    let paramsStr = this.actRoute.snapshot.queryParams["data"];
    if(paramsStr) this.clientData = JSON.parse(paramsStr);
    console.log("tag", this.clientData);
    this.printCSS = [
      "assets/css/common.css",
      "assets/css/first-care-print.css"
    ];
    this.getFormInfo();
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
  }

  // 资料收集时间日期选择
  onDateChange(result: Date): void {
    console.log("onChange: ", result);
    let y: any = result.getFullYear();
    let m: any = result.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d: any = result.getDate();
    d = d < 10 ? "0" + d : d;
    let sleTime = y + "-" + m + "-" + d;
    this.formData.dataCollectionDate = sleTime;
  }

  lookFormData() {
    console.log(this.formData);
  }

  log(value: object[]): void {
    console.log(value);
  }
  enterDiagnose(diagnoseInfo) {
    console.log(diagnoseInfo.length);
  }

  // 对所有 无or有 选项
  // checkbox选中 ---> 有
  changeHaveOrNo(value, name) {
    if (
      value.some(item => {
        return item.checked == true;
      })
    ) {
      this.formData[name] = "有";
    } else {
      this.formData[name] = "";
    }
  }
  // 无 ---> checkbox清空
  removaAllCheck(value, name) {
    if ((value = "无")) {
      this.formData[name].forEach(item => {
        delete item["checked"];
      });
    }
  }

  // 食欲
  changeAppetite() {
    if (this.formData.appetite == "亢进") this.formData.appetite3 = "";
    else if (this.formData.appetite == "下降/厌食")
      this.formData.appetite2 = "";
  }

  // radio 选择 无 置空formData某字符串
  selNone(noneObj, name) {
    if (noneObj == "无") this.formData[name] = "";
  }

  // 键入原因 radio ---> '有'
  radioChangeToYes(name) {
    this.formData[name] = "有";
  }

  // 大便
  shitChange(status) {
    if (status == "正常" || status == "失禁" || status == "其他") {
      this.formData.shit2 = "";
      this.formData.shit3 = "";
    }
  }
  noShit() {
    this.formData.shit = "便秘";
    this.formData.shit3 = "";
  }
  lotShit() {
    this.formData.shit = "腹泻";
    this.formData.shit2 = "";
  }

  // 小便
  peeChange(peeStatus) {
    if (peeStatus)
      this.formData.pee2.forEach(item => {
        delete item["checked"];
      });
  }
  peeChange2(peeStatus) {
    if (
      peeStatus.some(item => {
        return item.checked == true;
      })
    )
      this.formData.pee = "";
  }

  // 自理能力
  abilityOfSelfChange(abilityStatus) {
    if (abilityStatus == "全部" || abilityStatus == "障碍")
      this.formData.abilityOfSelf2.forEach(item => {
        delete item["checked"];
      });
  }
  abilityOfSelfChange2(abilityStatus) {
    if (
      abilityStatus.some(item => {
        return item.checked == true;
      })
    )
      this.formData.abilityOfSelf = "需协助";
  }

  // 活动能力
  activityOfLivingChange(activityOfLivingStatus) {
    if (
      activityOfLivingStatus == "下床活动" ||
      activityOfLivingStatus == "坐椅子"
    )
      this.formData.activityOfLiving2.forEach(item => {
        delete item["checked"];
      });
  }
  activityOfLivingChange2(activityOfLivingStatus) {
    if (
      activityOfLivingStatus.some(item => {
        return item.checked == true;
      })
    )
      this.formData.activityOfLiving = "卧床";
  }

  // 健康意识
  healthConsciousnessChange(healthConsciousnessStatus) {
    if (
      healthConsciousnessStatus == "良好" ||
      healthConsciousnessStatus == "一般"
    )
      this.formData.healthConsciousness2 = "";
  }
  healthConsciousnessChange2() {
    this.formData.healthConsciousness = "差";
  }

  // 子女
  childrenChange(childrenStatus) {
    if (childrenStatus == "无") {
      this.formData.children2 = "";
      this.formData.children3 = "";
    }
  }
  childrenChange2() {
    this.formData.children = "有";
  }

  // 瞳孔
  pupilChange(pupilStatus) {
    if (pupilStatus !== "不等大") {
      this.formData.pupil2 = "";
      this.formData.pupil3 = "";
    }
  }
  pupilChange2() {
    this.formData.pupil = "不等大";
  }

  // 舒适程度
  degreeOfComfortChange(degreeOfComfortStatus) {
    if (degreeOfComfortStatus !== "疼痛") this.formData.degreeOfComfort2 = "";
  }
  degreeOfComfortChange2() {
    this.formData.degreeOfComfort = "疼痛";
  }

  // 获取表单信息
  getFormInfo() {
    // {"inHospitalInfoId": "入院信息ID"}
    let inHospitalInfoId = this.inHospitalInfoId || this.clientData["inHospitalInfo"]["id"];
    this.httpReq.post(
      "recordOfFirstCare/getMessage",
      null,
      { inHospitalInfoId: inHospitalInfoId },
      data => {
        if (data.code == "0") {
          if (!data.data.isHave) {
            // 首次填写 基本信息赋值
            let inHospitalInfo = data.data.inHospitalInfo;
            let basicInfo = inHospitalInfo.basicInfo;
            this.formData.sectionOfficeName = inHospitalInfo.sectionOffice.name
              ? inHospitalInfo.sectionOffice.name
              : "";
            this.formData.sickWardName = inHospitalInfo.sickWard.sickWardName
              ? inHospitalInfo.sickWard.sickWardName
              : "";
            this.formData.bedNumber = inHospitalInfo.bedName
              ? inHospitalInfo.bedName
              : "";
            this.formData.inHospitalDate = inHospitalInfo.admissionDate
              ? inHospitalInfo.admissionDate.substr(0, 10)
              : "";
            this.formData.inHospitalNumber = inHospitalInfo.admissionNo
              ? inHospitalInfo.admissionNo
              : "";
            this.formData.name = basicInfo.name;
            this.formData.sex = basicInfo.sex == "0" ? "男" : "女";
            this.formData.age = basicInfo.age;
            this.formData.profession = basicInfo.occupation;
            this.formData.nation = basicInfo.nation;
            this.formData.marriage = basicInfo.marriage;
          } else {
            // console.log(JSON.parse(data.data.recordOfFirstCare.inHospitalWay));
            let getForm = data.data.recordOfFirstCare;
            getForm.inHospitalDate = getForm.inHospitalDate.substr(0, 10);
            getForm.inHospitalDispose = JSON.parse(getForm.inHospitalDispose);
            getForm.inHospitalWay = JSON.parse(getForm.inHospitalWay);
            getForm.inHospitalIntroduce = JSON.parse(
              getForm.inHospitalIntroduce
            );
            getForm.allergicHistory2 = JSON.parse(getForm.allergicHistory2);
            getForm.previousHistory2 = JSON.parse(getForm.previousHistory2);
            getForm.dietaryHabit = JSON.parse(getForm.dietaryHabit);
            getForm.sleep = JSON.parse(getForm.sleep);
            getForm.pee2 = JSON.parse(getForm.pee2);
            getForm.abilityOfSelf2 = JSON.parse(getForm.abilityOfSelf2);
            getForm.activityOfLiving2 = JSON.parse(getForm.activityOfLiving2);
            getForm.psychologicalStates = JSON.parse(
              getForm.psychologicalStates
            );
            getForm.inHospitalScruple2 = JSON.parse(getForm.inHospitalScruple2);
            getForm.mind = JSON.parse(getForm.mind);
            getForm.nutriture = JSON.parse(getForm.nutriture);
            getForm.skinAndMucosa = JSON.parse(getForm.skinAndMucosa);
            getForm.facialFeatures = JSON.parse(getForm.facialFeatures);
            getForm.oralCavity = JSON.parse(getForm.oralCavity);
            getForm.tongue = JSON.parse(getForm.tongue);
            getForm.gingiva = JSON.parse(getForm.gingiva);
            this.formData = getForm;
          }
        }
      }
    );
  }

  // 保存表单
  saveForm() {
    this.formData.inHospitalInfoId = this.clientData["inHospitalInfo"]["id"];
    this.httpReq.post(
      "recordOfFirstCare/addOrEdit",
      null,
      this.formData,
      data => {
        if (data.code == 0) {
          this.message.success("保存成功！");
          this.getFormInfo();
        }
      }
    );
  }

  // 打印
  printComplete() {
    // alert('完成打印！')
  }

  ngAfterContentChecked(): void {
    const loginUser = this.localStorage.getUser();
    const personType = loginUser["data"]["employees"]["personType"];
    if (personType == "0") {
      // 医生
      this.isDisable = true;
      this.toggleDisable(true);
    } else if (personType == "2") {
      // 护士
      this.isDisable = false;
      this.toggleDisable(false);
    }
  }

  /**
   * 切换是否禁用的状态
   * @param {boolean} state false 不禁用，true 禁用
   * @memberof MedicalRecordComponent
   */
  public toggleDisable(state: boolean) {
    if (state) {
      this.el.nativeElement.querySelectorAll("input").forEach(element => {
        this.renderer.setElementAttribute(element, "disabled", "true");
        this.renderer.setElementClass(element, "ant-input-disabled", true);
      });
    }
  }
}
