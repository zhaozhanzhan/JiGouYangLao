import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { Utils } from "../../common/utils/utils";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
@Component({
  selector: "app-rehabilitionTeam",
  templateUrl: "./rehabilitionTeam.component.html",
  styleUrls: ["./rehabilitionTeam.component.css"]
})
export class RehabilitionTeamComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10
  }; //请求列表得参数
  list = []; //列表得数组
  isTableLoading = false; //列表加载状态
  isVisible = false; //添加儿童信息的弹出框状态

  // 儿童添加得参数
  addChildObj = {
    name: "", //名字
    sex: "", //性别
    folk: "", //名族
    parentName: "", //家长姓名
    relation: "", //家长与儿童关系
    phone: "", //电话
    address: "", //地址
    bornTime: "", //出生日期
    idCard: "", //身份证号
    remark: "" //备注
  };
  conRehabilitationList = []; //获得所有得项目列表
  conRehabiliArr = []; //获得所有选择得项目
  allChildList = []; //获得所有儿童列表
  allChildArr = []; //获得所有选择得儿童
  // 保存项目小组得参数
  conRehabilitationObj = {
    id: "",
    childrenIds: "", //儿童得姓名
    projectIds: "" //儿童得项目
  };

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }

    this.updateList();
    this.getConRehabilitation(); //获得所有得项目列表
    this.getAllChild(); //获得所有的儿童列表
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.get("/rehabilitionTeam/list", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // 添加按钮
  turnToAdd(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    if (data == "") {
      this.allChildArr = [];
      this.conRehabiliArr = [];
      this.conRehabilitationObj.id = "";
    } else {
      this.conRehabilitationObj.id = data.id;
      this.allChildArr = data.childrenIds.split(",");
      this.conRehabiliArr = data.projectIds.split(",");
    }
    this.isVisible = true; //儿童基本信息弹出框显示
  }

  // 删除
  delete(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.globalService.delModal(() => {
      this.httpReq.get("/rehabilitionTeam/del", { id: id }, data => {
        this.isVisible = false;
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        } else {
          this.message.error(data.message);
        }
      });
    });
  }

  // 保存儿童小组
  saveChildGroup() {
    this.conRehabilitationObj.childrenIds = this.allChildArr.join(",");
    this.conRehabilitationObj.projectIds = this.conRehabiliArr.join(",");
    if (
      this.conRehabilitationObj.childrenIds == "" ||
      this.conRehabilitationObj.projectIds == ""
    ) {
      this.message.error("姓名和项目不能为空");
      return;
    }
    this.httpReq.post(
      "/rehabilitionTeam/save",
      null,
      this.conRehabilitationObj,
      data => {
        this.isVisible = false;
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.updateList();
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
  // 康复配置中获得所有得项目
  getConRehabilitation() {
    this.httpReq.get(
      "/rehabilitionConfig/searchData",
      { type: "project" },
      data => {
        if (data["code"] == 0) {
          this.conRehabilitationList = data["data"];
        } else {
          this.message.error(data.message);
        }
      }
    );
  }

  // 获得所有得儿童
  getAllChild() {
    this.httpReq.get("/children/listAll", {}, data => {
      if (data["code"] == 0) {
        this.allChildList = data["data"];
      } else {
        this.message.error(data.message);
      }
    });
  }
}
