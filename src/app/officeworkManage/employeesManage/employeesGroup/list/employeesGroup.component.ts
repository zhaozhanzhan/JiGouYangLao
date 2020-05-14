import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: 'app-employeesGroup',
  templateUrl: 'employeesGroup.component.html',
  styleUrls: ['./employeesGroup.component.scss']
})
export class EmployeesGroupComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: ''
  };

  isTableLoading = true;
  careModel = false;
  careModelData:any;
  selGroup:any;
  allGroup:any;
  constructor(private httpReq: HttpReqService, private router: Router,private message: NzMessageService, private route: ActivatedRoute) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
    }

    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
      this.page.size = 10;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post('schedulingProgram/list', null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data['status'] == 200) {
        const result = JSON.parse(data['data']);
        this.list = result['memo']; // 数据列表
        console.log(this.list)
        this.page.total = result['totalElements']; // 总条数
      }
    });
  }

  turnToAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  turnToEdit(employeeGroup) {
    this.router.navigate(['add', { employeeGroup: JSON.stringify(employeeGroup) }], { relativeTo: this.route });
  }

  // 绑定护理计划
  bindCarePlan(data){
    this.careModelData = data;
    this.selGroup = data["servicePlanId"];
    this.httpReq.post('service_plan/listAll',null,{},res=>{
      if(res.code === 0){
        this.allGroup = res.data;
      }
    });
    this.careModel = true;
  }
  careModelCancel(){
    this.careModel = false;
  }
  careModelOk(){
    let sendData = {
      // {"schProgramId":"班组id","planId":"计划id","accountId": "账户id"}
      schProgramId: this.careModelData.id,
      planId: this.selGroup,
      accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id
    }
    this.isTableLoading = true;
    this.httpReq.post("service_plan/schProgramBindPlan",null,sendData,data=>{
      this.isTableLoading = false;
      if(data.code === 0){
        this.message.success("操作成功！");
        this.updateList();
      }
    })
    this.careModel = false;
  }






}
