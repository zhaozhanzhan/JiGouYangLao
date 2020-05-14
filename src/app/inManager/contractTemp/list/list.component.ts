import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { ServeConfigService } from "../../../common/config/serve-config.service";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  user;
  //添加输入的协议名称
  inputContractName = "";
  //添加协议名称的表单
  validateForm: FormGroup;
  //添加协议的对话框显示控制
  isShowAddDialog = false;
  //保存时按钮等待状态；
  isSaveLoading = false;
  //列表是否是加载状态
  isTableLoading = false;

  //当前选择编辑的协议
  selectedContract = null;

  dataArray = [];

  //列表查询条件
  queryParams = {
    page: 1,
    size: 10,
    name: "",
    startOrStop: 0
  };

  resultData = {
    totalElements: 0
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private modalService: NzModalService,
    private httpReq: HttpReqService,
    private serveConfigService: ServeConfigService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, this.inputNameValidator]]
    });

    this.loadingDataArray();
  }

  //对输入协议名称的验证
  inputNameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.length <= 0 || control.value.length > 30) {
      return { confirm: true, error: true };
    }
  };
  //保存协议模板
  addTemplate(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
    this.isSaveLoading = true;
    this.user = this.localStorage.getUser();
    let params = {
      name: this.inputContractName,
      noteTaker: this.user.data.name
    };

    let that = this;

    this.httpReq.post("contractTemplate/save", null, params, data => {
      that.isSaveLoading = false;
      if (data["code"] == 0) {
        that.isShowAddDialog = false;
        that.loadingDataArray(true);
      }
    });
  }
  //修改协议模板
  modifyTemplate() {
    if (this.selectedContract == null) {
      this.message.error("数据错误！");
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
    this.isSaveLoading = true;
    this.user = this.localStorage.getUser();
    this.selectedContract.name = this.inputContractName;
    this.selectedContract.modifier = this.user.data.name;
    let that = this;

    this.httpReq.post(
      "contractTemplate/edit",
      null,
      this.selectedContract,
      data => {
        that.isSaveLoading = false;
        if (data["code"] == 0) {
          that.isShowAddDialog = false;
          that.loadingDataArray(true);
        }
      }
    );
  }
  /**
   * 保存合同模板按钮点击事件
   */
  onSaveTemplate() {
    if (this.selectedContract == null) {
      this.addTemplate();
    } else {
      this.modifyTemplate();
    }
  }
  showAddDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowAddDialog = true;
    this.inputContractName = "";
    this.selectedContract = null;
  }
  showModifyDialog(contract, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowAddDialog = true;
    this.inputContractName = contract.name;
    this.selectedContract = contract;
  }

  /**
   * 加载列表数据
   */
  loadingDataArray(reset: boolean = false) {
    this.isTableLoading = true;

    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }

    let that = this;
    // this.http.doBodyPostData(
    //   config.baseUrl + "contractTemplate/list",
    //   this.queryParams,
    //   (successful, data, res) => {
    //     that.isTableLoading = false;
    //     that.resultData = data;
    //     that.queryParams.page++;
    //     that.dataArray = data.content;
    //   },
    //   (successful, msg, err) => {
    //     that.isTableLoading = false;
    //     that.message.error(msg);
    //   }
    // );

    let param = this.httpReq.post(
      "contractTemplate/list",
      null,
      this.queryParams,
      data => {
        // sessionStorage.setItem(that.router.url, JSON.stringify(that.params));

        that.isTableLoading = false;
        if (data["status"] == 200) {
          // that.page.total = data["data"]["totalElements"];
          // that.list = data["data"]["content"];

          that.isTableLoading = false;
          that.resultData = data["data"];

          that.queryParams.page++;
          that.dataArray = data["data"]["content"];
        }
      }
    );
  }

  /**
   * 删除模板确认对话框
   */
  confirmDelContract(contract, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let that = this;
    this.modalService.confirm({
      nzTitle: "请确认是否删除?",
      // nzContent:
      //   '<b style="color: red;">合同模板删除后无法恢复，请谨慎操作！</b>',
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        that.delTemplate(contract);
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }

  //删除协议模板
  delTemplate(contract) {
    this.isTableLoading = true;
    let params = { id: contract.id };
    let that = this;
    this.httpReq.post("contractTemplate/del", null, params, data => {
      that.isTableLoading = false;
      if (data["code"] == 0) {
        that.loadingDataArray(true);
      }
    });
  }

  //跳转编辑合同模板
  editContractTemplate(contract, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["template", JSON.stringify(contract)], {
      relativeTo: this.route
    });
  }
  //是否启用模板
  toggerTemoState(contractInfo, isRelease: boolean, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    if (isRelease) {
      contractInfo.startOrStop = 1;
    } else {
      contractInfo.startOrStop = 2;
    }

    this.isSaveLoading = true;
    this.user = this.localStorage.getUser();
    contractInfo.modifier = this.user.data.name;
    let that = this;
    this.httpReq.post("contractTemplate/edit", null, contractInfo, data => {
      that.isSaveLoading = false;
      if (data["code"] == 0) {
        that.isShowAddDialog = false;
        that.loadingDataArray();
      }
    });
  }
}
