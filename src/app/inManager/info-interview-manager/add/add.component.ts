import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "../../../../../node_modules/ng-zorro-antd";
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

  interview;
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

            if (!that.interview.InterviewDrugUse.drugMemo) {
              that.interview.InterviewDrugUse.drugMemo = DrugMemoDefault;
            } else {
              that.interview.InterviewDrugUse.drugMemo = JSON.parse(
                that.interview.InterviewDrugUse.drugMemo
              );
            }

            //页面select返回的数据为数组，此处需要转换成数组；
            if (
              that.interview.InterviewDrugUse.InterviewDrugRecord instanceof
              Array
            ) {
              for (
                let i = 0;
                i < that.interview.InterviewDrugUse.InterviewDrugRecord.length;
                i++
              ) {
                let drugRecord =
                  that.interview.InterviewDrugUse.InterviewDrugRecord[i];
                that.interview.InterviewDrugUse.InterviewDrugRecord[
                  i
                ].usagesArray = [drugRecord.usages];
                that.interview.InterviewDrugUse.InterviewDrugRecord[
                  i
                ].frequencyArray = [drugRecord.frequency];
              }
            }

            console.log(this.interview);
          }
        }
      );
    } else {
      this.interview.personnelSort = "社会代养";
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
    console.log(this.interview);
    this.interview.birthYearMonth = this.jsUtil.dateFormat(
      this.interview.birthYearMonth
    );
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
          }
        }
      );
    }
  }

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
