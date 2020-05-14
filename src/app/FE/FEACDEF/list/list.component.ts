import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  validateForm: FormGroup;
  queryParams = {
    page: 0,
    size: 20,
    accountsName: ""
  };
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };

  // 弹框相关
  isVisibleAddModel = false;
  addModaltitle = "";
  addModalOkLoading = false;
  // 自定义表单校验
  myValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    // 弹框表单
    /* {
    "id":"抵扣券ID",
    "accountsName":"账目名字",
    "idDelayingPayment":"是否缴纳滞纳金",
    "dueAmount":"欠缴起算金额",
    "freeDays":"免交天数",
    "ratio":"比率",
    "remark":"备注"} */
    this.validateForm = this.fb.group({
      id: [null],
      sort: ["1"],
      accountsName: [
        null,
        [Validators.required, Validators.maxLength(20), Validators.minLength(2)]
      ],
      idDelayingPayment: ["否", [Validators.required]],
      dueAmount: [null],
      freeDays: [null],
      ratio: [null]
    });
    this.getList();
  }

  getList(reset: boolean = false) {
    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }
    sessionStorage.setItem(this.router.url, JSON.stringify(this.queryParams));
    this.isTableLoading = true;
    this.httpReq.post(
      "depositAccounts/listPage",
      null,
      this.queryParams,
      res => {
        this.isTableLoading = false;
        if (res.code === 0) {
          if (
            res.data.hasOwnProperty("content") &&
            res.data.content instanceof Array &&
            res.data.content.length
          ) {
            this.dataArray = res.data.content;
            this.resultData.totalElements = res.data.totalElements;
          }
        }
      }
    );
  }

  // 添加账目
  addInfo() {
    this.validateForm = this.fb.group({
      id: [null],
      sort: ["1"],
      accountsName: [
        null,
        [Validators.required, Validators.maxLength(20), Validators.minLength(2)]
      ],
      idDelayingPayment: ["否", [Validators.required]],
      dueAmount: [null],
      freeDays: [null],
      ratio: [null]
    });
    this.addModaltitle = "添加账目";
    this.validateForm.enable();

    this.isVisibleAddModel = true;
  }

  addModalCancel() {
    this.isVisibleAddModel = false;
    this.validateForm.reset({
      sort: "1",
      idDelayingPayment: "否"
    });
  }

  addModalOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
    this.addModalOkLoading = true;
    let reqObj = this.validateForm.value;
    if (reqObj.idDelayingPayment == "否") {
      reqObj.dueAmount = "";
      reqObj.freeDays = "";
      reqObj.ratio = "";
    }
    this.httpReq.post("depositAccounts/saveOrUpdate", null, reqObj, res => {
      if (res.code === 0) {
        this.message.success("操作成功！");
        this.getList();
      }
      this.addModalOkLoading = false;
      this.isVisibleAddModel = false;
    });
  }

  // 编辑账目
  edit(data, look?: false, model?) {
    this.addModaltitle = "账目编辑";
    this.validateForm.reset(data);
    this.validateForm.enable();
    if (look) {
      this.addModaltitle = "查看账目";
      this.validateForm.disable();
      model.nzFooter = null;
    }
    this.isVisibleAddModel = true;
  }

  // 删除账目
  delete(data) {
    if (!data.id) {
      console.error("No id!");
      return;
    }
    this.modalService.confirm({
      nzTitle: `确认删除账目 ${data.accountsName} ？`,
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => alert("ok!"),
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }
}
