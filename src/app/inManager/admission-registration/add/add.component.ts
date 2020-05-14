import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  //个人信息加载状态
  isPersonCardLoading = false;
  isHealthCardLoading = false;
  //保存健康按钮状态
  saveHealthBtnLoading = false;
  //保存个人信息按钮状态
  savePersonalBtnLoading = false;
  //显示咨询列表老人的对话框
  dialogStyle = {
    width: "800px",
    padding: "0 0 100px"
  };
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
  };
  //老年人选择对话框检索
  searchOldName = "";
  //老年人列表table加载状态
  isOldTableLoading = false;
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };

  registration;
  userInfo;

  tabIndex = 0;

  listOfDrugs = [];
  isLoading = false;

  validateForm: FormGroup;

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
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private fb: FormBuilder,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {
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
  }

  registrationId;

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
          if (data["code"] == 0) {
            that.registration = JSON.parse(data["data"]);
            console.log(this.registration);
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
            if (that.registration.DrugUse.DrugRecord instanceof Array) {
              for (
                let i = 0;
                i < that.registration.DrugUse.DrugRecord.length;
                i++
              ) {
                let drugRecord = that.registration.DrugUse.DrugRecord[i];
                that.registration.DrugUse.DrugRecord[i].usagesArray = [
                  drugRecord.usages
                ];
                that.registration.DrugUse.DrugRecord[i].frequencyArray = [
                  drugRecord.frequency
                ];
              }
            }
          }
        }
      );
    } else {
      this.registration.personnelSort = "社会代养";
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
    if (this.registration.religion === "无") {
      this.registration.religionMemo = "";
    }
  }

  onMedicalPaymentChange(value) {
    if (this.registration.medicalPayment !== "其他") {
      this.registration.medicalPaymentMemo = "";
    }
  }

  onPersonnelSortChange(value) {
    if (this.registration.personnelSort === "社会代养") {
      this.registration.personnelSortMemo = "";
    }
  }

  onDrugAllergyChange(value) {
    if (value == 0) {
      // alert(value);
      this.registration.DrugUse.drugMemo.forEach(e => {
        e.checked = false;
      });
      this.registration.DrugUse.drugMemoOther = "";
    }
  }

  onDrugMemoChange(value: string[]): void {
    this.registration.DrugUse.drugMemo.forEach(e => {
      if (!e.checked) {
        this.registration.DrugUse.drugMemoOther = "";
      }
    });
  }

  back() {
    history.back();
  }

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
    this.registration.birthYearMonth = this.jsUtil.dateFormat(
      this.registration.birthYearMonth
    );
    if (this.registration.id) {
      this.registration.modifier = this.userInfo.name;
      const that = this;
      this.httpService.post(
        "oldman/updateFirst",
        null,
        this.registration,
        data => {
          that.savePersonalBtnLoading = false;
          if (data["status"] == 200) {
            that.savePersonalBtnLoading = false;
            that.message.success("保存成功！");
          }
        }
      );
    } else {
      this.registration.noteTaker = this.userInfo.name;
      const that = this;
      this.httpService.post(
        "oldman/saveFirst",
        null,
        this.registration,
        data => {
          that.savePersonalBtnLoading = false;
          if (data["status"] == 200) {
            that.message.success("保存成功！");
            that.registration.id = data["data"].id;
          }
        }
      );
    }
  }

  onSaveHealthInfo() {
    if (this.registration.DrugUse.DrugRecord) {
      for (let i = 0; i < this.registration.DrugUse.DrugRecord.length; i++) {
        let drugRecord = this.registration.DrugUse.DrugRecord[i];
        if (drugRecord.usagesArray && drugRecord.usagesArray.length > 0) {
          drugRecord.usages = drugRecord.usagesArray[0];
        }

        if (drugRecord.frequencyArray && drugRecord.frequencyArray.length > 0) {
          drugRecord.frequency = drugRecord.frequencyArray[0];
        }
      }
    }

    this.registration.modifier = this.userInfo.name;
    this.saveHealthBtnLoading = true;
    const that = this;
    this.httpService.post(
      "oldman/updateSecond",
      null,
      this.registration,
      data => {
        this.saveHealthBtnLoading = false;
        this.message.success("保存成功！");
        this.back();
      }
    );
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.registration.Contacts.length > 0
        ? this.registration.Contacts[this.registration.Contacts.length - 1].id +
          1
        : 0;

    const jiatingchengyuan = {
      name: "",
      relationship: "",
      address: "",
      phone: "",
      isEmergencyContact: false
    };
    // const index = this.registrationContactsList.push(jiatingchengyuan);

    this.registration.Contacts = [
      ...this.registration.Contacts,
      jiatingchengyuan
    ];
    // console.log(this.registration.Contacts[this.registration.Contacts.length - 1]);
    // console.log(this.registration.Contacts);
  }

  removeField(
    i: {
      name: string;
      relationship: string;
      address: string;
      phone: string;
      isEmergencyContact: boolean;
    },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.registration.Contacts.length > 0) {
      // const index = this.registrationContactsList.indexOf(i);
      // this.registrationContactsList.splice(index, 1);

      this.registration.Contacts = this.registration.Contacts.filter(
        d => d !== i
      );
      // console.log(this.registration.Contacts);
    }
  }

  addDrug(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    if (!this.registration.DrugUse.DrugRecord) {
      this.registration.DrugUse.DrugRecord = [];
    }
    let drugList = this.registration.DrugUse.DrugRecord;

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

    this.registration.DrugUse.DrugRecord = [...drugList, drug];
    // console.log(this.registration.DrugUse.DrugRecord);
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
    let drugList = this.registration.DrugUse.DrugRecord;
    if (drugList.length > 0) {
      // const index = this.drugList.indexOf(i);
      // this.drugList.splice(index, 1);

      this.registration.DrugUse.DrugRecord = drugList.filter(d => d !== i);
      // console.log(this.registration.DrugUse.DrugRecord);
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
    console.log(oldInfo);
    console.log(this.registration);
    if (oldInfo != null) {
      this.getInterviewInfo(oldInfo.id);
      // this.registration.name = oldInfo;
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
      "interview/pagelist",
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
   * 获取调防中的详情信息
   */
  getInterviewInfo(interviewId) {
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
            console.log(that.registration);
            let interviewInfo = JSON.parse(data["data"]);

            that.registration.education = interviewInfo.education;
            that.registration.occupation = interviewInfo.occupation;
            that.registration.nation = interviewInfo.nation;
            that.registration.political = interviewInfo.political;
            that.registration.birthYearMonth = interviewInfo.birthYearMonth;
            that.registration.bedName = interviewInfo.bedName;
            that.registration.medicalPayment = interviewInfo.medicalPayment;
            that.registration.medicalPaymentMemo =
              interviewInfo.medicalPaymentMemo;
            that.registration.medicalCard = interviewInfo.medicalCard;
            that.registration.personnelSort = interviewInfo.personnelSort;
            that.registration.marriage = interviewInfo.marriage;
            that.registration.hopy = interviewInfo.hopy;
            that.registration.address = interviewInfo.address;
            that.registration.personnelSortMemo =
              interviewInfo.personnelSortMemo;
            that.registration.sex = interviewInfo.sex;
            that.registration.bedId = interviewInfo.bedId;
            that.registration.cardno = interviewInfo.cardno;
            that.registration.cultivation = interviewInfo.cultivation;
            that.registration.religion = interviewInfo.religion;
            that.registration.religionMemo = interviewInfo.religionMemo;
            that.registration.phone = interviewInfo.phone;
            that.registration.name = interviewInfo.name;
            that.registration.nativePlace = interviewInfo.nativePlace;

            that.registration.livingSituation = interviewInfo.livingSituation;
            that.registration.financialResources =
              interviewInfo.financialResources;

            if (interviewInfo.InterviewEconomicProvider != undefined) {
              that.registration.EconomicProvider =
                interviewInfo.InterviewEconomicProvider;
            }

            if (interviewInfo.InterviewContacts != undefined) {
              that.registration.Contacts = interviewInfo.InterviewContacts;
            }

            that.registration.HealthHistory = {};
            that.registration.DrugUse = {};

            if (interviewInfo.InterviewHealthHistory != null) {
              that.registration.HealthHistory =
                interviewInfo.InterviewHealthHistory;
            }
            if (interviewInfo.InterviewDrugUse != undefined) {
              that.registration.DrugUse = interviewInfo.InterviewDrugUse;

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

              if (
                interviewInfo.InterviewDrugUse.InterviewDrugRecord != undefined
              ) {
                that.registration.DrugUse.DrugRecord =
                  interviewInfo.InterviewDrugUse.InterviewDrugRecord;
                for (
                  let i = 0;
                  i < that.registration.DrugUse.DrugRecord.length;
                  i++
                ) {
                  let drugRecord = that.registration.DrugUse.DrugRecord[i];
                  that.registration.DrugUse.DrugRecord[i].usagesArray = [
                    drugRecord.usages
                  ];
                  that.registration.DrugUse.DrugRecord[i].frequencyArray = [
                    drugRecord.frequency
                  ];
                }
              }
            }
          }
        }
      );
    }
  }
}
