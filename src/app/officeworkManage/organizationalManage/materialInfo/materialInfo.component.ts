import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-organizationa-materialInfo",
  templateUrl: "materialInfo.component.html",
  styleUrls: ["./materialInfo.component.css"]
})
export class MaterialInfoComponent implements OnInit {
  isSaveLoading = false;
  info = {
    id: "", //信息id（新增传空值）
    agedLicenceInfo: "", //养老机构设立许可证信息及扫描件
    medicalLicenceInfo: "", //医疗机构执业许可证信息及扫描件
    privateNoneInfo: "", //民非证书信息及扫描件
    publicInstitutionInfo: "", //事业单位法人证书信息及扫描件
    finalAcceptanceInfo: "", //竣工验收证明信息及扫描件
    restaurantServiceInfo: "", //餐饮服务许可证信息及扫描件
    fireControlInfo: "", //消防验收合格意见信息及扫描件
    epaAuditInfo: "", //环保局审核意见信息及扫描件
    otherProveInfo: "" //其他证明材料信息及扫描件
  };

  constructor(private httpReq: HttpReqService, private msg: NzMessageService) {}

  ngOnInit() {
    this.getInfo();
  }

  saveInfo(
    agedLicenceImgs: Array<string>,
    medicalLicenceImgs: Array<string>,
    privateNoneImgs: Array<string>,
    publicInstitutionImgs: Array<string>,
    finalAcceptanceImgs: Array<string>,
    restaurantServiceImgs: Array<string>,
    fireControlImgs: Array<string>,
    epaAuditImgs: Array<string>,
    otherProveImgs: Array<string>
  ) {
    this.info.agedLicenceInfo = agedLicenceImgs.toString();
    this.info.medicalLicenceInfo = medicalLicenceImgs.toString();
    this.info.privateNoneInfo = privateNoneImgs.toString();
    this.info.publicInstitutionInfo = publicInstitutionImgs.toString();
    this.info.finalAcceptanceInfo = finalAcceptanceImgs.toString();
    this.info.restaurantServiceInfo = restaurantServiceImgs.toString();
    this.info.fireControlInfo = fireControlImgs.toString();
    this.info.epaAuditInfo = epaAuditImgs.toString();
    this.info.otherProveInfo = otherProveImgs.toString();

    if (this.info.agedLicenceInfo.length > 500) {
      this.msg.error("养老机构设立许可证信息及扫描件图片过多！");
      return;
    }
    if (this.info.medicalLicenceInfo.length > 500) {
      this.msg.error("医疗机构执业许可证信息及扫描件图片过多！");
      return;
    }
    if (this.info.privateNoneInfo.length > 500) {
      this.msg.error("民非证书信息及扫描件图片过多！");
      return;
    }
    if (this.info.publicInstitutionInfo.length > 500) {
      this.msg.error("事业单位法人证书信息及扫描件图片过多！");
      return;
    }
    if (this.info.finalAcceptanceInfo.length > 500) {
      this.msg.error("竣工验收证明信息及扫描件图片过多！");
      return;
    }
    if (this.info.restaurantServiceInfo.length > 500) {
      this.msg.error("餐饮服务许可证信息及扫描件图片过多！");
      return;
    }
    if (this.info.fireControlInfo.length > 500) {
      this.msg.error("消防验收合格意见信息及扫描件图片过多！");
      return;
    }
    if (this.info.epaAuditInfo.length > 500) {
      this.msg.error("环保局审核意见信息及扫描件图片过多！");
      return;
    }
    if (this.info.otherProveInfo.length > 500) {
      this.msg.error("其他证明材料信息及扫描件图片过多！");
      return;
    }

    let that = this;
    this.isSaveLoading = true;
    this.httpReq.post(
      "organEvidenceInfo/saveOrUpdate",
      null,
      this.info,
      data => {
        that.isSaveLoading = false;
        if (data["code"] == 0) {
          that.msg.success("保存成功！");
        }
      }
    );
  }

  getInfo() {
    const that = this;
    this.httpReq.post("organEvidenceInfo/list", null, null, data => {
      if (data["code"] == 0) {
        let resultData = data["data"];
        that.info = resultData;
      }
    });
  }
}
