import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { JsUtilsService } from '../../../../common/service/JsUtils.Service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Utils } from "../../../../common/utils/utils";
@Component({
  selector: 'app-employees',
  templateUrl: 'employees.component.html',
  styleUrls: ["employees.component.scss"]

})
export class EmployeesComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name:"",
    departmentId:"",
    status:"0",
    btime:"",
    etime:"",
    personType:"1"
  };
  isTableLoading = true;
  selectedDate=[]
  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService,
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.btime));
        this.selectedDate.push(new Date(this.reqObj.etime));
      }

    }

    this.updateList();
  }

   // 获得所有列表的信息
   updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.post('/employees/listCondition', null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data['code'] == 0) {
        const result=JSON.parse(data['data'])
        this.list =result.memo
        this.page.total = result['totalElements'];
      }
    });
  }

  turnToAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  turnToEdit(employee,e) {

    if (e) {
      e.preventDefault();
    }

    this.router.navigate(['add', { data: JSON.stringify(employee) }], { relativeTo: this.route });
  }

  turnToLinkGroup(employee) {
    this.router.navigate(['linkGroup', JSON.stringify(employee)], { relativeTo: this.route });
  }

  deLinkGroup(id) {
    this.modalService.confirm({
      nzTitle: '请确认是否从该班组移除？',
      nzContent: '',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.httpReq.post('schEmployees/del', null, { eid: id }, data => {
          this.isTableLoading = false;
          if (data['status'] == 200) {
            this.message.success('移除成功！');
            this.updateList();
          }
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => {}
    });
  }


  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]);
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]);
    } else {
      this.reqObj.btime = "";
      this.reqObj.etime = "";
    }
  }

}
