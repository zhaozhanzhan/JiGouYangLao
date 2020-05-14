import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { ActivatedRoute } from "@angular/router";
import { GlobalMethod } from "../../../../common/service/GlobalMethod";

@Component({
  selector: "app-hospitalRegistration-add-edit",
  templateUrl: "./hospitalRegistration-add-edit.component.html",
  styleUrls: ["./hospitalRegistration-add-edit.component.css"]
})
export class HospitalRegistrationCheckAddEditComponent implements OnInit {
  public validateForm: FormGroup; // 基本信息定义表单对象
  user; //用户的详情信息
  isBtnLoading; //保存是加载状态

  folkList = []; //folk民族
  sexList = []; //性别
  occupationList = []; //职业
  provincesList = []; //省的列表
  citysList = []; //市列表
  areasList = []; //县列表
  isShowOldDialog = false; //选择老人是弹出框显示

  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    appayType: ""
  }; //加载老人列表的参数
  oldDataArray = []; //老人列表的数组
  isOldTableLoading = false; //加载老人的加载等待
  oldResultData = {
    totalElements: 0
  }; //显示几条数据
  constructor(
    private httpReq: HttpReqService, //数据请求
    private fb: FormBuilder, // 响应式表单,
    private localStorage: LocalStorage, //存储
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private msg: NzMessageService, // 消息提醒
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: "", //"入院基本信息登记id",
      name: ["", [Validators.required]], //"姓名",
      sex: ["", [Validators.required]], //"性别/1.男 2.女",
      birthDay: ["", [Validators.required]], //"出生日期",
      age: "", //年龄
      marriage: "", //"婚姻/1.未 2.已 3.离 4.丧",
      occupation: "", //"职业",
      birthPlacePro: "", //"出生地省",
      birthPlaceCity: "", //"出生地市",
      birthPlaceArea: "", //"出生地_区",
      nation: "", //"民族",
      country: "", //"国籍",
      cardno: [
        "",
        [
          Validators.pattern(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/),
          Validators.required
        ]
      ], //"身份证号码",
      companyAndAddress: "", //"工作单位及地址",
      companyPhone: "", //"工作单位联系电话",
      companyPost: "", //工作单位邮编
      registeredAddress: "", //"户口地址",
      phone: "", //"电话",
      post: "", //"邮政编码",
      contactName: ["", [Validators.required]], //"联系人姓名",
      relation: ["", [Validators.required]], //"联系人关系",
      contactAddress: ["", [Validators.required]], //"联系人地址",
      contactPhone: ["", [Validators.required]], //"联系人电话",
      medicalPayment: ["", [Validators.required]], //"医疗付款方式/1.社会基本医疗保险2.商业保险3.自费医疗4.公费医疗5.大病统筹6.其他",
      medicalNum: "", //"医疗保险（公费）号",
      accountId: "", //"登陆账户Id"
      basicComment: "" //"基本信息备注"
    });
    // 当是修改时
    let data = this.route.snapshot.paramMap.get("data");
    if (data) {
      GlobalMethod.setForm(this.validateForm, JSON.parse(data)); // 表单赋值
      this.getListProvinces();
      this.getListCitys();
      this.getListAreas();
    }

    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.validateForm.patchValue({
      accountId: this.user.data.id
    });

    //获取字典里面的字段
    this.getAllDataDictionary();
    // 获得省的列表
    this.getListProvinces();
  }
  // 返回
  back() {
    history.back();
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
    // that.oldQueryParams.name = that.searchOldName;
    that.isOldTableLoading = true;
    this.httpReq.post("/oldman/list", null, this.oldQueryParams, data => {
      that.oldQueryParams.page++;
      that.isOldTableLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.oldDataArray = data["data"]["content"]; // 数据列表
          this.oldResultData.totalElements = data["data"]["totalElements"]; // 总条数
        } else {
          this.msg.error(data.message);
        }
      }
    });
  }

  /**
   * 老年人选择对话框中选择了某个老年人；
   */

  chooseOld(oldInfo) {
    this.isShowOldDialog = false;
    if (oldInfo != null) {
      this.validateForm.patchValue({ name: oldInfo.name });
      this.validateForm.patchValue({ sex: oldInfo.sex });
      this.validateForm.patchValue({ birthDay: oldInfo.birthYearMonth });
      this.validateForm.patchValue({ age: oldInfo.age });
      this.validateForm.patchValue({ marriage: oldInfo.marriage });
      this.validateForm.patchValue({ occupation: oldInfo.occupation });
      this.validateForm.patchValue({ nation: oldInfo.nation });
      this.validateForm.patchValue({ cardno: oldInfo.cardno });
      this.validateForm.patchValue({ cardno: oldInfo.cardno });
    }
  }
  // 保存表单
  saveForm() {
    const that = this;
    const formDataCtrl = this.validateForm.controls;
    const formData = this.jsUtil.deepClone(this.validateForm.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid) {
      // 表单较验未通过
      return;
    }

    let reqObj = this.validateForm.value;
    reqObj.accountId = this.user.data.id;
    reqObj.birthDay = this.jsUtil.dateFormat(reqObj.birthDay);
    that.isBtnLoading = true;
    this.httpReq.post("/basic_info/saveOrUpdate", null, reqObj, data => {
      that.isBtnLoading = false;
      if (data["code"] == 0) {
        that.msg.success("保存成功！");
        this.back();
      } else {
        that.msg.error(data["message"]);
      }
    });
  }

  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "dictMgt/listDataByTypes",
      null,
      { dictTypes: "folk,sex,occupation" },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const info = data["data"];
            info.forEach(e => {
              //folk民族
              if (e.dictType == "folk") {
                this.folkList = e.ddList;
                console.log(this.folkList);
              }
              //sex性别
              if (e.dictType == "sex") {
                this.sexList = e.ddList;
              }
              //occupation职业
              if (e.dictType == "occupation") {
                this.occupationList = e.ddList;
              }
            });
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }

  getListProvinces() {
    const that = this;
    this.httpReq.post("/chnAreas/listProvinces", null, {}, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          that.provincesList = data["data"];
        } else {
          that.msg.success(data["message"]);
        }
      }
    });
  }

  getListCitys() {
    const that = this;
    this.httpReq.post(
      "/chnAreas/listCitys",
      null,
      { provCode: this.validateForm.get("birthPlacePro").value },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.citysList = data["data"];
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }

  getListAreas() {
    const that = this;
    this.httpReq.post(
      "chnAreas/listAreas",
      null,
      { cityCode: this.validateForm.get("birthPlaceCity").value },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.areasList = data["data"];
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }
}
