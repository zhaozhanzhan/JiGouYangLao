import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";
import { ImageUploadComponent } from "../../../common/imageupload/imageupload.component";
@Component({
  selector: "app-aTrainingReDetails",
  templateUrl: "./aTrainingReDetails.component.html",
  styleUrls: ["./aTrainingReDetails.component.css"]
})
export class ATrainingReDetailsComponent implements OnInit {
  // 添加个训登记参数
  addDataObj = {
    childId: "", //儿童ID
    type: "1", //1是儿童个训，2是小组
    teamId: "", //小组ID
    scope: "", // 范畴 ,
    childScope: "", //  子范畴 ,
    project: "", // 项目 ,
    projectId: "",
    age: "", // 参考年龄 ,
    promptWay: "", // 提示方式 ,
    standard: "", // 成功标准 ,
    target: "", // 目标 ,
    therapist: "", // 康复师 ,
    time: "", // 时间 ,
    image: "", // 图片 ,
    perfermenceList: [
      {
        id: "", //儿童ID
        perfermence: "" //康复表现
      }
    ]
  };
  perfermence;
  // obj = {
  //   id: "", //儿童ID
  //   perfermence: "" //康复表现
  // };
  scopeList = []; //范畴列表
  subcategoryList = []; //子范畴列表
  conRehabilitationList = []; //项目列表
  logoImgsStr; //图片
  user;
  project;
  id;
  // 查看时请求的接口
  checkInfoObj = {
    type: "1",
    recordId: "", //个人id
    teamId: "" //团队id
  };

  disabled = false;
  type; //康复类型，1智力残疾，2肢体障碍
  projectId;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private message: NzMessageService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.type = this.route.snapshot.paramMap.get("type");

    this.checkInfoObj.recordId = this.route.snapshot.paramMap.get("recordId");
    // 如果记录请求ID不为空  调用这条数据的详细信息
    if (this.checkInfoObj.recordId != null) {
      this.httpReq.get("/training/detail", this.checkInfoObj, data => {
        if (data["code"] == 0) {
          const result = data["data"];
          this.addDataObj = result;
          this.id = result.id;
          this.perfermence = result.perfermence;
          this.disabled = true;
        } else {
          this.message.error(data.message);
        }
      });
    }

    this.user = this.localStorage.getUser();
    this.addDataObj.therapist = this.user.data.name;
    this.getConRehabilitation();
    this.getProject();
  }

  // 保存个训练
  saveTrainDetails(logoImage: Array<string>) {
    this.addDataObj.perfermenceList.forEach(e => {
      e.id = this.id;
      e.perfermence = this.perfermence;
    });

    if (this.addDataObj.time == "") {
      this.message.error("训练时间不能为空！");
      return;
    } else {
      this.addDataObj.time = this.jsUtil.dateFormat(this.addDataObj.time);
    }

    this.addDataObj.image = logoImage.toString();
    this.httpReq.post("/training/save", null, this.addDataObj, data => {
      if (data["code"] == 0) {
        this.message.success("保存成功");
        this.back();
      } else {
        this.message.error(data.message);
      }
    });
  }

  // 获得范畴，子范畴
  // 康复配置中获得所有得项目
  getConRehabilitation() {
    this.httpReq.get(
      "/rehabilitionConfig/searchDatas",
      { types: "category,subcategory" },
      data => {
        if (data["code"] == 0) {
          const result = data["data"];
          result.forEach(e => {
            // 获得范畴列表
            if (e.type == "category") {
              this.scopeList = e.ddList;
            }

            // 获得子范畴列表
            if (e.type == "subcategory") {
              this.subcategoryList = e.ddList;
            }
          });
        } else {
          this.message.error(data.message);
        }
      }
    );
  }

  // 获得项目
  // 康复配置中获得所有得项目
  getProject() {
    const obj = {
      type: ""
    };
    if (this.type == "1") {
      obj.type = "智力";
    } else {
      obj.type = "肢体";
    }
    this.httpReq.get("/rehabilitionConfig/listProject", obj, data => {
      if (data["code"] == 0) {
        this.conRehabilitationList = data["data"];
      } else {
        this.message.error(data.message);
      }
    });
  }

  // 选择某个项目时
  changePr(id) {
    const that = this;
    that.httpReq.get(
      "/rehabilitionConfig/searchData",
      { type: "project" },
      data => {
        if (data["code"] == 0) {
          const result = data["data"];
          result.forEach(e => {
            if (e.id == id) {
              this.addDataObj.project = e.name;
              this.addDataObj.projectId = e.id;
              this.addDataObj.age = e.age;
              this.addDataObj.promptWay = e.promptWay;
              this.addDataObj.standard = e.standard;
            }
          });
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
  // 返回
  back() {
    history.back();
  }
}
