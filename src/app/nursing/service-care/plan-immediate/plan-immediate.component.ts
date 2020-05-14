import { Component, OnInit, Input } from '@angular/core';
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as _ from 'underscore';

@Component({
  selector: 'app-plan-immediate',
  templateUrl: './plan-immediate.component.html',
  styleUrls: ['./plan-immediate.component.css']
})
export class PlanImmediateComponent implements OnInit {
  @Input() planid; // 所属计划id
  planName = ""; // 所属计划名称
  loading = false; // loading
  inTimeInfoLoading = false; // 时间段信息loading
  addServiceModelIsVisible = false; // 添加服务弹框
  checkProModelIsVisible = false; // 查看详情弹框
  checkLoading = false; // 查看loading

  InTimeInfoProject = []; // 某时段项目列表
  // 添加服务弹框数据请求参数
  sendData = {
    project: "", // 服务项目
    classify: "", // 服务类别
    cycle: "即时", // 服务周期
    object: "人", // 服务对象
    level: "", // 护理等级
    planId: "", // 所选计划id
    page: 0, //页数
    size: 20 //每页数量
  };
  addServiceModelLoading = false;
  listOfData = []; // 添加服务弹框数据
  totalElements; // 添加服务弹框数据总条数
  allChecked = false; // 是否全选
  isPartSel = false; // 是否半选中
  checkServiceArr = []; // 选中的服务项目
  addProMode = ""; // 添加方式
  listOfService = []; // 导入计划-->服务计划列表
  sysProClassify:any; // 系统项目
  sysProject:any; // 系统项目
  showCareLevel = false; // 是否显示护理等级
  // 查看表单数据
  formData = {
    accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id,
    project: "", // 项目名称
    classify: "", // 项目类别
    systemPro: "", // 系统项目
    systemProName: "", // 系统项目
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
  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getImmediateList();
    this.getSysProClassify();
  }

  // 获取服务列表
  getImmediateList(){
    this.loading = true;
    this.httpReq.post('care_service/listInstant',null,{oldmanId: this.planid},data=>{
      this.loading = false;
      if(data.code === 0){
        let arr = [];
        if(data.data instanceof Array){
          arr = data.data.map(item=>{
            let x = item["serviceItem"];
            x["classify"] = x["classifyName"];
            if(x["picEl"]){
              x["picEl"] = JSON.parse(x["picEl"]);
            }
            return x;
          });
        }
        this.InTimeInfoProject = arr;
      }
    })
  }


  // 
  goback(){
    window.history.back();
  }

  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓弹框添加服务相关↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓//
  // 添加服务
  addService(mode:String){
    if(mode === 'addPro') {
      this.addProMode = "addPro";
      setTimeout(()=>{this.getList(true)},500);
    }
    if(mode === 'importPro') {
      this.addProMode = "importPro";
      setTimeout(()=>{this.getPlanList()},500);
    }
    this.addServiceModelIsVisible = true;
  }
  addServiceModelOk(){
    let projectIds = [];
    this.checkServiceArr.forEach(item=>{
      if(item['id']) projectIds.push(item['id']);
       else {};
    });
    let sendData = {
      // {"oldmanId": "老人id","projectIds":"服务项目ids","accountId": "账户id"}
      oldmanId: this.planid,
      projectIds: projectIds.join(","),
      accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id
    }
    this.addServiceModelLoading = true;
    this.httpReq.post('care_service/saveInstant',null,sendData,data=>{
      this.addServiceModelLoading = false;
      if(data.code === 0){
        this.message.success("添加成功！");
        this.getImmediateList();
      }
    });
    this.addServiceModelIsVisible = false;
  }
  addServiceModelCancel(){
    this.addServiceModelIsVisible = false;
  }
  // 获取服务项目列表
  getList(renewPage:boolean = false) {
    if(renewPage) this.sendData.page = 0;
    this.addServiceModelLoading = true;
    this.checkServiceArr = [];
    this.isPartSel = this.allChecked = false;
    this.httpReq.post("service_item/listPage", null, this.sendData, data => {
      this.addServiceModelLoading = false;
      if (data.code == 0) {
        this.listOfData = data.data.content;
        this.listOfData.forEach((item:object)=>{
          item["checked"] = false;
          if(item["picEl"]){
            item["picEl"] = JSON.parse(item["picEl"]);
          }
        })
        this.totalElements = data.data.totalElements;
      }
    });
  }
  // 获取服务计划
  getPlanList(){
    this.addServiceModelLoading = true;
    this.httpReq.post("service_plan/listAll", null, {}, data => {
      this.addServiceModelLoading = false;
      if (data.code == 0) {
        this.listOfService = data.data;
        if(this.listOfService.length) {
          this.sendData.planId = this.listOfService[0].id;
          this.getServiceList(true)
        }
      }
    });
  }
  // 根据某服务计划查找项目列表
  getServiceList(renewPage:boolean = false){
    if(renewPage) this.sendData.page = 0;
    this.addServiceModelLoading = true;
    this.checkServiceArr = [];
    this.isPartSel = this.allChecked = false;
    this.httpReq.post("service_plan/listForMonth", null, this.sendData, data => {
      this.addServiceModelLoading = false;
      if (data.code == 0) {
        let arr = data.data.content.map(item=>{
          let x = item["serviceItem"];
          x["checked"] = false;
          x["classify"] = x["classifyName"];
          if(x["picEl"]){
            x["picEl"] = JSON.parse(x["picEl"]);
          }
          return x;
        });
        this.listOfData = arr;
        this.totalElements = data.data.totalElements;
      }
    });
  }
  // 页码变更
  PageIndexChange(PageIndexNum) {
    this.sendData.page = PageIndexNum - 1;
    this.getList();
  }

