import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../../common/service/HttpUtils.Service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-linkGroup',
  templateUrl: './linkGroup.component.html',
  styleUrls: ['./linkGroup.component.scss']
})
export class LinkGroupComponent implements OnInit {
  employee;
  employeesGroupList;

  validateForm: FormGroup;
  isSaveBtnLoading = false;

  constructor(private route: ActivatedRoute, private httpReq: HttpReqService, private message: NzMessageService, private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, []],
      employeesGroupId: [null, [Validators.required]]
    });

    this.employee = {};

    const employeeStr = this.route.snapshot.paramMap.get('employee');

    if (employeeStr) {
      this.employee = JSON.parse(employeeStr);
      this.validateForm.patchValue({ name: this.employee.name });
    }

    this.httpReq.post('nurseTeam/list', null, {page: 0,size: 100}, data => {
      if (data['status'] == 200) {
        this.employeesGroupList = data['data']['list'];
      }
    });
  }

  back() {
    history.back();
  }

  onSubmit() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }

    const reqObj = {
      id: this.employee.id,
      nurseTeamIds: this.validateForm.get('employeesGroupId').value.join(',')
    };
    this.isSaveBtnLoading = true;
    this.httpReq.post('nurseTeam/teamAllocation', null, reqObj, data => {
      this.isSaveBtnLoading = false;
      if (data['status'] == 200) {
        this.isSaveBtnLoading = false;
        this.message.success('保存成功！');
        this.back();
      }
    });
  }
}
