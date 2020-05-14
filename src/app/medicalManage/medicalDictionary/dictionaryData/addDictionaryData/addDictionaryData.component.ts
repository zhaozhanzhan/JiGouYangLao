import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-addDictionaryData',
  templateUrl: './addDictionaryData.component.html',
  styleUrls: ['./addDictionaryData.component.scss']
})
export class AddDictionaryDataComponent implements OnInit {

  validateForm;
  dataId; // 医疗字典数据ID
  managementId; //医疗字典管理表ID
  timeUnit = 1;
  unit = '日';
  timeNumber = 1;
  showFrequency;
  isShowFrequency = true;
  digital;
  dictType;
  isBtnLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpReq: HttpReqService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    /** 
     * {"dictTag":"字典标签",
     * "dictValue":"字典键值",
     * "remark":"备注",
     * "orderNo":"排序号",,
     * "timeUnit":"单位数量",
     * "unit":"单位（日）",
     * "timeNumber":"次数数量"
     * ,"managementId":"医疗字典管理表ID"}
    */
    this.validateForm = this.fb.group({
      dictTag: ['', [Validators.required]],
      dictValue:['', [Validators.required]],
      orderNo:['', [Validators.required]],
      timeUnit:[1, []],
      unit:['日', []],
      timeNumber:[1, []],
      remark: ['', []]
    });
    this.managementId=this.route.snapshot.paramMap.get('managementId');
    this.dictType=this.route.snapshot.paramMap.get('dictType');
    const digitalStr= this.route.snapshot.paramMap.get('info');
    // console.log(this.managementId);
    // console.log(this.dictType);
    // console.log(digitalStr);
    if (digitalStr) {
      this.digital = JSON.parse(digitalStr);
      this.dataId = this.digital.id;
      this.validateForm.patchValue(this.digital);
      this.timeUnit = this.validateForm.value.timeUnit;
      this.unit = this.validateForm.value.unit;
      this.timeNumber = this.validateForm.value.timeNumber;
    }
    if(!this.timeUnit || !this.unit || !this.timeNumber) this.isShowFrequency = false;
    this.showFrequency = this.timeUnit+' '+this.unit+' '+this.timeNumber;
  }

  back() {
    history.back();
  }

  // 用药频率
  frequency(event: any,name:any){
    if(name == 'timeUnit') this.timeUnit = event.target.value;
    else if(name == 'timeNumber') this.timeNumber = event.target.value;
    else this.unit = name.value;
    // console.log(this.timeUnit,this.unit,this.timeNumber);
    this.showFrequency = this.timeUnit+' '+this.unit+' '+this.timeNumber;
    if(this.timeUnit || this.unit || this.timeNumber) this.isShowFrequency = true;
  }

  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === 'INVALID') {
      return;
    }
    
    let reqObj = this.validateForm.value;
    reqObj.managementId = this.managementId;

   
    this.isBtnLoading = true;
    if (!this.dataId) {
      this.httpReq.post('dictionaryMedicationData/dataSave', null, reqObj, data => {
        this.isBtnLoading = false;
        if (data['status'] == 200) {
          if (data['code'] == 0) {
            this.message.success('保存成功！');
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    } else {
      reqObj.dataId = this.dataId;
      this.httpReq.post('dictionaryMedicationData/dataEdit', null, reqObj, data => {
        this.isBtnLoading = false;
        if (data['status'] == 200) {
          if (data['code'] == 0) {
            this.message.success('保存成功！');
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    }
  }
}
