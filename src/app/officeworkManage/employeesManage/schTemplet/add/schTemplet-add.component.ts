import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schTemplet-add',
  templateUrl: './schTemplet-add.component.html',
  styleUrls: ['./schTemplet-add.component.scss']
})
export class SchTempletAddComponent implements OnInit {
  infos;
  schedulesList;
  bancis;

  validateForm: FormGroup;
  isSaveBtnLoading = false;

  constructor(private route: ActivatedRoute, private httpReq: HttpReqService, private message: NzMessageService, private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      shift: [null, [Validators.required]],
      tag: [null, [Validators.required]]
    });

    this.infos = [];

    this.httpReq.post('schShift/slist', null, {}, data => {
      if (data['status'] == 200) {
        const result = JSON.parse(data['data']);
        this.schedulesList = result['value'];
      }
    });
  }

  back() {
    history.back();
  }

  setSchedules() {
    const formData = this.validateForm.value;
    let schedules = this.schedulesList.filter(ele => {
      return ele.tag == formData.tag;
    });
    this.bancis = schedules[0].infos;
  }

  addInfo() {
    this.infos.push({ banci: '' });
  }

  delInfo(num) {
    this.infos.splice(num, 1);
  }

  onSubmit() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }

    let names = [];
    this.infos.forEach(info => {
      names.push(info.banci);
    });

    const formData = this.validateForm.value;
    const reqObj = { shift: formData.shift, name: names.join(','), tag: formData.tag };

    this.isSaveBtnLoading = true;
    this.httpReq.post('scheduling/save', null, reqObj, data => {
      this.isSaveBtnLoading = false;
      if (data['status'] == 200 && data['code'] == 0) {
        this.isSaveBtnLoading = false;
        this.message.success('保存成功！');
        this.back();
      } else {
        this.message.error(data['message']);
      }
    });
  }
}
