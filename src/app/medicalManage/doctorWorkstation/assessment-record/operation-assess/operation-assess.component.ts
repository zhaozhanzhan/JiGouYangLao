import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../../common/service/GlobalService";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../../common/service/local.storage";
@Component({
  selector: 'app-operation-assess',
  templateUrl: './operation-assess.component.html',
  styleUrls: ['./operation-assess.component.css']
})
export class OperationAssessComponent implements OnInit {

  older;
  olderInfo;



  // surgeryPointer1 (string, optional): 手术指针 ,
  // surgeryPointer2 (string, optional): 手术指针 ,
  // surgeryPointer3 (string, optional): 手术指针 ,
  // risk (string, optional): 风险 ,
  // complications1 (string, optional): 并发症 ,
  // complications2 (string, optional): 并发症 ,
  // complications3 (string, optional): 并发症 ,
  // psychologicalStatus (string, optional): 心理状况 ,
  // prognosis (string, optional): 预后 ,
  // tolerance (string, optional): 手术耐受性 ,
  // assessmentPerson (string, optional): 评估者 ,
  // assessmentTime (string, optional): 日期 ,
  // assessmentType (string, optional): 评估类型 ,
  

  // economy (string, optional): 经济状况 ,
  // id (string, optional),
  // basicInfoId (string, optional): 记录id ,

  // basicInfo (inline_model, optional),
  // createDate (string, optional),
  // updateDate (string, optional)

  formInfo = {
    surgeryPointer1: '',
    surgeryPointer2: '',
    surgeryPointer3: '',
    risk: '',
    complications1: '',
    complications2: '',
    complications3: '',
    psychologicalStatus: '',
    prognosis: '',
    tolerance: '',
    assessmentPerson: '',
    assessmentTime: '',
    assessmentType: '术前评估',
    id: '',
    basicInfoId: '',
  }
  selDate: any;
  isLoadingSave = false; // 保存按钮loading

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private message: NzMessageService,
    private util: JsUtilsService,
    private localStorage: LocalStorage //存储
  ) { }

  getOlderInfo(id){
    this.httpReq.get("conditionAssessment/getBasicInfoDetail", {basicId: id}, data => {
      if(data.code === 0){
        this.olderInfo = data.data;
      }
    });
  }

  back(){
    window.history.back();
  }

  ngOnInit() {
    this.older = JSON.parse(this.route.snapshot.paramMap.get('older'));
    if(this.route.snapshot.paramMap.get('type') == 'add'){
      this.formInfo.basicInfoId = this.older.id;
      this.getOlderInfo(this.older.id)
    }else{
      // 对象赋值
    }
  }

  setFormVal(key,val){
    this.formInfo[key] = val;
  }

  save(){
    this.isLoadingSave = true;
    this.httpReq.post('conditionAssessment/save',null,this.formInfo,res=>{
      this.isLoadingSave = false;
      if(res.code === 0){
        this.message.success('保存成功！')
      }
    })
  }

  onDateChange(date){
    this.formInfo.assessmentTime = this.util.dateFormat(date) || this.util.dateFormat(new Date());
  }

}
