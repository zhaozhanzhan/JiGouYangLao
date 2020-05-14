import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as _ from 'underscore';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  @ViewChild('inputElement') inputElement: ElementRef; // 输入框HTMLElement
  opt = ""; //  模式 add \ edit \ check
  tags = []; // 自定义添加选项
  inputVisible = false; // 自定义中input是否可见
  inputValue = ''; // 输入值
  isShowDiyOption = true; // 添加选项是否可见
  addDIYisSave = false; // 是否点击过保存 用于样式
  loading = false; // Loading
  showCareLevel = false; // 是否显示护理等级
  isLevel = false; // 是否有选中护理级别
  isSave = false; // 是否点击过保存 用于样式
  shakeRed = false; // 控制是否添加shake样式
  addDIYisVisible = false; // 新增DIY弹框
  sysProClassify = []; // 系统项目类别
  checkModel = false; // 查看遮罩
  // 表单数据
  formData = {
    accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id,
    project: "", // 项目名称
    classify: "", // 项目类别
    systemClassify: "", // 系统项目类别
    systemPro: "", // 系统项目
    cycle: "", // 服务周期
    object: "", // 服务对象
    standard: "", // 工作标准
    orderNum: "", // 排序号
    level: [
      { label: "自理", value: "自理" },
      { label: "介助", value: "介助" },
      { label: "介护", value: "介护" }
    ], // 多选护理等级
    careLevel:"", // 护理等级
    needGoods: false, // 是否需要使用物品
    goods: "", // 物品名
    pieces: "", // 件数
    diy: [] // 自定义项
  };
  // 自定义弹框填入数据
  DiyBox = {
    title: "",
    classify: '单选',
    value: {},
    option: []
  }
  // 选择系统项目
  selSystemProisVisible = false;
  systemCla: any; // 系统类别arr
  systemPro: any; // 系统项目
  systemClaPro: any; // 系统类别val

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getSysProClassify();
    let id = this.route.snapshot.paramMap.get('id');
    if(id){
      console.log(id);
      this.opt = this.route.snapshot.paramMap.get('opt');
      console.log(this.opt);
      if(this.opt === 'check'){
        this.getProInfo(id);
        this.checkModel = true;
      }
      if(this.opt === 'edit'){
        this.getProInfo(id);
        this.isLevel = true;
      }
    }
  }

  // 获取系统项目类别
  getSysProClassify(){
    this.httpReq.post("service_item/listClassify", null, {}, data => {
      if (data.code == 0) {
        this.sysProClassify = data.data;
      }
    });
  }
  // 系统项目类别改变回调
  classifyChange(id){
    if(id) {
      this.formData.systemPro = "";
      this.getSysProject(id);
    }else {}
  }
  //
  projectChange(id){
    if (id) {
      for (let i = 0,l = this.systemPro.length; i < l; i++) {
        if(this.systemPro[i]["id"] === id){
          this.systemClaPro = this.systemPro[i]["caseName"];
          return
        }
      }
    }
  }
  // 获取系统项目
  getSysProject(id){
    if(id){
      this.httpReq.post("service_item/listSystemPro", null, {classifyId:id}, data => {
        if (data.code == 0) {
          this.systemPro = data.data;
          // if(this.formData.systemPro){
          //   this.projectChange(this.formData.systemPro);
          // }else{
          //   this.projectChange()
          //   this.formData.systemPro = this.systemPro[0]["caseName"]?this.systemPro[0]["caseName"]:"";
          // }
        }
      });
    }
  }
  
  // 服务对象改变
  objectChange(value){
    // console.log(value);
    if(value == "人") this.showCareLevel = true;
      else this.showCareLevel = false;
  }
  // 护理等级改变
  levelChange(value){
    // console.log(value);
    this.isLevel = value.some((item)=>{return item['checked']});
    let care = [];
    value.forEach((element:Object) => {
      if(element.hasOwnProperty("checked") && element["checked"]){
        care = [...care,element["value"]];
      }
    });
    this.formData.careLevel = care.join(',');
  }

  // 返回
  goback(){
    window.history.back();
  }

  // 添加自定义
  addDIY(){
    this.addDIYisVisible = true;
  }
  // 弹框 确认
  addDIYModelOk(){
    this.addDIYisSave = true;
    if(!this.DiyBox.title) return;
    if(this.DiyBox.classify !== "文字输入"){
      if(this.DiyBox.option.length < 2){
        this.message.error("请至少添加2个选项再进行保存！");
        return;
      }
    }
    if(this.formData.diy.some(item => { return item.title === this.DiyBox.title})){
      this.message.error("自定义项列表中已存在相同的标题项！");
      return;
    }
    if(this.DiyBox.classify === "多选"){
      let checkbox = this.DiyBox.option.map(item => {
        return { label: item, value: item }
      });
      this.DiyBox.value = checkbox;
    }else if(this.DiyBox.classify === "文字输入"){
      this.DiyBox.value = '';
    }
    this.formData.diy.push(JSON.parse(JSON.stringify(this.DiyBox)));
    this.addDIYisSave = false;
    this.clearDiyBox();
    this.addDIYisVisible = false;
  }
  // 弹框 取消
  addDIYModelCancel(){
    this.addDIYisSave = false;
    this.addDIYisVisible = false;
    this.clearDiyBox();
  }
  // 清除 弹框信息
  clearDiyBox(){
    this.tags = [];
    this.isShowDiyOption = true;
    this.DiyBox = {
      title: '',
      classify: '单选',
      value: {},
      option: []
    }
  }

  // 保存
  saveForm(){
    this.isSave = true;
    this.shakeRed = true;
    setTimeout(()=>{this.shakeRed = false;},1000);
    for(let key in this.formData){
      switch (key) {
        case "project":
          if(!this.formData.project){
            return;
          }
          
        case "classify":
          if(!this.formData.classify){
            return;
          }
          
        case "cycle":
          if(!this.formData.cycle){
            return;
          }
          
        case "object":
          if(!this.formData.object){
            return;
          }
          
        case "level":
          if(this.showCareLevel){
            if(!this.isLevel){
              return;
            }
          }
          
        default:
          break;
      }
    }
    console.log(this.formData);
    this.loading = true;
    this.httpReq.post("service_item/saveOrEdit", null, this.formData, data => {
      this.loading = false;
      if (data.code == 0) {
        this.message.success("保存成功");
        window.history.back();
      }
    });
  }

  // ------------------------------DIY添加选项相关------------------------------// 
  // 删除标签
  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }
  // 最多显示8个字符
  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 8;
    return isLongTag ? `${tag.slice(0, 8)}...` : tag;
  }
  // 点击添加 显示input
  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }
  // 确认添加
  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.DiyBox.option = this.tags;
    this.inputVisible = false;
  }
  // 自定义类型改变 
  DiyClassifyChange(value){
    if(value === "文字输入"){
      this.isShowDiyOption = false;
      this.tags = [];
    }else{
      this.isShowDiyOption = true;
    }
  }
  // ---------------------------------------------------------------------------//

  // 编辑、查看获取详情
  getProInfo(id){
    this.loading = true;
    this.httpReq.post("service_item/listOne", null, {id:id}, data => {
      this.loading = false;
      if (data.code == 0) {
        let info =  data["data"];
        this.systemClaPro = info["systemProName"];
        if(info["systemClassify"]){
          this.getSysProject(info["systemClassify"]);
        }
        info["diy"] = JSON.parse(info["diy"]);
        info["level"] = JSON.parse(info["level"]);
        _.extend(this.formData, info);
        if(info["object"] === "人"){ this.showCareLevel = true; };
      }
    });
  }

  // 删除自定义项
  deleteDiyItem(index){
    this.formData.diy.splice(index,1);
  }

  // 选择系统项目
  selSystemPro(){
    this.selSystemProisVisible = true;
    this.httpReq.post('service_item/listSystemClassify',null,{},data=>{
      if(data.code === 0){
        this.systemCla = data.data;
      }
    })
  }
  selSystemProModelOk(){
    this.selSystemProisVisible = false;
  }
  selSystemProModelCancel(){
    this.selSystemProisVisible = false;
  }

}
