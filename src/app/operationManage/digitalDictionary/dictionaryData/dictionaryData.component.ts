
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
    page: 1,
    size: 10,
    dictMgtId:"",
    dictTag:"",
    dictValue:"",
    status:""
  };
  list = [];
  isTableLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private httpReq: HttpReqService, 
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    let interviewId = this.route.snapshot.paramMap.get('id');
    this.reqObj.dictMgtId=interviewId;
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

    this.httpReq.post('dictData/listCondition', null, this.reqObj, data => {
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
    this.httpReq.post('/dictData/startoff', null, { id: id }, data => {
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
      this.httpReq.post('/dictData/del', null, { id: id }, data => {
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
      this.router.navigate(['addDictionaryData',{id: this.reqObj.dictMgtId}], { relativeTo: this.route });
    }else{
      this.router.navigate(['addDictionaryData',{info: JSON.stringify(data),id: this.reqObj.dictMgtId}], { relativeTo: this.route });
    }
  }

 

  back() {
    history.back();
  }
}
