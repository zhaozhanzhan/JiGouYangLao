import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormGroup, FormBuilder} from "@angular/forms";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

@Component({
  selector: "app-organizationa-otherInfo",
  templateUrl: "otherInfo.component.html",
  styleUrls: ["./otherInfo.component.css"]
})
export class OtherInfoComponent implements OnInit {
  public formData: FormGroup; // 定义表单对象
  saveBasicInformationLoading = false;

  constructor(
    private httpReq: HttpReqService,
    private msg: NzMessageService, // 消息提醒
    private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService // 自定义JS工具类
  ) {}

  ngOnInit() {
    this.formData = this.fb.group({
      id: "", //信息id（新增传空值）
      aroundMedicalOrgan: "", //周边医疗机构
      aroundTouristSpot: "", //周边旅游景点
      projectDate: "", //立项时间
      projectDesc: "", //立项批复
      beginDate: "", //开工日期
      endDate: "", //预计完工日期
      govOffice: "", //政府办
      socialOffice: "", //社会办
      registerOffice: "", //登记机关
      endyearBedNum: "", //年末床位数
      finishedYear: "", //建成投入使用年度

      registFund:"", //"注册（开办）资金",
      leaseholdBegin:"", //"房屋租赁开始时间",
      leaseholdEnd:"", //"房屋租赁结束时间",
      levelAssess:"", //"等级评定",
      manageSystemSound:"", //"管理制度是否健全",
      stationSystemSound:"", //"岗位责任制是否健全",
      isEstablishManagement:"", //"是否建立院管委会",
      activitiesDevelopInfo:"", //"开展活动情况",
      isHospitalAffairs:"", //"院务是否公开",
      isFinanceOpen:"", //"财务是否公开",
      managementFunds:"", //"管理工作经费",
      annualSidelineIncome:"", //"年副业收入"
      heatingMode:"", //"取暖方式",
      comment:"", //"备注"
    });

    this.getOtherInfo();
  }



  saveOtherInfo() {
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


    formData.projectDate = this.jsUtil.dateFormat(formData.projectDate); 
    formData.beginDate = this.jsUtil.dateFormat(formData.beginDate);
    formData.endDate = this.jsUtil.dateFormat(formData.endDate);
    formData.finishedYear = this.jsUtil.dateFormat(formData.finishedYear);


    formData.leaseholdBegin = this.jsUtil.dateFormat(formData.leaseholdBegin);
    formData.leaseholdEnd = this.jsUtil.dateFormat(formData.leaseholdEnd);
    this.httpReq.post(
      "/organOtherInfo/saveOrUpdate",
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

  getOtherInfo() {
    const that = this;
    this.httpReq.post("/organOtherInfo/list", null, null, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          GlobalMethod.setForm(this.formData, data["data"]); // 表单赋值
        } else {
          that.msg.success(data["message"]);
        }
      }
    });
  }
}
