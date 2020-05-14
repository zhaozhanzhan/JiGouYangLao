import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from '../../../../common/service/GlobalService';

@Component({
  selector: 'app-schTemplet',
  templateUrl: 'schTemplet.component.html'
})
export class SchTempletComponent implements OnInit {
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

  isTableLoading = true;

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

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
    this.httpReq.post('scheduling/list', null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data['status'] == 200) {
        this.list = data['data']['content']; // 数据列表
        this.page.total = data['data']['totalElements']; // 总条数
      }
    });
  }

  turnToAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  turnToEdit(schTemplet) {
    this.router.navigate(['add', { schTemplet: JSON.stringify(schTemplet) }], { relativeTo: this.route });
  }

  deleteSchTemplet(id) {
    this.globalService.delModal(() => {
      this.httpReq.post('scheduling/del', null, { id: id }, data => {
        this.isTableLoading = false;
        if (data['status'] == 200 && data['code'] == 0) {
          this.message.success('删除成功！');
          this.updateList();
        } else {
          this.message.error(data['message']);
        }
      });
    });
  }
}
