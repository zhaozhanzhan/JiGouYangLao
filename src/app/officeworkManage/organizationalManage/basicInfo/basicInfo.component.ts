import { Component, OnInit} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegexpConfig } from "../../../common/service/GlobalConfig"; //
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";
@Component({
  selector: "app-organizationa-basicInfo",
  templateUrl: "basicInfo.component.html",
  styleUrls: ["./basicInfo.component.css"]
})
export class BasicInfoComponent implements OnInit {
  public formData: FormGroup; // 定义表单对象
  saveBasicInformationLoading=false;
  organStatusList;//建设状态
  organNatureList;//机构性质
  organTypeList;//养老机构类别
  establishObjectList;//兴办主体
  establishTypeList;//建设形式
  runTypeList;//运营方式
  organAllowanceTypeList;//机构补贴类型
  constructor(
    private httpReq: HttpReqService, 
    private msg: NzMessageService, // 消息提醒
    private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService, // 自定义JS工具类
  ) {}

  ngOnInit() {
      this.formData = this.fb.group({
        id:[""],//"信息id（新增传空值）",
        morgArea:[""],//"所属地区",
        organName:[""],//"机构名称",
        engOrganName:[""],//"机构名称（英文）",
        organPhone:["",[Validators.pattern(RegexpConfig.phone)]],//"机构电话",
        zipCode:[""],//"邮编",
        fax:[""],//"传真",
        email:["",[ Validators.email]],//"电子邮箱",
        organAdd:[""],//"地址",
        organStatus:[""],//"建设状态",
        organNature:[""],//"机构性质",
        createDate:[""],//"建院时间",
        runDate:[""],//"运营时间",
        bedNum:[""],//"设置床位数",
        businessScope:[""],//"经营范围",
        organType:[""],//"养老机构类别",
        organLicenceCode:[""],//"养老机构设立许可证编号",
        organLicenceApplyTime:[""],//"养老机构设立许可证申请时间",
        organLicenceDealName:[""],//"养老机构设立许可证办理人姓名",
        organLicenceDealCetino:[""],//"养老机构设立许可证办理人公民身份号码",
        organSetApprovalCeti:[""],//"机构设置批准证书",
        privateOrganCetiCode:[""],//"民办社会福利机构证书编号",
        socialOrganCetiCode:[""],//"社会福利机构登记证书编号",
        socialOrganTypeCode:[""],//"社会福利机构登记类型代码",
        establishObject:[""],//"兴办主体",
        establishType:[""],//"建设形式",
        runType:[""],//"运营方式",
        organRunnerName:[""],//"机构运营单位名称",
        organInvestAmount:[""],//"机构投资总金额",
        organAllowanceType:[""],//"机构补贴类型",
        regCapital:[""],//"注册资金",
        flowCapital:[""],//"流动资金",
        comment:[""],//"备注"});
    })


    this.getBasicInformation();
    this.getBasicConfiguration();
  }

  saveBasicInformation(){
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
      formData.createDate = this.jsUtil.dateFormat(formData.createDate); 
      formData.runDate = this.jsUtil.dateFormat(formData.runDate);
      formData.organLicenceApplyTime = this.jsUtil.dateFormat(formData.organLicenceApplyTime);

      this.httpReq.post("organBasicInfo/saveOrUpdate", null, formData, data => {
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
  

    getBasicInformation(){
      const that = this;
      this.httpReq.post("organBasicInfo/list", null, null, data => {
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
      this.httpReq.post("dictMgt/listDataByTypes", null, {dictTypes:"organ_status,organ_nature,organ_type,establish_object,establish_type,run_type,organ_allowance_type"}, data => {
        if (data["status"] == 200) {
          if(data["code"] == 0){
            const info=data["data"];
            info.forEach(e => {
              //organ_status建设状态
              if(e.dictType=="organ_status"){
                this.organStatusList=e.ddList
              }

              //organ_nature机构性质
              if(e.dictType=="organ_nature"){
                this.organNatureList=e.ddList
              }

              //organ_type养老机构类别
              if(e.dictType=="organ_type"){
                this.organTypeList=e.ddList
              }

              //establish_object兴办主体
              if(e.dictType=="establish_object"){
                this.establishObjectList=e.ddList
              }

              //establish_type建设形式
              if(e.dictType=="establish_type"){
                this.establishTypeList=e.ddList
              }

               //run_type运营方式
               if(e.dictType=="run_type"){
                this.runTypeList=e.ddList
              }

               //organ_allowance_type机构补贴类型
               if(e.dictType=="organ_allowance_type"){
                this.organAllowanceTypeList=e.ddList
              }
            });
          }else{
            that.msg.success(data["message"]);
          }
        }
      });
    }
}
