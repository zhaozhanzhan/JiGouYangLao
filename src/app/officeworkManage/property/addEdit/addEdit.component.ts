import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../common/service/local.storage";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { ActivatedRoute } from "@angular/router";
import { GlobalMethod } from "../../../common/service/GlobalMethod";
@Component({
  selector: "app-addEdit",
  templateUrl: "./addEdit.component.html",
  styleUrls: ["./addEdit.component.scss"]
})
export class AddEditComponent implements OnInit {
  public formData: FormGroup; // 基本信息定义表单对象
  user; //用户的详情信息
  departmentNodes; //部门的节点
  reqObjGoodName = "请选择部门";
  // departmentId;
  isSaveBtnLoading;

  // 添加或编辑状态；1为添加；2为编辑
  addOrEdit = 'ADD';

  constructor(
    private httpReq: HttpReqService, //数据请求
    private fb: FormBuilder, // 响应式表单,
    private localStorage: LocalStorage, //存储
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private msg: NzMessageService, // 消息提醒
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.formData = this.fb.group({
      id: [''], // id
      propertyNumbers: [''], //资产编号
      propertyName: ['', [Validators.required]], // 名称
      propertySpecifications: [''], // 规格
      propertyType: [''], //类型,
      num: ['', [Validators.required]], // 数量
      propertyState: [''], // 状态
      remark: [''],//备注
      accountId: ['']
    });

    // 当是修改时
    this.addOrEdit = this.route.snapshot.paramMap.get("addOrEdit");

    if (this.addOrEdit == 'EDIT') {
      let data = this.route.snapshot.paramMap.get("data");
      GlobalMethod.setForm(this.formData, JSON.parse(data));
    }

    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.formData.patchValue({
      accountId: this.user.data.id
    });
    this.getDepartmentNode();
  }

  // 获得所有的部门节点
  getDepartmentNode() {
    //  获得部门的数据
    this.departmentNodes = [];
    this.httpReq.post("/department/listTreeAll", null, {}, res => {
      if (res.code == 0) {
        const result = JSON.parse(res.data);
        result.forEach(element => {
          this.departmentNodes.push(new NzTreeNode(element));
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
    const formDataCtrl = this.formData.controls;
    const formData = this.jsUtil.deepClone(this.formData.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }

    if (this.formData.invalid) {
      // 表单较验未通过
      console.log(formData);
      return;
    }
    that.isSaveBtnLoading = true;
    if (this.addOrEdit == 'ADD') {
      this.httpReq.post("propertyInfo/add", null, formData, data => {
        that.isSaveBtnLoading = false;
        if (data.code == 0) {
          that.msg.success("保存成功！");
          this.back();
        } else {
          that.msg.error(data.message);
        }
      });
    } else {
      this.httpReq.post("propertyInfo/saveOrUpdate", null, formData, data => {
        that.isSaveBtnLoading = false;
        if (data.code == 0) {
          that.msg.success("保存成功！");
          this.back();
        } else {
          that.msg.error(data.message);
        }
      });
    }

  }

  // 返回按钮
  back() {
    history.back();
  }
}
