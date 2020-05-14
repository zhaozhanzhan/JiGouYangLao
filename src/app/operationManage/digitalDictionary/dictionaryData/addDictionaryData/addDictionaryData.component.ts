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
  id;
  isBtnLoading = false;
  digitalId
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpReq: HttpReqService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      dictTag: ['', [Validators.required]],
      dictValue:['', [Validators.required]],
      orderNo:['', [Validators.required]],
      comment: ['', []]
    });
    this.digitalId=this.route.snapshot.paramMap.get('id');
    const  digitalStr= this.route.snapshot.paramMap.get('info');
    console.log(digitalStr)
    if (digitalStr) {
      const digital = JSON.parse(digitalStr);
      this.id = digital.id;
     
      this.validateForm.patchValue(digital);
    }
  }

  back() {
    history.back();
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
    reqObj.dictMgtId=this.digitalId;

   
    this.isBtnLoading = true;
    if (!this.id) {
      this.httpReq.post('/dictData/save', null, reqObj, data => {
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
      reqObj.id = this.id;
      this.httpReq.post('/dictData/edit', null, reqObj, data => {
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
