import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { ActivatedRoute } from "@angular/router";
import { GlobalMethod } from "../../../../common/service/GlobalMethod";
@Component({
  selector: "app-checkInInfor-check",
  templateUrl: "./checkInInfor-check.component.html",
  styleUrls: ["./checkInInfor-check.component.css"]
})
export class CheckInInforCheckComponent implements OnInit {
  public validateForm: FormGroup; // 基本信息定义表单对象
  user; //用户的详情信息
  isBtnLoading; //保存是加载状态
  SectionOfficedList = []; //科室所有的
  doctorForSoList = []; //获得所有得医生
  sickWardForSoList = []; //获得所有得病区
  bedForSickWardList = []; //床位
  // caseList = []; //护理等级
  bedId = "";
  disabled = false;
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
      id: "", //"入院记录登记Id",
      inId: "", //入院Id
      admissionNo: ["", [Validators.required]], //"住院号",
      admissionTimes: ["", [Validators.required]], //"第几次入院",
      admissionDate: ["", [Validators.required]], //"入院日期",
      sectionOfficeId: ["", [Validators.required]], //"科室Id",
      attendingDoc: ["", [Validators.required]], //"主治医生",
      careLevelCase: "", //"护理级别",
      sickWardId: ["", [Validators.required]], //"病区Id",
      bedId: ["", [Validators.required]], //"床位Id",
      situation: "", //"入院时情况",
      judgement: "", //"门(急)诊断",
      accountId: "", //"登陆账户Id",
      comment: "", //"入院备注"
      bedName: ""
    });
    let id = this.route.snapshot.paramMap.get("id");
    this.validateForm.patchValue({
      inId: id
    });
    // 当是修改时
    let data = JSON.parse(this.route.snapshot.paramMap.get("data"));

    if (data) {
      this.bedId = data.bedId;
      this.disabled = true;
      GlobalMethod.setForm(this.validateForm, data); // 表单赋值
      this.validateForm.patchValue({
        sectionOfficeId: data.sectionOffice.id
      });
      this.validateForm.patchValue({
        attendingDoc: data.attendingDoc
      });
      this.validateForm.patchValue({
        sickWardId: data.sickWard.id
      });
      this.validateForm.patchValue({
        bedName: data.bedName
      });
      this.getSectionOfficedList();
      this.getDoctor();
      this.getBedForSickWard();
    }
    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.validateForm.patchValue({
      accountId: this.user.data.id
    });

    // 获得所有得科室
    this.getSectionOfficedList();
    // 获得所有得护理等级
    // this.getCaseList();
    this.getAllDataDictionary();
  }
  //返回
  back() {
    history.back();
  }
  nursingList = []; //护理列表
  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "/dictionaryMedicationData/dataListAllTwo",
      null,
      {
        dictTypes: "careOfLevel"
      },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const info = data["data"];
            info.forEach(e => {
              //护理列表
              if (e.dictType == "careOfLevel") {
                this.nursingList = e.ddList;
              }
            });
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }
  // 保存
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
    reqObj.admissionDate =
      this.jsUtil.dateFormat(reqObj.admissionDate) + " 00:00:00";
    that.isBtnLoading = true;
    this.httpReq.post("/in_hospitals_info/saveOrUpdate", null, reqObj, data => {
      that.isBtnLoading = false;
      if (data["code"] == 0) {
        that.msg.success("保存成功！");
        this.back();
      } else {
        that.msg.error(data["message"]);
      }
    });
  }

  // 获得科室
  getSectionOfficedList() {
    this.httpReq.post("/section_office/listAll", null, {}, data => {
      if (data["code"] == 0) {
        this.SectionOfficedList = data["data"];
      } else {
        this.msg.error(data["message"]);
      }
    });
  }

  //  通过科室获得医生和病区
  getDoctor() {
    // 获得所有得医生
    this.httpReq.post(
      "/section_office/getDoctorForSo",
      null,
      { id: this.validateForm.get("sectionOfficeId").value },
      data => {
        if (data["code"] == 0) {
          this.doctorForSoList = data["data"];
        } else {
          this.msg.error(data["message"]);
        }
      }
    );

    //  获得所有得病区
    this.httpReq.post(
      "/section_office/getSickWardForSo",
      null,
      { id: this.validateForm.get("sectionOfficeId").value },
      data => {
        if (data["code"] == 0) {
          this.sickWardForSoList = data["data"];
        } else {
          this.msg.error(data["message"]);
        }
      }
    );
  }

  // 通过病区获得床位
  getBedForSickWard() {
    //  获得所有得床位
    this.httpReq.post(
      "/sickWard/getBedForSickWard",
      null,
      { id: this.validateForm.get("sickWardId").value },
      data => {
        if (data["code"] == 0) {
          this.bedForSickWardList = data["data"];
          this.validateForm.patchValue({
            bedId: this.bedId
          });
        } else {
          this.msg.error(data["message"]);
        }
      }
    );
  }

  // 获得所有得护理等级
  // getCaseList() {
  //   this.httpReq.get("/careLevelCase/allList", null, data => {
  //     if (data["status"] == 200 && data["code"] == 0) {
  //       this.caseList = data["data"];
  //     } else {
  //       this.msg.error(data["message"]);
  //     }
  //   });
  // }
}
