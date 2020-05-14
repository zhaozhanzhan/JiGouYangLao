import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegexpConfig } from "../../../common/service/GlobalConfig"; //
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

@Component({
  selector: "app-organizationa-principalInfo",
  templateUrl: "principalInfo.component.html",
  styleUrls: ["./principalInfo.component.css"]
})
export class PrincipalInfoComponent implements OnInit {
  public formData: FormGroup; // 定义表单对象
  saveBasicInformationLoading = false;
  folkList;//民族
  sexList;//性别
  politicsList;//政治面貌
  educationtList;//学历
  constructor(
    private httpReq: HttpReqService,
    private msg: NzMessageService, // 消息提醒
    private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService // 自定义JS工具类
  ) {}

  ngOnInit() {
    this.formData = this.fb.group({
      id: [""], //"信息id（新增传空值）",
      chargePerson: [""], //"机构负责人姓名",
      cetiCode: [""], //"公民身份号码",
      chargePersonPhone: ["", [Validators.pattern(RegexpConfig.phone)]], //"电话",
      chargePersonPosition: [""], //"机构内职务",
      chargePersonFolk: [""], //"民族",
      chargePersonBirthday: [""], //"出生年月",
      chargePersonSex: [""], //"性别",
      chargePersonPolitics: [""], //"政治面貌",
      chargePersonEdu: [""], //"学历",
      legalPerson: [""], //"法定代表人",
      legalPersonPhone: ["", [Validators.pattern(RegexpConfig.phone)]], //"法人联系电话",
      comment: [""] //"备注"
    });

    this.getOrganCorporationInfo();
    this.getBasicConfiguration();
  }
  saveOrganCorporationInfo() {
    const that = this;
    const formDataCtrl = this.formData.controls;
    const formData = this.jsUtil.deepClone(this.formData.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }

    if (this.formData.invalid) {
      // 表单较验未通过
      return;
    }
    formData.chargePersonBirthday = this.jsUtil.dateFormat(
      formData.chargePersonBirthday
    );

    this.httpReq.post(
      "organCorporationInfo/saveOrUpdate",
      null,
      formData,
      data => {
        that.saveBasicInformationLoading = true;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.msg.success("保存成功！");
            that.saveBasicInformationLoading = false;
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }

  getOrganCorporationInfo() {
    const that = this;
    this.httpReq.post("organCorporationInfo/list", null, null, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          GlobalMethod.setForm(this.formData, data["data"]); // 表单赋值
        } else {
          that.msg.success(data["message"]);
        }
      }
    });
  }

  getBasicConfiguration(){
    const that = this;
    this.httpReq.post("dictMgt/listDataByTypes", null, {dictTypes:"folk,sex,politics,education"}, data => {
      if (data["status"] == 200) {
        if(data["code"] == 0){
          const info=data["data"];
          info.forEach(e => {
            //folk民族
            if(e.dictType=="folk"){
              this.folkList=e.ddList
            }

            //sex性别
            if(e.dictType=="sex"){
              this.sexList=e.ddList
            }

            //politics政治面貌
            if(e.dictType=="politics"){
              this.politicsList=e.ddList
            }

            //education学历
            if(e.dictType=="education"){
              this.educationtList=e.ddList
            }
          });
        }else{
          that.msg.success(data["message"]);
        }
      }
    });
  }
}
