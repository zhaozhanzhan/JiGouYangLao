import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { ActivatedRoute } from "@angular/router";
import { GlobalMethod } from "../../../../common/service/GlobalMethod";
@Component({
  selector: "app-addEdit",
  templateUrl: "./addEdit.component.html",
  styleUrls: ["./addEdit.component.scss"]
})
export class AddEditComponent implements OnInit {
  public adminiInfoFormData: FormGroup; // 基本信息定义表单对象
  user; //用户的详情信息
  goodsClassificationNodes; //部门的节点
  reqObjGoodName = "请选择部门";
  // departmentId;
  isSaveBtnLoading;
  constructor(
    private httpReq: HttpReqService, //数据请求
    private fb: FormBuilder, // 响应式表单,
    private localStorage: LocalStorage, //存储
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private msg: NzMessageService, // 消息提醒
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.adminiInfoFormData = this.fb.group({
      // {"id":"科室id",
      // "name":"科室名称",
      // "comment":"备注",
      // "accountId":"账户Id",
      // "number":"科室号",
      // "phone":"科室电话"}
      id: [""], // "科室id",
      name: ["", [Validators.required]], // "科室名称",
      number: ["", [Validators.required]], // "科室号",
      phone: ["", [Validators.required]], // "科室电话",
      // departmentId: ["",], // "绑定部门id",
      accountId: ["", [Validators.required]], //"账户Id",
      comment: [""] //备注
    });

    // 当是修改时
    let data = this.route.snapshot.paramMap.get("data");
    if (data) {
      // this.departmentId = JSON.parse(data).department.id;
      GlobalMethod.setForm(this.adminiInfoFormData, JSON.parse(data)); // 表单赋值
      // this.adminiInfoFormData.patchValue({
      //   departmentId: this.departmentId
      // });
    }

    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.adminiInfoFormData.patchValue({
      accountId: this.user.data.id
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
          // if (this.departmentId != "") {
          //   this.getReqObjGoodName(this.goodsClassificationNodes,this.departmentId);
          // }
        });
      }
    });
  }

  // 递归循环树形结构获得所属部门
  //  getReqObjGoodName(arr , departmentID:string){
  //   if(arr.length>0){
  //     arr.forEach(e => {
  //       if(e.key==departmentID){
  //         this.reqObjGoodName = e.title;
  //         return;
  //       }else{
  //         this.getReqObjGoodName(e.children,departmentID);
  //       }
  //     });
  //   }
  // }
  // 保存按钮
  onSubmit() {
    const that = this;
    const formDataCtrl = this.adminiInfoFormData.controls;
    const formData = this.jsUtil.deepClone(this.adminiInfoFormData.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }

    if (this.adminiInfoFormData.invalid) {
      // 表单较验未通过
      console.log(formData);
      return;
    }
    that.isSaveBtnLoading = true;
    this.httpReq.post("/section_office/saveOrUpdate", null, formData, data => {
      that.isSaveBtnLoading = false;
      if (data["code"] == 0) {
        that.msg.success("保存成功！");
        this.back();
      } else {
        that.msg.error(data["message"]);
      }
    });
  }

  // 返回按钮
  back() {
    history.back();
  }
}
