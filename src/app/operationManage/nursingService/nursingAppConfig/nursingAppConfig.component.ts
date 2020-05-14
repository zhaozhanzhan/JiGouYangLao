import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-nursingAppConfig",
  templateUrl: "nursingAppConfig.component.html"
})
export class NursingAppConfigComponent implements OnInit {
  //是否显示编辑对话框
  isEditDialogShow = false;
  isSaveLoading = false;
  saveParams = {
    id: "",
    levelName:"",
    isProvideShPeForApp: false,
    isProvideRollForApp: false
  };
  list;

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10
  };

  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    this.isTableLoading = true;
    this.httpReq.post("careLevelCase/pageList", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  showEditDialog(data){
    this.saveParams = data;
    this.saveParams.isProvideRollForApp = data.isProvideRollForApp =='1'
    this.saveParams.isProvideShPeForApp = data.isProvideShPeForApp =='1'
    this.isEditDialogShow = true;
  }
  save() {
    let sendParams =  {
      id: this.saveParams.id,
      levelName:this.saveParams.levelName,
      isProvideShPeForApp: this.saveParams.isProvideRollForApp ? "1" : "0",
      isProvideRollForApp: this.saveParams.isProvideShPeForApp ? "1" : "0"
    };
    console.log('tag', sendParams);

    this.isSaveLoading = true;
    this.httpReq.post("careLevelCase/editAppFuncDef", null, sendParams, data => {
      this.isSaveLoading = false;
      if (data["code"] == 0) {
          this.isEditDialogShow = false;
        this.message.success("配置保存成功！");
        this.updateList();
      }
    });
  }
}
