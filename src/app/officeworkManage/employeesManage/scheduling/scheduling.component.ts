import { Utils } from '../../../common/utils/utils';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
import { JsUtilsService } from '../../../common/service/JsUtils.Service';
import { ENgxPrintComponent } from 'e-ngx-print';

@Component({
  selector: 'app-scheduling',
  templateUrl: 'scheduling.component.html',
  styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit {
  employeesGroupList;
  employeesGroupId;
  yearMonth;

  schedulingList;
  schedulingHead;
  schedulingTitile;
  length = 32;

  isSingleCreateModalVisible = false;
  singleCreateModalObj;
  schTempletList;
  schList;

  isSetNumberModalVisible = false;
  setNumberModalObj;

  isChangeSchedulingModalVisible = false;
  changeSchedulingModalObj;
  bancis;

  isTableLoading = false;

  printCSS = ['assets/css/ng-zorro-antd.min.css', 'assets/css/scheduling.component.css'];
  isPrintNow = false;
  @ViewChild('print')
  printComponent: ENgxPrintComponent;

  constructor(private httpReq: HttpReqService, private message: NzMessageService, private jsUtil: JsUtilsService) {}

  ngOnInit() {
    this.updateEmployeesGroupsList();
    this.schedulingHead = [];
    this.singleCreateModalObj = {};
    this.setNumberModalObj = {};
    this.changeSchedulingModalObj = {};
  }

  updateEmployeesGroupsList() {
    this.httpReq.post('schedulingProgram/list1', null, {}, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        this.employeesGroupList = data['data'];
      } else {
        this.message.error(data['message']);
      }
    });
  }

  listScheduling() {
    if (Utils.isEmpty(this.employeesGroupId)) {
      this.message.warning('请选择班组！');
      return;
    }
    if (Utils.isEmpty(this.yearMonth)) {
      this.message.warning('请选择时间！');
      return;
    }

    this.isTableLoading = true;

    this.makeTitle();
    const reqObj = { spid: this.employeesGroupId, yearMonth: this.jsUtil.dateFormat(this.yearMonth).substr(0, 7) };
    this.httpReq.post('schedulinginfo/list', null, reqObj, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        const result = JSON.parse(data['data']);
        this.schedulingList = result.value;
        this.schedulingHead = [];
        this.schedulingHead.push('序号');
        this.schedulingHead.push('姓名');
        let day = new Date(this.yearMonth.getFullYear(), this.yearMonth.getMonth() + 1, 0);
        let daycount = day.getDate();
        for (let index = 1; index <= daycount; index++) {
          let num = '';
          if (index < 10) {
            num = '0' + index;
          } else {
            num = String(index);
          }
          this.schedulingHead.push(num);
        }

        this.isTableLoading = false;
      } else {
        this.message.error(data['message']);
      }
    });
  }

  makeTitle() {
    let title;
    this.employeesGroupList.forEach(element => {
      if (element.id == this.employeesGroupId) {
        title = element.name;
      }
    });

    title += ' ' + this.yearMonth.getFullYear() + '年' + (this.yearMonth.getMonth() + 1) + '月排班';
    this.schedulingTitile = title;
  }

  createScheduling() {
    const reqObj = { spid: this.employeesGroupId, yearMonth: this.jsUtil.dateFormat(this.yearMonth).substr(0, 7) };
    this.httpReq.post('schedulinginfo/add', null, reqObj, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        this.listScheduling();
      } else {
        this.message.error(data['message']);
      }
    });
  }

  showSingleCreateModal(scheduling) {
    // console.log(scheduling);
    this.singleCreateModalObj.eid = scheduling.eid;
    this.singleCreateModalObj.ename = scheduling.ename;
    this.singleCreateModalObj.date = undefined;
    this.singleCreateModalObj.schTempletId = undefined;
    this.singleCreateModalObj.schTempletBanci = undefined;

    this.httpReq.post('scheduling/list', null, { page: '0', size: '100' }, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        this.schTempletList = data['data']['content'];
      } else {
        this.message.error(data['message']);
      }
    });

    this.isSingleCreateModalVisible = true;
  }

  singleCreateModalHandleOk() {
    if (this.singleCreateModalObj.date == undefined) {
      this.message.warning('请选择开始日期！');
      return;
    }
    if (this.singleCreateModalObj.schTempletId == undefined) {
      this.message.warning('请选择排班模板！');
      return;
    }
    if (this.singleCreateModalObj.schTempletBanci == undefined) {
      this.message.warning('请选择班次！');
      return;
    }

    this.isTableLoading = true;
    const reqObj = {
      employees: this.singleCreateModalObj.eid,
      begin: this.jsUtil.dateFormat(this.singleCreateModalObj.date),
      num: this.singleCreateModalObj.schTempletBanci,
      schingid: this.singleCreateModalObj.schTempletId
    };
    this.httpReq.post('schedulinginfo/add1', null, reqObj, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        this.listScheduling();
      } else {
        this.message.error(data['message']);
      }
    });

    this.isSingleCreateModalVisible = false;
  }

  singleCreateModalHandleCancel() {
    this.isSingleCreateModalVisible = false;
  }

  makeBanci() {
    this.schList = [];
    // console.log(this.schTempletId);
    let schTempletNames;
    this.schTempletList.forEach(element => {
      if (element.id == this.singleCreateModalObj.schTempletId) {
        schTempletNames = element.name;
        // console.log(element.name);
      }
    });
    const bancis = schTempletNames.split(',');
    for (var key in bancis) {
      this.schList.push({ banci: bancis[key] });
    }
    console.log(this.schList);
  }

  showSetNumberModal(scheduling) {
    this.setNumberModalObj.eid = scheduling.eid;
    this.setNumberModalObj.ename = scheduling.ename;
    this.setNumberModalObj.num = undefined;

    this.isSetNumberModalVisible = true;
  }

  setNumberModalHandleOk() {
    if (this.setNumberModalObj.num == undefined) {
      this.message.warning('请填写护工序号！');
      return;
    }

    this.isTableLoading = true;
    const reqObj = {
      eid: this.setNumberModalObj.eid,
      num: this.setNumberModalObj.num
    };
    this.httpReq.post('schEmployees/updateNum', null, reqObj, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        this.listScheduling();
      } else {
        this.message.error(data['message']);
      }
    });

    this.isSetNumberModalVisible = false;
  }

  setNumberModalHandleCancel() {
    this.isSetNumberModalVisible = false;
  }

  showChangeSchedulingModal(scheduling, info) {
    if (!info.value) return;
    this.changeSchedulingModalObj.schedulingId = info.value.id;
    this.changeSchedulingModalObj.ename = scheduling.ename;
    this.changeSchedulingModalObj.date = info.value.date;
    this.changeSchedulingModalObj.banci = info.value.realscheduling;

    this.bancis = scheduling.name.split(',').filter(function(x, index, self) {
      return self.indexOf(x) === index;
    });

    this.isChangeSchedulingModalVisible = true;
  }

  changeSchedulingModalHandleOk() {
    this.isTableLoading = true;

    const reqObj = {
      id: this.changeSchedulingModalObj.schedulingId,
      realscheduling: this.changeSchedulingModalObj.banci
    };
    this.httpReq.post('schedulinginfo/update', null, reqObj, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        this.listScheduling();
      } else {
        this.message.error(data['message']);
      }
    });

    this.isChangeSchedulingModalVisible = false;
  }

  changeSchedulingModalHandleCancel() {
    this.isChangeSchedulingModalVisible = false;
  }

  onPrint() {
    this.isPrintNow = true;
    this.printComponent.print();
  }

  printComplete() {
    this.isPrintNow = false;
  }
}
