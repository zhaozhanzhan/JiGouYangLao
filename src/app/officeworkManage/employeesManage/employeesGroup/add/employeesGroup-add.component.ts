import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzTreeNode, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utils } from "../../../../common/utils/utils";

@Component({
  selector: "app-employeesGroup-add",
  templateUrl: "./employeesGroup-add.component.html",
  styleUrls: ["./employeesGroup-add.component.scss"]
})
export class EmployeesGroupAddComponent implements OnInit {
  allMonitors = [];
  roomIds;
  roomNames;

  buildingTree;
  employeesGroup;

  validateForm: FormGroup;
  isSaveBtnLoading = false;
  departmentId

  reqObjGoodName = "请选择所属部门"; //获得部门的placehold
  goodsClassificationNodes; //部门的节点
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  nodes = [];

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      nzSelectTreeData: [null, [Validators.required]],
      selectMonitors: [null, [Validators.required]],
      departmentId: ["", [Validators.required]]
    });

    const employeesGroupStr = this.route.snapshot.paramMap.get("employeeGroup");

    if (employeesGroupStr) {
      this.employeesGroup = JSON.parse(employeesGroupStr);
      console.log( this.employeesGroup)
      this.departmentId= this.employeesGroup.departmentId
      // console.log(this.departmentId)
      this.validateForm.patchValue({ name: this.employeesGroup.name });
      this.validateForm.patchValue({ departmentId:  this.departmentId });
      
      // this.nzSelectTreeData = JSON.parse(employeesGroup.nzSelectTreeData);
    }

    this.nodes = [];
    this.httpReq.get("building/all1", null, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        this.buildingTree = result;
        this.nodes.push(new NzTreeNode(result));

        if (this.employeesGroup && this.employeesGroup.nzSelectTreeData) {
          this.validateForm.patchValue({
            nzSelectTreeData: JSON.parse(this.employeesGroup.nzSelectTreeData)
          });
        }
      }
    });

    this.httpReq.post("employees/mlist", null, {}, data => {
      if (data["status"] == 200) {
        this.allMonitors = data["data"];
        if (
          this.employeesGroup &&
          Utils.isNotEmpty(this.employeesGroup.monitorIds)
        ) {
          this.validateForm.patchValue({
            selectMonitors: this.employeesGroup.monitorIds.split(",")
          });
        }
      }
    });

    this.getDepartmentNode();
  }


  // 获得所有的部门节点
  getDepartmentNode() {
    //  获得部门的数据
    this.goodsClassificationNodes = [];
    this.httpReq.post("/department/listTreeAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        result.forEach(element => {
          this.goodsClassificationNodes.push(new NzTreeNode(element));
          if (this.departmentId != "") {
            this.getReqObjGoodName(this.goodsClassificationNodes,this.departmentId);
           
          }
        });
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
  test() {
    this.validateForm.patchValue({
      nzSelectTreeData: ["402881ec62d782790162d782f8f100a5"]
    });
  }

  back() {
    history.back();
  }

  onSubmit() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }

    let reqObj = this.validateForm.value;
    reqObj.monitorIds = reqObj.selectMonitors.join(",");
    this.dealData(reqObj.nzSelectTreeData);
    reqObj.roomIds = this.roomIds;
    reqObj.roomNames = this.roomNames;

    delete reqObj.selectMonitors;
    delete reqObj.value;

    this.isSaveBtnLoading = true;


    if (!this.employeesGroup || !this.employeesGroup.id) {
      this.httpReq.post("schedulingProgram/save", null, reqObj, data => {
        this.isSaveBtnLoading = false;
        if (data["status"] == 200) {
          this.isSaveBtnLoading = false;
          this.message.success("保存成功！");
          this.back();
        }
      });
    } else {
      reqObj.id = this.employeesGroup.id;
      this.httpReq.post("schedulingProgram/edit", null, reqObj, data => {
        this.isSaveBtnLoading = false;
        if (data["status"] == 200) {
          this.isSaveBtnLoading = false;
          this.message.success("保存成功！");
          this.back();
        }
      });
    }
  }

  onChange($event: NzTreeNode): void {}

  dealData(value: string[]) {
    let ids = [];
    let names = [];
    if (value.indexOf("1", 0) != -1) {
      this.buildingTree.children.forEach(e => {
        e.children.forEach(e2 => {
          e2.children.forEach(e3 => {
            ids.push(e3.key);
            names.push(e3.name);
          });
        });
      });
    }

    this.buildingTree.children.forEach(e => {
      if (value.indexOf(e.key, 0) != -1) {
        e.children.forEach(e2 => {
          e2.children.forEach(e3 => {
            ids.push(e3.key);
            names.push(e3.name);
          });
        });
      }

      e.children.forEach(e2 => {
        if (value.indexOf(e2.key, 0) != -1) {
          e2.children.forEach(e3 => {
            ids.push(e3.key);
            names.push(e3.name);
          });
        }

        e2.children.forEach(e6 => {
          if (value.indexOf(e6.key, 0) != -1) {
            ids.push(e6.key);
            names.push(e6.name);
          }
        });
      });
    });
    this.roomIds = ids.join(",");
    this.roomNames = names.join(",");
  }
}
