import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormGroup, FormBuilder} from "@angular/forms";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

@Component({
  selector: "app-organizationa-facilityInfo",
  templateUrl: "facilityInfo.component.html",
  styleUrls: ["./facilityInfo.component.css"]
})
export class FacilityInfoComponent implements OnInit {
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
      id: [""], //"信息id（新增传空值）",
      floorNum: [""], //"楼层",
      elevatorNum: [""], //"电梯数",
      houseType: [""], //"房屋类型",
      oldRoomNum: [""], //"机构内居住房间数",
      sigalRoomNum: [""], //"机构内单人房间数",
      doubleRoomNum: [""], //"机构内双人房间数",
      manyRoomNum: [""], //"多人间数",
      medicalBedNum: [""], //"医用床床位数",
      normalBedNum: [""], //"普通床床位数",
      selfcareBedNum: [""], //"自理床位数",
      mediateBedNum: [""], //"介助床位数",
      nursingBedNum: [""], //"介护床位数",
      medicalSituationDesc: [""], //"医护人员及主要医疗设施设备情况",
      oldRoomEquip: [""], //"老年人房间设备",
      publicServiceEquip: [""], //"公共服务设备",
      medicalEquip: [""], //"医疗康复设备",
      safeSecurityEquip: [""], //"安全保障设备",
      entertainFitnessEquip: [""], //"娱乐健身器材",
      fixedAsset: [""], //"固定资产",
      comment: [""] //"备注"
    });

    this.getOrganFacilitiesInfo();
  }
  saveOrganFacilitiesInfo() {
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
      "organFacilitiesInfo/saveOrUpdate",
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

  getOrganFacilitiesInfo() {
    const that = this;
    this.httpReq.post("/organFacilitiesInfo/list", null, null, data => {
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
