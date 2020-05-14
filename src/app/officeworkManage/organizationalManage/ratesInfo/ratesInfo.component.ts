import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormGroup, FormBuilder} from "@angular/forms";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

@Component({
  selector: "app-organizationa-ratesInfo",
  templateUrl: "ratesInfo.component.html",
  styleUrls: ["./ratesInfo.component.css"]
})
export class RatesInfoInfoComponent implements OnInit {
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
      chargingType: "", //收费方式
      allLowCost: "", //全包收费最低费用
      allHighCost: "", //全包收费最高费用
      nursingLowCost: "", //护理费最低费用
      nursingHighCost: "", //护理费最高费用
      dietLowCost: "", //膳食费最低费用
      dietHighCost: "", //膳食费最高费用
      bedLowCost: "", //床位费最低费用
      bedHighCost: "", //床位费最高费用
      hydropowerCost: "", //水电费
      warmCost: "", //取暖费
      deposit: "", //押金
      comment: "" //备注
    });
    this.getOrganFeeScaleInfo();
  }




  saveOrganFeeScaleInfo() {
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
      "/organFeeScaleInfo/saveOrUpdate",
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

  getOrganFeeScaleInfo() {
    const that = this;
    this.httpReq.post("/organFeeScaleInfo/list", null, null, data => {
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
