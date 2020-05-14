import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";

@Component({
  selector: "app-user-info",
  templateUrl: "./info-edit.component.html",
  styleUrls: ["./info-edit.component.scss"]
})
export class InfoEditComponent implements OnInit {
  //选择的角色对象；
  selectedRoleValue;
  roleTreeList;
  timer;

  isShowPeopleDialog = false;
  isPeopleTableLoading = false;
  peopleDataArray = [];
  peopleResultData = { totalElements: 0 };
  dialogStyle = {
    marginBottom: "100px"
  };
  queryPeopleInfo = {
    page: 0,
    size: 10,
    name: "",
    departmentId: "",
    status: "0",
    personType: "",
    btime: "",
    etime: ""
  };

  userInfo = {
    num: "", //账号
    name: "", //姓名
    roleId: "", //角色Id
    empId: "", //人员Id
    organization: "", //组织机构
    rolesMemo: "", //权限
    roleName: ""
  };
  isSaveBtnLoading = false;
  constructor(
    private route: ActivatedRoute,
    private httpService: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    let that = this;
    that.route.params.subscribe((params: Params) => {
      const userStr = params["user"];
      let tempInfo = JSON.parse(userStr);
      that.userInfo = tempInfo;
      if (tempInfo.role && Utils.isNotEmpty(tempInfo.role)) {
        that.userInfo.roleId = tempInfo.role.id;
        that.selectedRoleValue = tempInfo.role.id;
      }
    });

    this.roleTreeList = [];
    //  获得角色列表
    this.httpService.post("sysRole/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.roleTreeList = data["data"];
      }
    });
  }

  back() {
    history.back();
  }

  onSubmit() {
    if (Utils.isEmpty(this.userInfo.num)) {
      this.message.warning("请输入用户名！");
      return;
    }

    if (Utils.isEmpty(this.userInfo.empId)) {
      this.message.warning("请选择需要绑定的员工！");
      return;
    }

    this.userInfo.roleId = this.selectedRoleValue;
    if (Utils.isEmpty(this.userInfo.roleId)) {
      this.message.warning("请选择需要绑定的角色！");
      return;
    }

    this.isSaveBtnLoading = true;
    this.httpService.post("account/edit", null, this.userInfo, data => {
      this.isSaveBtnLoading = false;
      if (data["code"] == 0) {
        this.message.success("保存成功！");
        this.back();
      }
    });
  }

  /**
   * 加载员工列表
   */
  loadingPeopleList(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.queryPeopleInfo.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryPeopleInfo.page = this.queryPeopleInfo.page - 1;
      if (this.queryPeopleInfo.page < 0) {
        this.queryPeopleInfo.page = 0;
      }
    }
    that.isPeopleTableLoading = true;
    this.httpService.post(
      "employees/listCondition",
      null,
      this.queryPeopleInfo,
      data => {
        that.queryPeopleInfo.page++;
        that.isPeopleTableLoading = false;
        if (data["code"] == 0) {
          const result = JSON.parse(data["data"]);
          this.peopleDataArray = result.memo;
          console.log("tag", this.peopleDataArray);
          this.peopleResultData.totalElements = result["totalElements"];
        }
      }
    );
  }

  choosedPeople(peopleInfo) {
    this.isShowPeopleDialog = false;
    if (peopleInfo) {
      this.userInfo.empId = peopleInfo.id;
      this.userInfo.name = peopleInfo.name;
    }
  }

  /**
   * 显示老年人选择对话框，并加载老年人列表
   */
  showPeopleDialog() {
    this.isShowPeopleDialog = true;
    this.loadingPeopleList(true);
  }
  
  reNewPeople(){
    let that = this;
    clearTimeout(that.timer);
    return function(){
      that.timer = setTimeout(function(){that.loadingPeopleList.apply(that)},500);
    }()
  }
}
