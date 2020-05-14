import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormBuilder, Validators } from "@angular/forms";
import { NzMessageService, NzTreeNode, NzFormatEmitEvent } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-department-add-edit",
  templateUrl: "./department-add-edit.component.html",
  styleUrls: ["./department-add-edit.component.css"]
})
export class DepartmentAddEditComponent implements OnInit {
  departmentId;

  validateForm;

  isBtnLoading = false;
  userInfo;
  departmentList = [];
  goodsClassificationNodes;
  nodes = [];
  reqObjGoodName = "请选择所属部门";
  departmentID;

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      parentId: [""],
      name: ["", [Validators.required]],
      comment: ["", []]
    });

    this.httpReq.post("/department/listAll", null, null, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        console.log(data["data"]);
        this.departmentList = data["data"];
      }
    });
    const departmentStr = this.route.snapshot.paramMap.get("department");
    const state = this.route.snapshot.paramMap.get("state");

    if (state == "add") {
      const info = this.route.snapshot.paramMap.get("info");
      const infoNumber = JSON.parse(info);
      if (infoNumber.id == "") {
        this.validateForm.patchValue({ parentId: "0" });
        this.reqObjGoodName = "请选择所属部门";
      } else {
        this.validateForm.patchValue({ parentId: infoNumber.id });
        this.reqObjGoodName = infoNumber.name;
      }
    } else if (state == "edit") {
      const department = JSON.parse(departmentStr);
      this.departmentID = department.parentId;
      if (department.parentId != null) {
        this.validateForm.patchValue({ parentId: department.parentId });
      }
    }
    if (departmentStr) {
      const department = JSON.parse(departmentStr);

      this.departmentId = department.id;
      this.validateForm.patchValue(department);
    }

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.updateTree();

    this.goodsClassificationNodes = [];
    this.httpReq.post("/department/listTreeAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        result.forEach(element => {
          this.goodsClassificationNodes.push(new NzTreeNode(element));
        });
        if (state == "edit") {
          this.getReqObjGoodName(this.goodsClassificationNodes,this.departmentID);
        }
      }
    });
  }
 // 递归循环树形结构获得所属部门
 getReqObjGoodName(arr , departmentID:string){
  if(arr.length>0){
    arr.forEach(e => {
      if(e.key==departmentID){
        this.reqObjGoodName = e.title;
        return;
      }else{
        this.getReqObjGoodName(e.children,departmentID);
      }
    });
  }
}

  updateTree() {
    this.nodes = [];
    this.httpReq.post("/department/listTreeAll", null, {}, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        console.log(result);
        result.forEach(element => {
          this.nodes.push(new NzTreeNode(element));
        });
      }
    });
  }
  back() {
    history.back();
  }

  nzEvent(e: NzFormatEmitEvent): void {
    this.validateForm.patchValue({ parentId: e.node.origin.key });
    this.reqObjGoodName = e.node.origin.title;
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

    if (!this.departmentId) {
      this.httpReq.post("department/save", null, reqObj, data => {
        this.isBtnLoading = false;
        if (data["status"] == 200) {
          this.message.success("保存成功！");
          this.back();
        }
      });
    } else {
      reqObj.id = this.departmentId;
      this.httpReq.post("department/edit", null, reqObj, data => {
        this.isBtnLoading = false;
        if (data["status"] == 200) {
          this.message.success("保存成功！");
          this.back();
        }
      });
    }
  }
}
