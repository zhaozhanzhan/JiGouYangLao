import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, MentionOnSearchTypes } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";
import { ServeConfigService } from "../../../../common/config/serve-config.service";
import { GlobalService } from "../../../../common/service/GlobalService";
import { EntrustMedicineService } from "../../entrust-medicine.service";
import { ENgxPrintComponent } from "e-ngx-print";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-detail-trust",
  templateUrl: "./detail-trust.component.html",
  styleUrls: ["./detail-trust.component.css"]
})
export class DetailTrustComponent implements OnInit {
  addMedOutBoxForm: FormGroup; // 药品弹框表单对象
  stopMedOutBoxForm2: FormGroup; // 停用药品弹框表单对象
  olderInfo = {
    name: '',
    sex: '',
    age: '',
    bedNum: '',
    room: ''
  }; // 老人信息
  olderId = ""; // 老人id
  timer: any; // 定时器
  medList: any[] = []; //未存到数据库中得服用药品列表
  takeList: any[] = []; //请求数据库中得服用药品列表
  addMedzIndexModel = false; // 查看详情model遮罩
  addMedEdit: boolean = false; // 添加药品弹框是否编辑模式
  addMedChange: boolean = false; // 添加药品弹框变更药品 非变更项是否显示
  editMedIndex: number = NaN; // 要编辑的本地数据的index
  MedId = ""; // 要变更的药品id;
  addTakeIsVisible = false; //是否显示添加服用药品弹出框
  stopTakeIsVisible = false; //是否显示停服药品弹出框
  takeMedLoading = false; //服药tab列表时得等待状态
  stopTakeMedLoading = false; // 停药 tab Loading
  entrustRecordLoading = false; // 委托记录 tab Loading
  takeMedRecordLoading = false; // 服药记录 tab Loading
  addTakeOkLoading = false; // 加药弹框 ok Loading
  stopTakeOkLoading = false; // 停服弹框 ok Loading
  boxLoading = false; // Loading
  inputSuggestLoading = false; // 药品搜索loading
  stopTakeList: any[] = []; //停服药品列表
  recordTakeList: any[] = []; //委托药品列表
  medicineTakeList: any[] = []; //服药记录列表
  medFrequencyLisy: Array<Object> = []; // 选择药品频次列表
  medNameList: Array<Object> = []; // 药品名称列表
  // 停用药品弹框
  stopMedOutBoxForm = {
    // {"id":"药品Id","userName":"登录人姓名","operator":"操作人","familyMember":"家属名字","stopRemark":"停用原因"}
    id: "",
    userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
    operator: "",
    familyMember: "",
    stopRemark: ""
  };
  // 获取停用药品列表参数
  stopMedListTotalElements; // 列表条数
  stopMedListSendData = {
    // {"id":"老人委托登记Id","page":"页数","size":"每页数量"}
    id: "",
    page: 0,
    size: 20
  };
  // 获取委托记录列表参数
  entrustRecordListTotalElements; // 列表条数
  entrustRecordSendData = {
    // {"id":"老人委托登记Id","page":"页数","size":"每页数量"}
    id: "",
    page: 0,
    size: 20
  };
  // 获取服药记录列表参数
  takeMedRecordTotalElements; // 列表条数
  takeMedRecordSendData = {
    // {"id":"老人委托登记Id","page":"页数","size":"每页数量"}
    id: "",
    page: 0,
    size: 20
  };

  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = [
    "assets/css/common.css",
    "assets/css/ng-zorro-antd.min.css"
  ]; // 打印内容css文件路径
  public printStyle: string = `:host /deep/ .ant-table-placeholder {
        border: 0px solid transparent !important;
    }

  `;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private message: NzMessageService,
    private entrustService: EntrustMedicineService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    // 接收参数
    this.olderInfo = JSON.parse(this.route.snapshot.paramMap.get("data"));
    this.olderId = this.olderInfo["id"];
    // 获取服药列表
    this.getTakeMedList();
    // 获取停服列表
    this.getStopTakeMedList();
    // 获取委托记录列表
    this.getEntrustRecordList();
    // 获取服药记录列表
    this.getTakeMedRecordList();

