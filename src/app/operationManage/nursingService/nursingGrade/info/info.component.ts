import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, Validators } from '@angular/forms';

export class Person {
  name: string;
  phone: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  nursingGradeId;

  validateForm;
  getParam;

  reqObj;

  isBtnLoading = false;

  constructor(private route: ActivatedRoute, private httpReq: HttpReqService, private message: NzMessageService, private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      levelName: ['', [Validators.required]],
      memo: ['', [Validators.required]]
    });

    this.getParam = this.route.snapshot.paramMap['params'];
    if (this.getParam.nursingGrade) {
      const nursingGrade = JSON.parse(this.getParam.nursingGrade);
      this.nursingGradeId = nursingGrade.id;
      this.validateForm.patchValue(nursingGrade);
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

    this.reqObj = this.validateForm.value;
    this.isBtnLoading = true;

    if (!this.nursingGradeId) {
      this.httpReq.post('careLevelCase/save', null, this.reqObj, data => {
        this.isBtnLoading = false;
        if (data['status'] == 200) {
          this.message.success('保存成功！');
          this.back();
        }
      });
    } else {
      this.reqObj.id = this.nursingGradeId;
      this.httpReq.post('careLevelCase/edit', null, this.reqObj, data => {
        this.isBtnLoading = false;
        if (data['status'] == 200) {
          this.message.success('保存成功！');
          this.back();
        }
      });
    }
  }
}
