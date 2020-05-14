import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { GlobalService } from '../../../common/service/GlobalService';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-nursingGrade',
  templateUrl: 'nursingGrade.component.html',
})
export class NursingGradeComponent implements OnInit {
  list;

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10
  };

  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.updateList();
  }

  turnToAddNursingGrade() {
    this.router.navigate(['info', { state: 'add' }], { relativeTo: this.route });
  }

  turnToEditNursingGrade(nursingGrade) {
    this.router.navigate(['info', { nursingGrade: JSON.stringify(nursingGrade), state: 'edit' }], { relativeTo: this.route });
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    this.isTableLoading = true;
    this.httpReq.post('careLevelCase/pageList', null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data['status'] == 200) {
        this.list = data['data']['content'];
        this.page.total = data['data']['totalElements'];
      }
    });
  }

  delNursingGrade(id) {
    this.globalService.delModal(() => {
      this.httpReq.post('careLevelCase/del', null, { id: id }, data => {
        if (data['status'] == 200) {
          this.message.success('删除成功！');
          this.updateList();
        }
      });
    });
  }

}
