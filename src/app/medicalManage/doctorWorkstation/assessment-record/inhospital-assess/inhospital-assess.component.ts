import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../../common/service/GlobalService";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../../common/service/local.storage";
import { object } from "types/underscore";
@Component({
  selector: 'app-inhospital-assess',
  templateUrl: './inhospital-assess.component.html',
  styleUrls: ['./inhospital-assess.component.css']
})
export class InhospitalAssessComponent implements OnInit {

  older;
  olderInfo;

  // symptoms (string, optional): 主要症状 ,
  // complications1 (string, optional): 并发症 ,
  // complications2 (string, optional): 并发症 ,
  // complications3 (string, optional): 并发症 ,
  // risk (string, optional): 风险 ,
  // psychologicalStatus (string, optional): 心理状况 ,
  // prognosis (string, optional): 预后 ,
  // economy (string, optional): 经济状况 ,
  // assessmentPerson (string, optional): 评估者 ,
  // assessmentTime (string, optional): 日期 ,
  // assessmentType (string, optional): 评估类型 ,
  
  // id (string, optional),
  // basicInfoId (string, optional): 记录id ,

  // basicInfo (inline_model, optional),
  // createDate (string, optional),
  // surgeryPointer1 (string, optional): 手术指针 ,
  // surgeryPointer2 (string, optional): 手术指针 ,
  // surgeryPointer3 (string, optional): 手术指针 ,
  // tolerance (string, optional): 手术耐受性 ,
  // updateDate (string, optional)

  formInfo = {
    id: '', // 记录id
    basicInfoId: '', // 老人id
    symptoms: '',
    complications1: '',
    risk: '',
    psychologicalStatus: '',
    prognosis: '',
    economy: '',
    assessmentPerson: '',
    assessmentTime: '',
    assessmentType: '入院评估',
  }
  selDate: any;
  isLoadingSave = false; // 保存按钮loading

  // html类型，用于给 formInfo 中 symptom、symdrome 赋值
  symptomHTML;
  symdromeHTML;

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private message: NzMessageService,
    private util: JsUtilsService,
    private localStorage: LocalStorage //存储
  ) { }

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
      console.log(this.older)
      Object.keys(this.formInfo).forEach(key=>{
        this.formInfo[key] = this.older[key] || '';
      })
    }
  }

  getOlderInfo(id){
    this.httpReq.get("conditionAssessment/getBasicInfoDetail", {basicId: id}, data => {
      if(data.code === 0){
        this.olderInfo = data.data;
      }
    });
  }

  ngAfterViewInit(): void {
    this.symptomHTML = document.getElementById('symptom');
    this.symdromeHTML = document.getElementById('symdrome');
    this.symptomHTML.innerHTML = this.older.symptoms;
    this.symdromeHTML.innerHTML = this.older.complications1;
  }

  setFormVal(key,val){
    this.formInfo[key] = val;
  }

  save(){
    this.isLoadingSave = true;
    this.formInfo.symptoms = this.symptomHTML.innerHTML || '';
    this.formInfo.complications1 = this.symdromeHTML.innerHTML || '';
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