  // 每页条数变更
  PageSizeChange(PageSize) {
    this.sendData.size = PageSize;
    this.getList();
  }

  // 选中
  checkBoxChange(data) {
    data.checked = !data.checked;
    if (data.checked) {
      if (
        this.checkServiceArr.every(item => {
          return item.id !== data.id;
        })
      )
        this.checkServiceArr.push(data);
    } else {
      let delete_index;
      if (
        this.checkServiceArr.some((item, index) => {
          if (item.id == data.id)
            delete_index = index;
          return item.id == data.id;
        })
      )
        this.checkServiceArr.splice(delete_index, 1);
    }
    // 全选
    if (this.checkServiceArr.length == this.listOfData.length) {
      this.isPartSel = false;
      this.allChecked = true;
    } else {
      if (this.checkServiceArr.length == 0) {
        this.isPartSel = false;
        this.allChecked = false;
      } else this.isPartSel = true;
    }
  }

  // 是否全选
  checkBoxAllChange() {
    this.allChecked = !this.allChecked;
    console.log(this.allChecked);
    this.isPartSel = false;
    if (this.allChecked) {
      this.listOfData.forEach(item => {
        item["checked"] = false;
        this.checkBoxChange(item);
      });
    } else {
      this.listOfData.forEach(item => {
        item["checked"] = false;
      });
      this.checkServiceArr = [];
    }
  }

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑弹框添加服务相关↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑//

  // 删除
  delete(id,proName){
    if(id){
      this.modalService.confirm({
        nzTitle: `确认删除该服务项目：${proName}？`,
        nzOnOk: () => {
          this.inTimeInfoLoading = true;
          // {"oldmanId": "老人id","projectIds":"服务项目ids","accountId": "账户id"}
          let sendData = {
            oldmanId: this.planid,
            projectIds: id,
            accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id
          };
          this.httpReq.post("care_service/deleteInstant",null,sendData,data => {
            this.inTimeInfoLoading = false;
              if (data.code == 0) {
                this.message.success("操作成功！");
                this.getImmediateList();
              }
            }
          );
        }
      });
    }
  }

  // 查看
  check(id){
    this.checkProModelIsVisible = true;
    this.checkLoading = true;
    this.httpReq.post("service_item/listOne", null, {id:id}, data => {
      this.checkLoading = false;
      if (data.code == 0) {
        let info =  data["data"];
        if(info["classify"]){
          this.getSysProject(info["classify"]);
        }
        info["diy"] = JSON.parse(info["diy"]);
        info["level"] = JSON.parse(info["level"]);
        _.extend(this.formData, info);
        if(info["object"] === "人"){ this.showCareLevel = true; };
      }
    });
  }
  // 获取系统项目
  getSysProject(id){
    if(id){
      this.httpReq.post("service_item/listSystemPro", null, {classifyId:id}, data => {
        if (data.code == 0) {
          this.sysProject = data.data;
        }
      });
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
  checkProModelCancel(){
    this.checkProModelIsVisible = false;
  }


}