    // 添加药品弹框填表信息
    this.addMedOutBoxForm = this.fb.group({
      medName: ['', [Validators.required]],//	String	*药品名称
      commonName: [''],//	String	简称
      standard: [''],//	String	规格
      familyMember: ['', [Validators.required]],//	String	送药家属姓名                                        主
      medTotal: ['', [Validators.required,Validators.pattern(/^\d+(\.\d{0,2})?$/)]],//	number	*药品总量       主
      dosage: ['', [Validators.required,Validators.pattern(/^\d+(\.\d{0,2})?$/)]],//	number	*剂量             主
      frequency: ['', [Validators.required]],//	String	*频次                                                   主
      takeMedTime: ['', [Validators.required]],//	String	*0餐前1餐后                                            主
      limitDate: ['', [Validators.required]],//	String	*服用期限                                                主
      familyMember2: [''],//	String	送药家属姓名                                                               辅
      medTotal2: [''],//	number	*药品总量                                                                      辅
      dosage2: [''],//	number	*剂量                                                                            辅
      frequency2: [''],//	String	*频次                                                                          辅
      takeMedTime2: [''],//	String	*0餐前1餐后                                                                   辅
      limitDate2: [''],//	String	*服用期限                                                                       辅
      showFrequencyTag: [''],// 展示频次字段
      limitDateMark: [''],//	String	*服用期限时间戳
      receiveDate: [''],//	String	接收时间
      receiveDateMark: [new Date()],//	String	接收时间时间戳
      effect: [''],//	String	作用
      remark: [''],//	String	备注
      receiveMan: [''],//	String	收药人
      checkoutMan: [''] //	String	验收人
    });

