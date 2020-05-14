import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-addDigitalDictionary',
  templateUrl: './addDigitalDictionary.component.html',
  styleUrls: ['./addDigitalDictionary.component.scss']
})
export class AddDigitalDictionaryComponent implements OnInit {
  
  validateForm;
  id;
  isBtnLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpReq: HttpReqService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      dictName: ['', [Validators.required]],
      dictType:['', [Validators.required]],
      // sysDictFlag:['', [Validators.required]],
      comment: ['', []]
    });
  
    const  digitalStr= this.route.snapshot.paramMap.get('info');
    console.log(digitalStr)
    if (digitalStr) {
      const digital = JSON.parse(digitalStr);
      this.id = digital.id;
      digital.sysDictFlag=digital.sysDictFlag+""
      this.validateForm.patchValue(digital);
    }

  }
  turnToAdd(){
    this.router.navigate(['AddAssets'], { relativeTo: this.route });
  }

  back() {
    history.back();
  }


  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    
    let reqObj = this.validateForm.value;

    if (this.validateForm.status === 'INVALID') {
      return;
    }
    this.isBtnLoading = true;
    if (!this.id) {
      this.httpReq.post('dictMgt/save', null, reqObj, data => {
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
      this.httpReq.post('/dictMgt/edit', null, reqObj, data => {
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
