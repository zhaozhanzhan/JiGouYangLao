import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-rehabilitationPersonAdd",
  templateUrl: "./rehabilitationPersonAdd.component.html",
  styleUrls: ["./rehabilitationPersonAdd.component.css"]
})
export class RehabilitationPersonAddComponent implements OnInit {
  // 显示老人弹出框
  isShowOldDialog = false;
  // 加载老人的参数
  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    beginTime: "",
    endTime: ""
  };
  //老年人选择对话框检索
  searchOldName = "";
  //老年人列表table加载状态
  isOldTableLoading = false;
  // 老人的列表
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };
  // 获得用户信息变量
  userInfo;
  validateForm;

  // 点击老人时绑定页面的信息
  interview = {
    name: ""
  };
  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localStroage: LocalStorage,
    private jsUtil: JsUtilsService
  ) {
    this.validateForm = this.fb.group({
      name: ["", [Validators.required]],
      recureName: ["", [Validators.required]],
      applyDate: ["", [Validators.required]]
    });
  }

  savePersonalBtnLoading = false;
  id;
  ShowDisabled = true;

  recureObj = {
    recureBaseId: "",
    recureName: "",
    applyDate: "",
    accountId: ""
  };

  recureObjEdit = {
    id: "",
    recureName: "",
    applyDate: "",
    accountId: ""
  };
  ngOnInit() {
    // 获得个人信息  accountId
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    this.recureObj.accountId = this.userInfo.id;

    // 编辑时获得的信息
    const rehabilitationPersonStr = this.route.snapshot.paramMap.get("info");
    if (rehabilitationPersonStr) {
      this.ShowDisabled = false;
      const rehabilitationPerson = JSON.parse(rehabilitationPersonStr);
      console.log(rehabilitationPerson + typeof rehabilitationPerson);
      this.interview.name = rehabilitationPerson.name;
      this.id = rehabilitationPerson.id;
      this.recureObjEdit.id = rehabilitationPerson.id;
      this.recureObj.recureName = rehabilitationPerson.recureName;
      this.recureObj.applyDate = rehabilitationPerson.applyDate;
    }
  }

  // 保存事件
  onSavePersonalInfo() {
    this.recureObj.applyDate = this.jsUtil.dateFormat(this.recureObj.applyDate);
    if (!this.id) {
      if (
        this.interview.name == "" ||
        this.recureObj.recureName == "" ||
        this.recureObj.applyDate == ""
      ) {
        this.message.error("姓名、康复训练名称、日期都不能为空");
        return;
      }
      this.httpReq.post("/rcCase/save", null, this.recureObj, data => {
        this.savePersonalBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    } else {
      this.recureObjEdit.recureName = this.recureObj.recureName;
      this.recureObjEdit.applyDate = this.recureObj.applyDate;
      this.recureObjEdit.accountId = this.recureObj.accountId;
      this.httpReq.post("/rcCase/edit", null, this.recureObjEdit, data => {
        this.savePersonalBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    }
  }

  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  /**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }

  /**
   * 显示老年人选择对话框，并加载老年人列表
   */
  showOldDialog() {
    this.isShowOldDialog = true;
    this.loadingOldList();
  }
  /**
   * 老年人选择对话框中选择了某个老年人；
   */

  chooseOld(oldInfo) {
    this.isShowOldDialog = false;
    if (oldInfo != null) {
      this.interview.name = oldInfo.name;
      this.recureObj.recureBaseId = oldInfo.id;
    }
  }
  /**
   * 加载老年人列表
   */
  loadingOldList(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.oldQueryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldQueryParams.page = this.oldQueryParams.page - 1;
      if (this.oldQueryParams.page < 0) {
        this.oldQueryParams.page = 0;
      }
    }
    that.oldQueryParams.name = that.searchOldName;
    that.isOldTableLoading = true;
    this.httpReq.post(
      "rcBaseInfo/listPage",
      null,
      this.oldQueryParams,
      data => {
        that.oldQueryParams.page++;
        that.isOldTableLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.oldDataArray = data["data"]["content"]; // 数据列表
            this.oldResultData.totalElements = data["data"]["totalElements"]; // 总条数
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }

  // 返回
  back() {
    history.back();
  }
}