    // 停药弹框表单
    this.stopMedOutBoxForm2 = this.fb.group({
      operator: ["", [Validators.required]],
      familyMember: ["", [Validators.required]],
      stopRemark: ["", [Validators.required]]
    });
  }

  // 返回
  back() {
    window.history.back();
  }
  
  // 选择药品辅助方法
  profix(el:HTMLElement){
    el.click();
  }

  isShowOper = true; //打印时是否显示操作内容
  
  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof MedicalRecordComponent
   */
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.isPrintNow = true; // 正在打印
    this.isShowOper = false; // 是否显示操作列
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isPrintNow = false;
    this.isShowOper = true; // 是否显示操作列
  }
  // 请求老人 服药列表
  getTakeMedList() {
    this.takeMedLoading = true;
    this.httpReq.post(
      "dtOldman/medInUseList",
      null,
      { id: this.olderId },
      data => {
        this.takeMedLoading = false;
        if (data.code == 0) {
          this.takeList = data["data"];
        }
      }
    );
  }

  // 点击添加时，弹出药品详情弹出框
  add() {
    // 获取频次选择项
    this.entrustService.getMedFrequency(data => {
      if (data.code == 0) this.medFrequencyLisy = data["data"][0]["ddList"];
    });
    this.onDateChange(new Date(), "receiveDate"); // 默认接受时间
    this.addMedEdit = false; // 非编辑模式
    this.addTakeIsVisible = true;
  }

  // 添加服用药品详情确定操作
  addTakeOk() {
    // 判断表单是否合法
    let could = true;
    for (const i in this.addMedOutBoxForm.controls) {
      this.addMedOutBoxForm.controls[i].markAsDirty();
      this.addMedOutBoxForm.controls[i].updateValueAndValidity();
      if (this.addMedOutBoxForm.controls[i].status == "INVALID") {
        // return 出现非法字段立即停止
        could = false;
      }
    }
    if (!could) return; // 未验证通过
    this.addTakeOkLoading = true; // 确认按钮loading
    if (this.addMedEdit) {
      // 编辑模式
      this.medList.splice(
        this.editMedIndex,
        1,
        JSON.parse(JSON.stringify(this.addMedOutBoxForm.value))
      );
    } else {
      // 添加模式 合法 加进待提交数组
      this.medList.unshift(
        JSON.parse(JSON.stringify(this.addMedOutBoxForm.value))
      );
    }

    // 重置表单
    this.addMedOutBoxForm.reset();
    this.addTakeIsVisible = false;
    this.addTakeOkLoading = false;
  }

  // 变更药品
  changeMedOk() {
    // 判断表单是否合法
    if (!this.addMedOutBoxForm.touched) {
      this.addTakeCancel();
      return;
    }
    let could = true;
    for (const i in this.addMedOutBoxForm.controls) {
      this.addMedOutBoxForm.controls[i].markAsDirty();
      this.addMedOutBoxForm.controls[i].updateValueAndValidity();
      if (this.addMedOutBoxForm.controls[i].status == "INVALID") {
        // return 出现非法字段立即停止
        could = false;
      }
    }
    if (!could) return; // 未验证通过
    this.boxLoading = true; // loading遮罩
    this.addTakeOkLoading = true; // 确认按钮loading
    let sendData = JSON.parse(JSON.stringify(this.addMedOutBoxForm.value));
    sendData["id"] = this.MedId;
    sendData["userName"] = JSON.parse(
      localStorage.getItem("UserInfo")
    ).data.name;
    this.httpReq.post("dtOldman/medChange", null, sendData, data => {
      if (data.code == 0) {
        this.message.success("变更成功");
        this.addMedOutBoxForm.reset();
        this.getTakeMedList();
        this.addTakeIsVisible = false;
        this.addMedChange = false;
      }
      this.addTakeOkLoading = false;
      this.boxLoading = false;
    });
  }

  // 添加服用药品详情取消操作
  addTakeCancel() {
    this.addTakeIsVisible = false; //
    this.addMedzIndexModel = false; // 去除遮罩
    this.addMedChange = false; // 变更限制输入
    this.addMedOutBoxForm.reset();
  }

  // 点击停服时，弹出停服药品弹出框，填写停服药品原因，停服药品输入框清空
  // id是需要停止得药品这条记录得ID
  stop(id, medData) {
    this.stopMedOutBoxForm.id = id;

    // 药品详情表单赋值
    let copyMedData = JSON.parse(JSON.stringify(medData));
    this.entrustService.getMedFrequency(data => {
      if (data.code == 0) {
        this.medFrequencyLisy = data["data"][0]["ddList"];
        this.medFrequencyLisy.forEach(item => {
          if (item["dictTag"] == copyMedData["frequency"]) {
            copyMedData.frequency = item["dictValue"];
          }
        });
        // 设置日期
        if (medData.limitDate)
          medData["limitDateMark"] = new Date(medData.limitDate);
        else medData["limitDateMark"] = "";
        if (medData.receiveDate)
          medData["receiveDateMark"] = new Date(medData.receiveDate);
        else medData["receiveDateMark"] = "";
        // 赋值
        for (const key in copyMedData) {
          this.addMedOutBoxForm.patchValue({ [key]: copyMedData[key] });
        }
        this.stopTakeIsVisible = true; // 打开弹框
      }
    });
  }

  // 保存添加好的停服原因，操作人默认为当前得登录者
  stopTakeOk() {
    let could = true;
    for (const i in this.stopMedOutBoxForm2.controls) {
      this.stopMedOutBoxForm2.controls[i].markAsDirty();
      this.stopMedOutBoxForm2.controls[i].updateValueAndValidity();
      if (this.stopMedOutBoxForm2.controls[i].status == "INVALID") {
        // return 出现非法字段立即停止
        could = false;
      }
    }
    if (!could) return; // 未验证通过
    this.boxLoading = true;
    this.stopTakeOkLoading = true;
    let sendData = JSON.parse(JSON.stringify(this.stopMedOutBoxForm2.value));
    Object.assign(this.stopMedOutBoxForm, sendData);
    this.httpReq.post(
      "dtOldman/medStop",
      null,
      this.stopMedOutBoxForm,
      data => {
        if (data.code == 0) {
          this.message.success("停服成功");
          this.stopMedOutBoxForm2.reset();
          for (const i in this.stopMedOutBoxForm) {
            delete this.stopMedOutBoxForm[i];
          }
          this.getTakeMedList();
          this.stopTakeIsVisible = false;
        }
        this.boxLoading = false;
        this.stopTakeOkLoading = false;
        this.addMedOutBoxForm.reset();
      }
    );
  }
  stopTakeCancel() {
    for (const i in this.stopMedOutBoxForm) {
      delete this.stopMedOutBoxForm[i];
    }
    this.addMedOutBoxForm.reset();
    this.stopMedOutBoxForm2.reset();
    this.stopTakeIsVisible = false;
  }

  // 修改操作
  edit(index, medData) {
    // 保存要编辑的index
    this.editMedIndex = index;
    // 获取频次可选列表
    this.entrustService.getMedFrequency(data => {
      if (data.code == 0) {
        this.medFrequencyLisy = data["data"][0]["ddList"];
        // 表单赋值
        for (const key in this.addMedOutBoxForm.value) {
          this.addMedOutBoxForm.patchValue({ [key]: medData[key] });
        }
      }
    });
    this.addMedEdit = true; // 编辑模式
    this.addTakeIsVisible = true;
  }
  // 删除操作
  delete(i) {
    this.globalService.delModal(() => {
      this.medList.splice(i, 1);
    });
  }

  //详情操作
  //data是药品得所有信息
  detail(medData, change: boolean = false) {
    this.MedId = medData.id;
    // 获取频次选择项
    let copyMedData = JSON.parse(JSON.stringify(medData));
    this.entrustService.getMedFrequency(data => {
      if (data.code == 0) {
        this.medFrequencyLisy = data["data"][0]["ddList"];
        this.medFrequencyLisy.forEach(item => {
          if (item["dictTag"] == copyMedData["frequency"]) {
            copyMedData.frequency = item["dictValue"];
          }
        });
        // 设置日期
        if (medData.limitDate)
          medData["limitDateMark"] = new Date(medData.limitDate);
        else medData["limitDateMark"] = "";
        if (medData.receiveDate)
          medData["receiveDateMark"] = new Date(medData.receiveDate);
        else medData["receiveDateMark"] = "";
        // 赋值
        for (const key in copyMedData) {
          this.addMedOutBoxForm.patchValue({ [key]: copyMedData[key] });
        }
        if (change) {
          this.addMedOutBoxForm.patchValue({
            familyMember2: copyMedData["familyMember"]
          });
          this.addMedOutBoxForm.patchValue({
            medTotal2: copyMedData["medTotal"]
          });
          this.addMedOutBoxForm.patchValue({ dosage2: copyMedData["dosage"] });
          this.addMedOutBoxForm.patchValue({
            frequency2: copyMedData["frequency"]
          });
          this.addMedOutBoxForm.patchValue({
            takeMedTime2: copyMedData["takeMedTime"]
          });
          this.addMedOutBoxForm.patchValue({
            limitDate2: copyMedData["limitDate"]
          });
          this.addMedChange = true; // 变更限制输入
        } else {
          this.addMedzIndexModel = true; // 详情开启遮罩
        }
        this.addTakeIsVisible = true; // 打开弹框
      }
    });
  }

  //保存操作，点击保存时，保存所有未保存到数据库中的数据
  save() {
    if (this.medList.length < 1) {
      this.message.error("尚未添加任何药物！");
      return;
    }
    this.takeMedLoading = true;
    let sendData = {
      id: this.olderId,
      userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
      medList: this.medList
    };
    this.httpReq.post("dtOldman/medAdd", null, sendData, data => {
      this.takeMedLoading = false;
      if (data.code == 0) {
        this.message.success("添加成功");
        this.medList = [];
        this.getTakeMedList();
      }
    });
  }

  // 弹框选择日期
  onDateChange(result: Date, name) {
    if (!result || !(result instanceof Date)) return;
    let pickDate =
      result.getFullYear() +
      "-" +
      (result.getMonth() + 1 < 10
        ? "0" + (result.getMonth() + 1)
        : result.getMonth() + 1) +
      "-" +
      (result.getDate() < 10 ? "0" + result.getDate() : result.getDate());
    if (pickDate) this.addMedOutBoxForm.patchValue({ [name]: pickDate });
  }
  // 新加药品列表频次显示
  frequencyTag(tag) {
    this.medFrequencyLisy.forEach(item => {
      if (item["dictValue"] == tag) {
        this.addMedOutBoxForm.patchValue({ showFrequencyTag: item["dictTag"] });
      }
    });
  }
  // 搜索老人输入回调
  onSearchNameChange({ value }: MentionOnSearchTypes) {
    // if(!name) return;
    let that = this;
    that.inputSuggestLoading = true;
    clearTimeout(that.timer);
    return (function() {
      that.timer = setTimeout(function() {
        that.entrustService.getMedName.call(
          that,
          that.addMedOutBoxForm.value.medName,
          function(data) {
            if (data.code == 0) {
              // that.medNameList = data['data']['content'];
              that.medNameList = [];
              let mednamelist = data["data"];
              if (mednamelist instanceof Array && mednamelist.length) {
                mednamelist.forEach((item, index) => {
                  // that.medNameList[index] = item[]
                  if (item["name"]) that.medNameList[index] = item["name"];
                });
                // console.log(that.medNameList);
              }
            }
            that.inputSuggestLoading = false;
          }
        );
      }, 500);
    })();
  }
  // 选择药名
  onSelect(value) {
    if (value) {
      this.addMedOutBoxForm.patchValue({ medName: value });
      this.addMedOutBoxForm.patchValue({ commonName: value });
    }
  }

  /* -------------------------------------------------停服药品Tab--------------------------------------------------- */
  // 获取停服药品列表
  getStopTakeMedList() {
    this.stopTakeMedLoading = true;
    this.stopMedListSendData.id = this.olderId;
    this.httpReq.post(
      "dtOldman/medInStopList",
      null,
      this.stopMedListSendData,
      data => {
        if (data.code == 0) {
          this.stopTakeList = data["data"]["list"];
          this.stopMedListTotalElements = data["data"]["totalElements"];
          this.stopTakeMedLoading = false;
        }
      }
    );
  }

  // 停服药品列表页码变更
  stopMedListPageIndexChange(PageIndexNum) {
    this.stopMedListSendData.page = PageIndexNum - 1;
    this.getStopTakeMedList();
  }

  // 停服药品列表每页条数变更
  stopMedListPageSizeChange(PageSize) {
    this.stopMedListSendData.size = PageSize;
    this.getStopTakeMedList();
  }
  /* --------------------------------------------------------------------------------------------------------------- */

  /* -----------------------------------------------委托记录Tab------------------------------------------------------ */
  // 获取委托记录列表
  getEntrustRecordList() {
    this.entrustRecordLoading = true;
    this.entrustRecordSendData.id = this.olderId;
    this.httpReq.post(
      "dtOldman/getMedLogList",
      null,
      this.entrustRecordSendData,
      data => {
        if (data.code == 0) {
          this.recordTakeList = data["data"]["content"];
          this.entrustRecordListTotalElements = data["data"]["totalElements"];
          this.entrustRecordLoading = false;
        }
      }
    );
  }

  // 委托记录页码变更
  entrustRecordListPageIndexChange(PageIndexNum) {
    console.log(PageIndexNum);
    this.entrustRecordSendData.page = PageIndexNum - 1;
    this.getEntrustRecordList();
  }

  // 委托记录每页条数变更
  entrustRecordListPageSizeChange(PageSize) {
    this.entrustRecordSendData.size = PageSize;
    this.getEntrustRecordList();
  }
  /* ---------------------------------------------------------------------------------------------------------------- */

  /* -----------------------------------------------服药记录Tab------------------------------------------------------ */
  // 获取委托记录列表
  getTakeMedRecordList() {
    this.takeMedRecordLoading = true;
    this.takeMedRecordSendData.id = this.olderId;
    this.httpReq.post("takeList", null, this.takeMedRecordSendData, data => {
      if (data.code == 0) {
        this.medicineTakeList = data["data"]["content"];
        this.takeMedRecordTotalElements = data["data"]["totalElements"];
        this.takeMedRecordLoading = false;
      }
    });
  }

  // 委托记录页码变更
  takeMedRecordPageIndexChange(PageIndexNum) {
    console.log(PageIndexNum);
    this.takeMedRecordSendData.page = PageIndexNum - 1;
    this.getTakeMedRecordList();
  }

  // 委托记录每页条数变更
  takeMedRecordPageSizeChange(PageSize) {
    this.takeMedRecordSendData.size = PageSize;
    this.getTakeMedRecordList();
  }
  /* ---------------------------------------------------------------------------------------------------------------- */

  /* -----------------------------------------------切换Tab------------------------------------------------------ */
  // 服药
  takeMedTable() {
    // 获取服药列表
    let that = this;
    setTimeout(function() {
      return that.getTakeMedList();
    }, 200);
  }
  // 停药
  stopMedTable() {
    // 获取停服列表
    let that = this;
    setTimeout(function() {
      return that.getStopTakeMedList();
    }, 200);
  }
  // 委托
  entrusTable() {
    // 获取委托记录列表
    let that = this;
    setTimeout(function() {
      return that.getEntrustRecordList();
    }, 200);
  }
  // 服药记录
  takeMedRecordTable() {
    // 获取服药记录列表
    let that = this;
    setTimeout(function() {
      return that.getTakeMedRecordList();
    }, 200);
  }
  /* ---------------------------------------------------------------------------------------------------------------- */
}
