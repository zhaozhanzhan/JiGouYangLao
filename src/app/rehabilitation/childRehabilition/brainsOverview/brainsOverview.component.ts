import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";
import { ImageUploadComponent } from "../../../common/imageupload/imageupload.component";
@Component({
  selector: "app-brainsOverview",
  templateUrl: "./brainsOverview.component.html",
  styleUrls: ["./brainsOverview.component.css"]
})
export class BrainsOverviewComponent implements OnInit {
  @Input() name: any;

  // 基本信息
  obj = {
    name: "", //名字
    sex: "", //性别
    age: "", //年龄
    type: "", //康复类型
    earlyScore: "", //初期评估
    midScore: "" //中期评估
  };

  // 康复计划
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    childrenId: "", //儿童id
    type: "" //智力1/肢体2
  }; //请求列表得参数
  list = []; //列表得数组
  isTableLoading = false;

  // 训练计划
  page1 = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj1 = {
    page: 1,
    size: 10,
    childrenId: "", //儿童id
    type: "" //智力1/肢体2
  }; //请求列表得参数
  list1 = []; //列表得数组
  isTableLoading1 = false;

  basicDataObj = {
    childrenId: "",
    type: "",
    menuType: "" //是康复档案还是儿童档案，1是康复档案，2是儿童档案
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private message: NzMessageService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    this.basicDataObj.type = this.name.type;
    if (this.name.check == "check") {
      this.basicDataObj.childrenId = this.name.id;
    } else {
      this.basicDataObj.childrenId = this.name.id;
    }

    // 获得基础数据
    this.getEvaluation();

    //获得康复计划
    this.getGeneralViewPlan();

    //获得训练计划
    this.getGeneralViewTrain();
  }
  // 获得基础数据
  getEvaluation() {
    if (this.name.check == "check") {
      this.basicDataObj.menuType = "2";
    } else {
      this.basicDataObj.menuType = "1";
    }
    this.httpReq.get("/children/generalView", this.basicDataObj, data => {
      if (data["code"] == 0) {
        this.obj = data["data"];
        if (this.name.type == "1") {
          this.obj.type = "智力残疾";
        } else {
          this.obj.type = "肢体障碍";
        }

        if (this.obj.sex == "1") {
          this.obj.sex = "女";
        } else {
          this.obj.sex = "男";
        }
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  //获得康复计划
  getGeneralViewPlan(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    this.reqObj.type = this.name.type;
    if (this.name.check == "check") {
      this.reqObj.childrenId = this.name.childrenId;
    } else {
      this.reqObj.childrenId = this.name.id;
    }

    this.httpReq.get("/children/generalViewPlan", this.reqObj, data => {
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  //获得训练计划
  getGeneralViewTrain(reset: boolean = false): void {
    if (reset) {
      this.page1.index = 1;
    }
    this.reqObj1.page = this.page1.index - 1;
    this.reqObj1.size = this.page1.size;
    this.reqObj1.type = this.name.type;
    if (this.name.check == "check") {
      this.reqObj1.childrenId = this.name.childrenId;
    } else {
      this.reqObj1.childrenId = this.name.id;
    }
    this.httpReq.get("children/generalViewTrain", this.reqObj1, data => {
      if (data["code"] == 0) {
        this.list1 = data["data"]["content"];
        this.page1.total = data["data"]["totalElements"];
      }
    });
  }
}
