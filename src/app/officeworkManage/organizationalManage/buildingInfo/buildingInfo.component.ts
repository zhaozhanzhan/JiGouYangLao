import { Component, OnInit} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegexpConfig } from "../../../common/service/GlobalConfig"; //
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

@Component({
  selector: "app-organizationa-buildingInfo",
  templateUrl: "buildingInfo.component.html",
  styleUrls: ["./buildingInfo.component.css"]
})
export class BuildingInfoComponent implements OnInit {
  public formData: FormGroup; // 定义表单对象
  saveBasicInformationLoading=false;
  houseNatureList;//房屋性质	
  constructor(
    private httpReq: HttpReqService, 
    private msg: NzMessageService, // 消息提醒
    private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService, // 自定义JS工具类
  ) {}

  ngOnInit() {
    this.formData = this.fb.group({
      id: "", //信息id（新增传空值）
      buildingArea: "", //机构建筑面积
      coverArea: "", //机构占地面积
      greenArea: "", //绿化面积
      serviceObjectArea: "", //服务对象用房面积
      medicalHouseArea: "", //医务用房面积
      outdoorArea: "", //户外活动场所面积
      outdoorEntertainArea: "", //室外娱乐场所面积
      indoorEntertainArea: "", //室内娱乐场所面积
      bathroomArea: "", //独立卫生间面积
      sigalBedArea: "", //单床使用面积
      healthArea: "", //康复体锻用房面积
      logisticHouseArea: "", //后勤用房面积
      canteenHouseArea: "", //食堂用房面积
      officeArea: "", //办公用房面积
      oldAssistArea: "", //老年人居住辅助用房面积
      adminAssistArea: "", //行政辅助用房面积
      empolyeeArea: "", //员工生活用房面积
      houseNature: "", //房屋性质
      comment: "" //备注
    });

    this.getOrganConstructionInfo();
    this.getBasicConfiguration();
  }

  saveOrganConstructionInfo(){
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

    this.httpReq.post("/organConstructionInfo/saveOrUpdate", null, formData, data => {
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


  getOrganConstructionInfo(){
    const that = this;
    this.httpReq.post("/organConstructionInfo/list", null, null, data => {
      if (data["status"] == 200) {
        if(data["code"] == 0){
          GlobalMethod.setForm(this.formData, data["data"]); // 表单赋值
        }else{
          that.msg.success(data["message"]);
        }
      }
    });
  }

 

  getBasicConfiguration(){
    const that = this;
    this.httpReq.post("dictMgt/listDataByTypes", null, {dictTypes:"house_nature"}, data => {
      if (data["status"] == 200) {
        if(data["code"] == 0){
          const info=data["data"];
          info.forEach(e => {
            //house_nature房屋性质
            if(e.dictType=="house_nature"){
              this.houseNatureList=e.ddList
            }
          });
        }else{
          that.msg.success(data["message"]);
        }
      }
    });
  }
}
