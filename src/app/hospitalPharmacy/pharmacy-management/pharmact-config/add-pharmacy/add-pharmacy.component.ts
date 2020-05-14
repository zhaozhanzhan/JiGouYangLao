import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzTreeNode, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utils } from "../../../../common/utils/utils";
@Component({
  selector: "app-add-pharmacy",
  templateUrl: "./add-pharmacy.component.html",
  styleUrls: ["./add-pharmacy.component.css"]
})
export class AddPharmacyComponent implements OnInit {
  baseUrl;
  isSaveBtnLoading;
  validateForm: FormGroup;
  employeesGroup;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      medRoomName: [null, [Validators.required]],
      accountId: [JSON.parse(localStorage.UserInfo).data.id],
      id: []
    });
    this.baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    const employeesGroupStr = this.route.snapshot.paramMap.get("employeeGroup");

    if (employeesGroupStr) {
      this.employeesGroup = JSON.parse(employeesGroupStr);
      this.validateForm.patchValue({
        medRoomName: this.employeesGroup.medRoomName
      });
      this.validateForm.patchValue({ id: this.employeesGroup.id });
    }
  }

  back() {
    history.back();
  }

  onSubmit() {
    const that = this;
    this.isSaveBtnLoading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
    let reqObj = this.validateForm.value;
    /* 新增
    {"id":"药房id","medRoomName":"药房名称","accountId":"账户Id"}
    */
    const url = this.baseUrl + "med_room/saveOrUpdate";
    fetch(url, { method: "post", body: JSON.stringify(reqObj) })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        that.isSaveBtnLoading = false;
        if (res.code == 0) {
          this.message.success("保存成功！");
          this.back();
        } else {
          this.message.error(res.message);
        }
      })
      .catch(err => {
      });
  }
}
