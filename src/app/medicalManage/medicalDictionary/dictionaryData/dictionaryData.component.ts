
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../common/service/GlobalService';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-dictionaryData',
  templateUrl: './dictionaryData.component.html',
  styleUrls: ['./dictionaryData.component.scss']
})
export class DictionaryDataComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    /** 
     * {"page":"页码",
     * "size":"每页数量",
     * "managementId":"医疗字典管理表ID",
     * "dictTag": "字典标签",
     * "dictValue": "字典键值",
     * "status": "是否启用（0：停用，1：启用）"}
    */
    page: 1,
    size: 10,
    managementId:"",
    dictTag:"",
    dictValue:"",
    status:""
  };
  list = [];
  managementId;
  dictType;
  isTableLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private httpReq: HttpReqService, 
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.managementId = this.route.snapshot.paramMap.get('id');
    this.dictType = this.route.snapshot.paramMap.get('dictType');
    this.reqObj.managementId=this.managementId;
    // console.log(this.reqObj.managementId,this.dictType);
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
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

    this.httpReq.post('dictionaryMedicationData/dataList', null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data['status'] == 200) {
        this.list = data['data']['content'];
        this.page.total = data['data']['totalElements'];
      }
    });
  }
  // 禁用
  forbidden(id,status,e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    /** 
     * {"dataId":"医疗字典数据ID",
     * "status":"是否启用（0：停用，1：启用）"}
    */
    let condition = status == 0 ? 1 : 0;
    this.httpReq.post('dictionaryMedicationData/dataStartOff', null, { dataId: id,status: condition}, data => {
      if (data['status'] == 200) {
        if (data['code'] == 0){
          if(status=="0"){
           
            this.message.success('启用成功！');
          }else{
            this.message.success('禁用成功！');
          }
         
          this.updateList();
        }else{
          this.message.error(data.message);
        }
      }
    });
  }


  // 删除
  delete(id,e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.globalService.delModal(() => {
      this.httpReq.post('dictionaryMedicationData/dataDel', null, { dataId: id }, data => {
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

  // 跳转到保存和修改页面
  turnToAdd(data,e?: MouseEvent){
    if (e) {
      e.preventDefault();
    }
    if(data==""){
      console.log(this.reqObj.managementId);
      this.router.navigate(['addDictionaryData',{managementId: this.managementId,dictType:this.dictType}], { relativeTo: this.route });
    }else{
      this.router.navigate(['addDictionaryData',{info: JSON.stringify(data),managementId: this.managementId,dictType:this.dictType}], { relativeTo: this.route });
    }
  }

 

  back() {
    history.back();
  }
}
