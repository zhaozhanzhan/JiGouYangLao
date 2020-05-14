import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { GlobalService } from '../../../common/service/GlobalService';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-storehouse-classification',
  templateUrl: './storehouse-classification.component.html',
  styleUrls: ['./storehouse-classification.component.css']
})
export class StorehouseClassificationComponent implements OnInit {
  list = [];

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
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
    }

    this.updateList();
  }

  turnToAdd() {
    this.router.navigate(['addEdit', { state: 'add' }], { relativeTo: this.route });
  }

  turnToEdit(storehouseClassification) {
    this.router.navigate(['addEdit', { storehouseClassification: JSON.stringify(storehouseClassification), state: 'edit' }], {
      relativeTo: this.route
    });
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post('donatedWarehouseCategory/listPage', null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data['status'] == 200) {
        this.list = data['data']['content'];
        this.page.total = data['data']['totalElements'];
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post('donatedWarehouseCategory/delete', null, { id: id }, data => {
        if (data['status'] == 200) {
          if (data['code'] == 0){
            this.message.success('删除成功！');
            this.updateList();
          }else{
            this.message.error(data.message);
          }

        }
      });
    });
  }
}
