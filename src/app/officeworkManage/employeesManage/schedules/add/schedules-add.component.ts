import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
import { JsUtilsService } from '../../../../common/service/JsUtils.Service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-schedules-add',
  templateUrl: './schedules-add.component.html',
  styleUrls: ['./schedules-add.component.scss']
})
export class SchedulesAddComponent implements OnInit {
  infos;

  validateForm: FormGroup;
  isSaveBtnLoading = false;

  schedules;

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.schedules = {};
    this.infos = [];

    this.validateForm = this.fb.group({
      shift: [null, [Validators.required]]
    });

    const schedulesStr = this.route.snapshot.paramMap.get('schedules');

    if (schedulesStr) {
      this.schedules = JSON.parse(schedulesStr);
      this.validateForm.patchValue({ shift: this.schedules.shift });
      this.infos = this.schedules.infos;
      this.infos.forEach(e => {
        e.btimePicker = new Date('1970-1-1 ' + e.btime);
        e.etimePicker = new Date('1970-1-1 ' + e.etime);
      });
    }
  }

  back() {
    history.back();
  }

  addBanci() {
    const banci = {
      name: '',
      btime: undefined,
      etime: undefined
    };
    this.infos = [...this.infos, banci];
  }

  delBanci(i: { name: ''; btime: undefined; etime: undefined }) {
    if (this.infos.length > 0) {
      this.infos = this.infos.filter(d => d !== i);
    }
  }

  onSubmit() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }

    const formData = this.validateForm.value;

    this.infos.forEach(e => {
      e.btime = this.jsUtil.dateFormat(e.btimePicker, 'HH:mm');
      e.etime = this.jsUtil.dateFormat(e.etimePicker, 'HH:mm');
    });

    const schedules = {
      shift: formData.shift,
      infos: this.infos
    };

    this.isSaveBtnLoading = true;
    let reqObj: any;
    reqObj = { memo: schedules };
    if (!this.schedules.tag) {
      this.httpReq.post('schShift/save', null, reqObj, data => {
        this.isSaveBtnLoading = false;
        if (data['status'] == 200) {
          this.isSaveBtnLoading = false;
          this.message.success('保存成功！');
          this.back();
        }
      });
    } else {
      reqObj.tag = this.schedules.tag;
      this.httpReq.post('schShift/edit', null, reqObj, data => {
        this.isSaveBtnLoading = false;
        if (data['status'] == 200) {
          this.isSaveBtnLoading = false;
          this.message.success('保存成功！');
          this.back();
        }
      });
    }
  }
}
