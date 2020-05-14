import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { NzModalService,NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-nurse-group',
  templateUrl: './nurse-group.component.html',
  styleUrls: ['./nurse-group.component.css']
})
export class NurseGroupComponent implements OnInit {
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

  constructor(private httpReq: HttpReqService,private modalService: NzModalService,private message: NzMessageService, private router: Router, private route: ActivatedRoute) {}

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
    this.httpReq.post('nurseTeam/list', null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data['code'] == 0) {
        const result = data['data'];
        this.list = result['list']; // 数据列表
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

  deleteEmployee(id,e){
    this.modalService.confirm({
      nzTitle: '确认删除该班组？',
      nzContent: '',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.httpReq.post('/nurseTeam/del', null, { id: id }, data => {
          this.isTableLoading = false;
          if (data['code'] == 0) {
            this.message.success('删除成功！');
            this.updateList();
          }
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => {}
    });
  }
}
