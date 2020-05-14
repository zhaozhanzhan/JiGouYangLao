import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { GlobalService } from '../../../common/service/GlobalService';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../common/service/local.storage';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    propertyNumbers: '',
    propertyName: '',
    warehousingDepartment: ''
  };

  isTableLoading = true;
  user;
  accountId;

  // 绑定部门
  officeModel = false;
  officeModelData: any;

  // 部门列表
  departmentList = [];
  // 选择的部门ID
  selDepartmentId = '';

  // 处理
  handleModel = false;
  handleModelData: any;

  // 选择的资产状态
  selPropertyState = '';

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage //存储
  ) { }

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.accountId = this.user.data.id;

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }

    this.updateList();
    this.getDepartmentList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post('propertyInfo/listPage', null, this.reqObj, res => {
      this.isTableLoading = false;
      if (res.status == 200) {
        this.list = res.data.content;
        this.page.total = res.data.totalElements;
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post('propertyInfo/delete', null, { id: id, accountId: this.accountId },
        data => {
          if (data.code == 0) {
            this.message.success('删除成功！');
            this.updateList();
          }
        }
      );
    });
  }

  // 跳转到添加、修改页面
  addEdit(type, data = {}) {
    if (type == 'ADD') {
      this.router.navigate(['../addEdit', { addOrEdit: type }], { relativeTo: this.route });
    } else if (type == 'EDIT') {
      this.router.navigate(['../addEdit', { addOrEdit: type, data: JSON.stringify(data) }], {
        relativeTo: this.route
      });
    } else {
    }
  }

  // 绑定部门弹框
  showOfficeModel(data) {
    console.log('TCL: showOfficeModel -> data', data);
    this.officeModelData = data;
    this.selDepartmentId = ''
    if (this.officeModelData.warehousingDepartment) {
      const departments = this.departmentList.filter(item => {
        return item.id == this.officeModelData.id;
      })
      this.selDepartmentId = departments.length > 0 ? departments[0].id : '';
    }
    this.officeModel = true;
  }

  officeModelCancel() {
    this.officeModelData = {};
    this.selDepartmentId = ''
    this.officeModel = false;
  }

  officeModelOk() {
    const sendData = {
      id: this.officeModelData.id,
      warehousingDepartment: this.selDepartmentId
    };
    this.httpReq.post(
      'propertyInfo/changeDepartment', null, sendData, res => {
        if (res.code == 0) {
          this.message.success('调拨成功');
          this.officeModel = false;
          this.officeModelData = {};
          this.selDepartmentId = ''
          this.updateList();
        }
      }
    );
  }

  getDepartmentList() {
    this.httpReq.post('department/listAll', null, {}, res => {
      if (res.status == 200) {
        this.departmentList = res.data;
      }
    });
  }

  // 处理弹框
  showHandleModel(data) {
    this.handleModelData = data;
    this.selPropertyState = '';
    this.handleModel = true;
  }

  handleModelCancel() {
    this.handleModelData = {};
    this.selPropertyState = '';
    this.handleModel = false;
  }

  handleModelOk() {
    const sendData = {
      id: this.handleModelData.id,
      propertyState: this.selPropertyState
    };
    this.httpReq.post(
      'propertyInfo/dealWith', null, sendData, res => {
        if (res.code == 0) {
          this.message.success('资产处理成功');
          this.handleModel = false;
          this.handleModelData = {};
          this.selPropertyState = '';
          this.updateList();
        }
      }
    );

  }

}
