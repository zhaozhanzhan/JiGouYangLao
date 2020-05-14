import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzTreeNode, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utils } from "../../../../common/utils/utils";

@Component({
  selector: "app-nurseGroup-add",
  templateUrl: "./nurseGroup-add.component.html",
  styleUrls: ["./nurseGroup-add.component.scss"]
})
export class NurseGroupAddComponent implements OnInit {
  allMonitors: any;
  baseUrl;
  employeesGroup;
  validateForm: FormGroup;
  isSaveBtnLoading = false;
  inpatientArea = [];
  goodsClassificationNodes; //部门的节点
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      departmentId: [null],
      monitorIds: [null, [Validators.required]]
    });
    this.baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    const employeesGroupStr = this.route.snapshot.paramMap.get("employeeGroup");

    if (employeesGroupStr) {
      this.employeesGroup = JSON.parse(employeesGroupStr);
      console.log(this.employeesGroup);
      this.validateForm.patchValue({ name: this.employeesGroup.name });
    }

    this.httpReq.post("nurseTeam/nurseListAll", null, {}, data => {
      if (data["status"] == 200) {
        this.allMonitors = data["data"];
        if (
          this.employeesGroup &&
          Utils.isNotEmpty(this.employeesGroup.monitor)
        ) {
          this.validateForm.patchValue({
            monitorIds: this.employeesGroup.monitorId.split(",")
          });
        }
      }
    });

    this.getDepartmentNode();
    console.log(this.goodsClassificationNodes);
  }

  // 获得所有的病区节点
  getDepartmentNode() {
    //  获得病区的数据
    this.goodsClassificationNodes = [];
    this.httpReq.post("sickWard/listAll", null, {}, data => {
      if (data["code"] == 0) {
        this.inpatientArea = data["data"];
        if (
          this.employeesGroup &&
          Utils.isNotEmpty(this.employeesGroup.sickWard)
        ) {
          this.validateForm.patchValue({
            departmentId: this.employeesGroup.sickWardId
          });
          console.log(this.validateForm.value);
        }
      }
    });
  }

  back() {
    history.back();
  }

  onSubmit() {
    const that = this;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }

    let reqObj = this.validateForm.value;
    reqObj.monitorIds = reqObj.monitorIds.join(",");
    console.log(reqObj);
    // return;

    this.isSaveBtnLoading = true;
    if (!this.employeesGroup || !this.employeesGroup.id) {
      /* 新增班组
      {"name":"护士班组名称",
      "monitorIds":"班长（多个用英文逗号隔开）",
      "departmentId": "病区id"}
      */
      const url = this.baseUrl + "nurseTeam/add";
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
          console.log(err);
        });
    } else {
      /* 编辑班组
      {"id":"护士班组Id",
      "name":"护士班组名称",
      "monitorIds":"班长（多个用英文逗号隔开）",
      "departmentId": "病区id"}
      */
      reqObj.id = this.employeesGroup.id;
      const url = this.baseUrl + "nurseTeam/edit";
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
          console.log(err);
        });
    }
  }
}
