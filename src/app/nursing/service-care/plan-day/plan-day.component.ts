import { Component, OnInit, Input } from '@angular/core';
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as _ from 'underscore';
@Component({
  selector: 'app-plan-day',
  templateUrl: './plan-day.component.html',
  styleUrls: ['./plan-day.component.css']
})
export class PlanDayComponent implements OnInit {
  @Input() planid; // 所属计划id
  planName = ""; // 所属计划名称
  loading = false; // loading
  timeLine = []; // 时段列表
  inTimeInfoLoading = false; // 时间段信息loading
  addTimeLineModelIsVisible = false; // 新增时段弹框
  addServiceModelIsVisible = false; // 添加服务弹框
  checkProModelIsVisible = false; // 查看详情弹框
  checkLoading = false; // 查看loading
  startTime = new Date();
  endTime = new Date();

  // 新增时段接口数据
  addTimeLineSendData = {
    // {"planId":"服务计划Id","startTime":"开始时间","endTime":"结束时间","accountId": "账户id"}
    // {"oldmanId": "老人id","startTime":"开始时间","endTime":"结束时间","accountId": "账户id"}
    oldmanId: "",
    accountId: "",
    startTime: "",
    endTime: ""
  }

  InTimeInfo:Object; // 某时段基本信息
  InTimeInfoProject = []; // 某时段项目列表
  // 添加服务弹框数据请求参数
  sendData = {
    project: "", // 服务项目
    classify: "", // 服务类别
    cycle: "日", // 服务周期
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
    systemProName: "", // 系统项目名称
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
    // this.planName = this.route.snapshot.paramMap.get('name');
    // this.planid = this.route.snapshot.paramMap.get('id');
    this.getSysProClassify();
    this.getDailyInfo(this.planid).then(data=>this.getInTimeInfo(data));
  }

  // 获取日计划信息
  getDailyInfo(id){
    this.loading = true;
    return new Promise((resolv)=>{
      this.httpReq.post("care_service/listDayInterval",null,{oldmanId:id},data=>{
        this.loading = false;
        if(data.code === 0){
          if(data["data"] instanceof Array) this.timeLine = data["data"];
          if(this.timeLine.length) resolv(this.timeLine[0]);
        }
      })
    });
  }

  // 
  goback(){
    window.history.back();
  }

  // 新增时段
  addTimeLine(){
    this.startTime = new Date();
    this.endTime = new Date();
    this.addTimeLineModelIsVisible = true;
  }
  // 限制结束时间：分 
  endTimeDisabledMinutes(hour: number){
    let hours = Array.from({length:24}, (v,k) => k);
    
  }
  addTimeLineModelOk(){
    if(this.endTime.getHours()<this.startTime.getHours() || (this.endTime.getHours()===this.startTime.getHours() && this.endTime.getMinutes()<=this.startTime.getMinutes())){
      this.message.error('选择结束时间要晚于开始时间');
      return;
    }
    this.addTimeLineSendData.startTime = `${this.startTime.getHours()<10?'0'+this.startTime.getHours():this.startTime.getHours()}:${this.startTime.getMinutes()<10?'0'+this.startTime.getMinutes():this.startTime.getMinutes()}`;
    this.addTimeLineSendData.endTime = `${this.endTime.getHours()<10?'0'+this.endTime.getHours():this.endTime.getHours()}:${this.endTime.getMinutes()<10?'0'+this.endTime.getMinutes():this.endTime.getHours()}`;
    this.addTimeLineSendData.accountId = JSON.parse(localStorage.getItem("UserInfo")).data.id;
    this.addTimeLineSendData.oldmanId = this.planid;
    this.addTimeLineModelIsVisible = false;
    this.loading = true;
    this.httpReq.post('care_service/saveCareDayInterval',null,this.addTimeLineSendData,data=>{
      this.loading = false;
      if(data.code === 0){
        this.message.success('操作成功！');
        this.getDailyInfo(this.planid);
      }
    })
  }
  addTimeLineModelCancel(){
    this.addTimeLineModelIsVisible = false;
  }


  // 点击某时间段获取相关信息
  getInTimeInfo(timeLineInfo){
    this.InTimeInfo = timeLineInfo;
    if(Object.hasOwnProperty.call(this.InTimeInfo,'id')){
      //  {"oldmanId": "老人id","id": "时段id"}
      this.inTimeInfoLoading = true;
      this.httpReq.post('care_service/listDay',null,{id:this.InTimeInfo['id'],oldmanId:this.planid},data=>{
        this.inTimeInfoLoading = false;
        if(data.code === 0){
          let arr = data.data.map((item,index)=>{
            let x = item["serviceItem"];
            if(x){
              x["classify"] = x["classifyName"];
              if(x["picEl"]){
                x["picEl"] = JSON.parse(x["picEl"]);
              }
              return x;
            }
          });
          const arr1 = arr.filter(item=>{return item});
          this.InTimeInfoProject = arr1;
        }
      })
    }
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
       else{}
    });
    let sendData = {
      // {"intervalId":"时段id","projectIds":"服务项目ids","accountId": "账户id"}
      intervalId: this.InTimeInfo['id'],
      projectIds: projectIds.join(","),
      accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id
    }
    this.addServiceModelLoading = true;
    this.httpReq.post('care_service/saveDay',null,sendData,data=>{
      this.addServiceModelLoading = false;
      if(data.code === 0){
        this.message.success("添加成功！")
        this.getInTimeInfo(this.InTimeInfo);
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
    this.httpReq.post("care_service/listForDay", null, this.sendData, data => {
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
          // {"intervalId":"时段id","projectIds":"服务项目ids","accountId": "账户id"}
          this.httpReq.post("care_service/deleteDay",null,{intervalId:this.InTimeInfo["id"],accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id,projectIds: id},data => {
            this.inTimeInfoLoading = false;
              if (data.code == 0) {
                this.message.success("操作成功！");
                this.getInTimeInfo(this.InTimeInfo);
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

  // 删除时间段
  deleltTime(data){
    console.log(data);
    // {"intervalId":"服务计划Id","accountId": "账户id"}
    this.loading = true;
    this.httpReq.post("care_service/deleteCareDayInterval",null,{intervalId:data.id,accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id},data=>{
      this.loading = false;
      if(data.code === 0){
        this.message.success("操作成功！");
        this.getDailyInfo(this.planid).then(data=>this.getInTimeInfo(data));
      }
    });
  }



























}
