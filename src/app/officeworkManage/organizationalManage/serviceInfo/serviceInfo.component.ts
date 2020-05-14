import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormGroup, FormBuilder} from "@angular/forms";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

@Component({
  selector: "app-organizationa-serviceInfo",
  templateUrl: "serviceInfo.component.html",
  styleUrls: ["./serviceInfo.component.css"]
})
export class ServiceInfoComponent implements OnInit {
  public formData: FormGroup; // 定义表单对象
  saveBasicInformationLoading = false;
  
  isReceiveRemoteOldList;//是否接收异地老年人
  medicalServiceTypeList;//医疗服务方式
  isMedicalInsuranceList;//是否具备医保定点资格
  medicalOrganFlagList;//内设有医疗机构标志
  isOpenFlagList;//是否对港澳台和外国人开放标志
  constructor(
    private httpReq: HttpReqService,
    private msg: NzMessageService, // 消息提醒
    private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService // 自定义JS工具类
  ) {}

  ngOnInit() {
    this.formData = this.fb.group({
      id: "", //信息id（新增传空值）
      serviceObjectType: "", //服务对象类型
      businessScope: "", //服务范围
      serviceItem: "", //服务项目
      isReceiveRemoteOld: "", //是否接收异地老年人
      medicalServiceType: "", //医疗服务方式
      isMedicalInsurance: "", //是否具备医保定点资格
      medicalOrganFlag: "", //内设有医疗机构标志
      medicalOrganName: "", //医疗机构名称
      isOpenFlag: "", //是否对港澳台和外国人开放标志
      comment: "" //备注
    });

    this.getOrganServiceInfo();
    this.getBasicConfiguration()
  }


  saveOrganServiceInfo() {
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

    this.httpReq.post(
      "/organServiceInfo/saveOrUpdate",
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

  getOrganServiceInfo() {
    const that = this;
    this.httpReq.post("/organServiceInfo/list", null, null, data => {
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
    this.httpReq.post("dictMgt/listDataByTypes", null, {dictTypes:"is_receive_remote_old,medical_service_type,is_medical_insurance,medical_organ_flag,is_open_flag"}, data => {
      if (data["status"] == 200) {
        if(data["code"] == 0){
          const info=data["data"];
          info.forEach(e => {
            //is_receive_remote_old是否接收异地老年人
            if(e.dictType=="is_receive_remote_old"){
              this.isReceiveRemoteOldList=e.ddList
            }

            //medical_service_type医疗服务方式
            if(e.dictType=="medical_service_type"){
              this.medicalServiceTypeList=e.ddList
            }

            
            //is_medical_insurance是否具备医保定点资格
            if(e.dictType=="is_medical_insurance"){
              this.isMedicalInsuranceList=e.ddList
            }

            //medical_organ_flag内设有医疗机构标志
            if(e.dictType=="medical_organ_flag"){
              this.medicalOrganFlagList=e.ddList
            }

            //is_open_flag是否对港澳台和外国人开放标志
            if(e.dictType=="is_open_flag"){
              this.isOpenFlagList=e.ddList
            }

           
          });
        }else{
          that.msg.success(data["message"]);
        }
      }
    });
  }
}
