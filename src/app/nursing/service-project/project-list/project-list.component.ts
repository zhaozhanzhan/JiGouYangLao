import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  // 请求参数
  sendData = {
    project: "", // 服务项目
    classify: "", // 服务类别
    cycle: "", // 服务周期
    object: "", // 服务对象
    level: "", // 护理等级
    page: 0, //页数
    size: 50 //每页数量
  };

  Loading = false; // 列表Loading
  listOfData = []; // 服务项目列表
  totalElements; // 总条数

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

  // 获取服务项目列表
  getList(renewPage:boolean = false) {
    if(renewPage) this.sendData.page = 0;
    this.Loading = true;
    this.httpReq.post("service_item/listPage", null, this.sendData, data => {
      sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
      this.Loading = false;
      if (data.code == 0) {
        this.listOfData = data.data.content;
        this.listOfData.forEach((item:object)=>{
          if(item["picEl"]){
            item["picEl"] = JSON.parse(item["picEl"]);
          }
        })
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
  goAddPage(opt:String,id:String=""){
    if (opt !== "add" && !id) {
      return;
    }
    if(opt === "add") this.router.navigate(['add'],{relativeTo:this.route.parent});
    if(opt === "edit") this.router.navigate(['add',{id:id,opt:"edit"}],{relativeTo:this.route.parent});
    if(opt === "check") this.router.navigate(['add',{id:id,opt:"check"}],{relativeTo:this.route.parent});
  }
  // 修改图标
  goPicPage(data){
    if (!data.id) {
      return;
    }
    let msg = {
      id: data.id,
      project: data.project,
      diyIconInfo: data.picEl,
      classify: data.classifyName
    }
    this.router.navigate(['icon',{info:JSON.stringify(msg)}],{relativeTo:this.route.parent});
  }
  // 删除
  delete(id,proName){
    if(id){
      this.modalService.confirm({
        nzTitle: `确认删除该服务项目：${proName}？`,
        nzOnOk: () => {
          this.Loading = true;
          this.httpReq.post("service_item/delete",null,{accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id,id: id},data => {
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

}
