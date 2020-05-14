import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { FormBuilder, Validators } from "@angular/forms";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";
import { LocalStorage } from "../../../../common/service/local.storage";
@Component({
  selector: "app-storehouse-add-edit",
  templateUrl: "./storehouse-add-edit.component.html",
  styleUrls: ["./storehouse-add-edit.component.css"]
})
export class StorehouseAddEditComponent implements OnInit {
  storehouseId;

  validateForm;

  isBtnLoading = false;

  departmentList = [];
  storehouseClassificationList = [];
  accountList = [];
  userInfo;
  state = "";
  reqObjGoodName = "请选择所属部门";
  goodsClassificationNodes;
  departmentID = "";
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
      deptId: [undefined, [Validators.required]],
      account_ids: [undefined, [Validators.required]],
      comment: ["", []]
    });

    const storehouseStr = this.route.snapshot.paramMap.get("storehouse");
    this.state = this.route.snapshot.paramMap.get("state");
    if (storehouseStr) {
      const storehouse = JSON.parse(storehouseStr);
      this.departmentID = storehouse.department.id;
      // 修改时通过所属部门找到管理人员
      this.accountList = [];
      this.httpReq.post(
        "warehouse/listManagesByDep",
        null,
        { departmentId:  this.departmentID },
        data => {
          if (data["status"] == 200) {
            this.accountList = data["data"];
          }
        }
      );
      this.storehouseId = storehouse.id;
      this.validateForm.patchValue(storehouse);
      this.validateForm.patchValue({
        deptId: storehouse.department.id,
        account_ids: storehouse.accountIds
      });
    }

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.httpReq.post("department/listAll", null, {}, data => {
      if (data["status"] == 200) {
        this.departmentList = data["data"];
      }
    });

    this.goodsClassificationNodes = [];
    this.httpReq.post("/department/listTreeAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        result.forEach(element => {
          this.goodsClassificationNodes.push(new NzTreeNode(element));
        });
        if (this.state == "edit") {
          console.log("this.departmentID" + this.departmentID);
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

  back() {
    history.back();
  }
  /**
   * 选择了部门的监听
   *
   * @param {*} event
   * @memberof StorehouseAddEditComponent
   */
  onSelectedDep(event) {
    if (this.validateForm.controls.account_ids) {
      this.validateForm.controls.account_ids.setValue(null);
    }
    this.accountList = [];
    this.httpReq.post(
      "warehouse/listManagesByDep",
      null,
      { departmentId: event },
      data => {
        if (data["status"] == 200) {
          this.accountList = data["data"];
        }
      }
    );
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
    console.log(typeof(reqObj.account_ids))
    console.log(reqObj.accountIds)
    reqObj.accountIds = reqObj.account_ids.join(",");
    delete reqObj.account_ids;
    this.isBtnLoading = true;

    if (!this.storehouseId) {
      this.httpReq.post("warehouse/save", null, reqObj, data => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        }
      });
    } else {
      reqObj.id = this.storehouseId;
      this.httpReq.post("warehouse/edit", null, reqObj, data => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        }
      });
    }
  }
}
