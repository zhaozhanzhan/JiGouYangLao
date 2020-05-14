import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-addDictionaryData",
  templateUrl: "./addDictionaryData.component.html",
  styleUrls: ["./addDictionaryData.component.scss"]
})
export class AddDictionaryDataComponent implements OnInit {
  validateForm;
  tempDataId; // 医疗字典数据ID
  managementId; //医疗字典管理表ID
  tempData;
  templateType;
  isBtnLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    /**
     * "tempDataDescribe":"模板标签"
     * "tempDataValue":"模板键值"
     * "tempDataOrder":"排序号"
     * "tempDataContent":"模板描述"
     */
    this.validateForm = this.fb.group({
      tempDataDescribe: ["", [Validators.required]],
      tempDataValue: ["", [Validators.required]],
      tempDataOrder: ["", [Validators.required]],
      tempDataContent: ["", []]
    });
    this.managementId = this.route.snapshot.paramMap.get("managementId");
    this.templateType = this.route.snapshot.paramMap.get("templateType");
    const tempDataStr = this.route.snapshot.paramMap.get("info");
    // console.log(this.managementId);
    // console.log(this.templateType);
    // console.log(tempDataStr);
    if (tempDataStr) {
      this.tempData = JSON.parse(tempDataStr);
      this.tempDataId = this.tempData.id;
      this.validateForm.patchValue(this.tempData);
    }
  }

  back() {
    history.back();
  }


  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    let reqObj = this.validateForm.value;
    reqObj.managementId = this.managementId;

    this.isBtnLoading = true;
    if (!this.tempDataId) {
      this.httpReq.post(
        "clinic/save",
        null,
        reqObj,
        data => {
          this.isBtnLoading = false;
          if (data["status"] == 200) {
            if (data["code"] == 0) {
              this.message.success("保存成功！");
              this.back();
            } else {
              this.message.error(data.message);
            }
          }
        }
      );
    } else {
      reqObj.id = this.tempDataId;
      this.httpReq.post(
        "clinic/save",
        null,
        reqObj,
        data => {
          this.isBtnLoading = false;
          if (data["status"] == 200) {
            if (data["code"] == 0) {
              this.message.success("保存成功！");
              this.back();
            } else {
              this.message.error(data.message);
            }
          }
        }
      );
    }
  }
}
