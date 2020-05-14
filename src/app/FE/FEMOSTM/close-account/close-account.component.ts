import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: 'app-close-account',
  templateUrl: './close-account.component.html',
  styleUrls: ['./close-account.component.css']
})
export class CloseAccountComponent implements OnInit {
  payRecordId; //  月度结算账单id
  // 查询老人基本信息
  payRecordInfo = {
    oldManInfo: '',
    name: '',
    sex: '',
    age: '',
    cardno: '',
    roomName: '',
    inDate: '',
    days: '',
    status: '',//
    monthAccountList: [], // 查询老人账目信息列表
    consumptionList: [],
    totalPuts: '',
    totalBalance: '',
    totalConsumption: '',
    totalRemain: ''
  };

  //当月账单的结算状态
  settleStatus: any = "0";

  payRecord = ''; // title
  isBtnLoading = false;
  isTableLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.payRecordId = this.route.snapshot.paramMap.get('id');
    this.payRecord = this.route.snapshot.paramMap.get('month') + '月份消费记录';
    if (this.payRecordId) {
      this.getInfo(this.payRecordId);
    }
  }

  // 获取老人基本信息
  getInfo(id) {
    this.isTableLoading = true;
    this.httpReq.post('monthlySettlement/get', null, { id: id }, res => {
      this.isTableLoading = false;
      if (res.code === 0) {
        this.payRecordInfo = res.data;
        this.settleStatus = this.payRecordInfo.status;
      }
    })
  }

  /**
   * 跳转到登记消费项目的页面
   */
  turnToAddCustom() {
    console.log('tag', this.payRecordInfo)
    this.router.navigate(['add', {
      oldmanId: this.payRecordInfo.oldManInfo,
      cardno: this.payRecordInfo.cardno
    }], { relativeTo: this.route.parent });

  }

  // 删除
  delete(id, itemName) {
    if (!id) {
      console.error('No id!');
      return
    }
    this.modalService.confirm({
      nzTitle: `取消后该项目消费金额将不会计入总金额，请谨慎操作！请确认是否取消该消费:${itemName} ？`,
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.httpReq.post(
          "consumption/consumptionCancel",
          null,
          { id: id },
          data => {
            if (data["code"] == 0) {
              this.message.success("取消成功");
              if (this.payRecordId) {
                this.getInfo(this.payRecordId);
              }
            }
          }
        );
      },
      nzCancelText: '取消',
      nzOnCancel: () => {
      }
    });
  }

  /**
   * 变更结算状态
   * @param status
   */
  setSettleStatus(status) {
    this.isBtnLoading = true;
    this.httpReq.post('monthlySettlement/update', null, { id: this.payRecordId, status }, res => {
      this.isBtnLoading = false;
      if (res.code === 0) {
        this.getInfo(this.payRecordId);
      }
    })
  }

}
