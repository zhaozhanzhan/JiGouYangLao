import { Component, OnInit } from '@angular/core';
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {

  // 请求参数
  sendData = {
    planName: "", // 计划名称
    page: 0, //页数
    size: 50 //每页数量
  };
  Loading = false; // 列表Loading
  listOfData = []; // 服务项目列表
  totalElements; // 总条数
  addTabModelIsVisible = false; // 新增计划弹框

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url)) {
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      this.sendData.page = 0;
    }
    
    //
    this.getList(true);
  }

  // 获取计划列表
  getList(renewPage:boolean = false) {
    if(renewPage) this.sendData.page = 0;
    this.Loading = true;
    this.httpReq.post("service_plan/listPage", null, this.sendData, data => {
      sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
      this.Loading = false;
      if (data.code == 0) {
        this.listOfData = data.data.content;
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

  // 添加、查看、编辑 跳转
  goPage(opt:String,id:String="",name:String=""){
    if (!id) {
      return;
    }
    if(opt === "day") this.router.navigate(['day',{id:id,opt:"day",name:name}],{relativeTo:this.route.parent});
    if(opt === "week") this.router.navigate(['week',{id:id,opt:"week",name:name}],{relativeTo:this.route.parent});
    if(opt === "month") this.router.navigate(['month',{id:id,opt:"month",name:name}],{relativeTo:this.route.parent});
  }

  // 删除
  delete(id,proName){
    if(id){
      this.modalService.confirm({
        nzTitle: `确认删除该服务计划：${proName}？`,
        nzOnOk: () => {
          this.Loading = true;
          this.httpReq.post("service_plan/delete",null,{accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id,id: id},data => {
            this.Loading = false;
              if (data.code == 0) {
                this.message.success("操作成功！");
                this.getList();
              }
            }
          );
        }
      });
    }
  }

  // 添加
  addPlan(){
    this.addTabModelIsVisible = true;
  }
  // 弹框确认
  addTabModelOk(el:HTMLInputElement){
    if(el.value){
      this.Loading = true;
      this.httpReq.post("service_plan/save",null,{accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id,planName: el.value},data => {
          this.Loading = false;
          if (data.code == 0) {
            el.value = "";
            this.message.success("操作成功！");
            this.getList();
          }
        }
      );
    }
    this.addTabModelIsVisible = false;
  }
  // 弹框取消
  addTabModelCancel(el:HTMLInputElement){
    el.value = "";
    this.addTabModelIsVisible = false;
  }
}
