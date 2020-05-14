import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";

@Component({
  selector: "app-storehouse-classification-add-edit",
  templateUrl: "./storehouse-classification-add-edit.component.html",
  styleUrls: ["./storehouse-classification-add-edit.component.css"]
})
export class StorehouseClassificationAddEditComponent implements OnInit {
  storehouseClassificationId;

  validateForm;

  isBtnLoading = false;
  userInfo;

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: ["", [Validators.required]],
      comment: ["", []]
    });

    const storehouseClassificationStr = this.route.snapshot.paramMap.get(
      "storehouseClassification"
    );
    if (storehouseClassificationStr) {
      const storehouseClassification = JSON.parse(storehouseClassificationStr);
      this.storehouseClassificationId = storehouseClassification.id;
      this.validateForm.patchValue(storehouseClassification);
    }

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
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
    reqObj.accountId = this.userInfo.id;
    this.isBtnLoading = true;

    if (!this.storehouseClassificationId) {
      this.httpReq.post("donatedWarehouseCategory/save", null, reqObj, data => {
        this.isBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    } else {
      reqObj.id = this.storehouseClassificationId;
      this.httpReq.post("donatedWarehouseCategory/edit", null, reqObj, data => {
        this.isBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    }
  }
}
