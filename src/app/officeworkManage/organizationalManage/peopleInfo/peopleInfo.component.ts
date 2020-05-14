import { Component, OnInit} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegexpConfig } from "../../../common/service/GlobalConfig"; //
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

@Component({
  selector: "app-organizationa-peopleInfo",
  templateUrl: "peopleInfo.component.html",
  styleUrls: ["./peopleInfo.component.css"]
})
export class PeopleInfoComponent implements OnInit {
  public formData: FormGroup; // 定义表单对象
  saveBasicInformationLoading=false;
  constructor(
    private httpReq: HttpReqService, 
    private msg: NzMessageService, // 消息提醒
    private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService, // 自定义JS工具类
  ) {}

  ngOnInit() {
    this.formData = this.fb.group({
      id: "", //信息id（新增传空值）
      checkInNum: "", //入住人员总数
      focusProvideNum: "", //集中供养老年人数
      socialFosterageNum: "", //社会寄养老年人数
      employeeNum: "", //从业人员总数
      managerNum: "", //管理人员人数
      doctorNum: "", //医生人数
      nurseNum: "", //护士人数
      nursingWorkerNum: "", //护工人数
      otherEmployeeNum: "", //其它工作人员人数
      organCertifiedDesc: "", //机构持证上岗状况描述
      comment: "" //备注
    });
    this.getOrganStaffInfo();
  }

  saveOrganStaffInfo(){
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

    this.httpReq.post("/organStaffInfo/saveOrUpdate", null, formData, data => {
      that.saveBasicInformationLoading = true;
      if (data["status"] == 200) {
        if(data["code"] == 0){
          that.msg.success("保存成功！");
          that.saveBasicInformationLoading = false;
        }else{
          that.msg.success(data["message"]);
        }
      }
    });
  }


  getOrganStaffInfo(){
    const that = this;
    this.httpReq.post("/organStaffInfo/list", null, null, data => {
      if (data["status"] == 200) {
        if(data["code"] == 0){
          GlobalMethod.setForm(this.formData, data["data"]); // 表单赋值
        }else{
          that.msg.success(data["message"]);
        }
      }
    });
  }
  
}
