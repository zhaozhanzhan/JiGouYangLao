import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-groupRegDetails",
  templateUrl: "./groupRegDetails.component.html",
  styleUrls: ["./groupRegDetails.component.css"]
})
export class GroupRegDetailsComponent implements OnInit {
  // 添加个训登记参数
  addDataObj = {
    childId: "", //儿童ID
    type: "2", //1是儿童个训，2是小组
    teamId: "", //小组ID
    scope: "", // 范畴 ,
    childScope: "", //  子范畴 ,
    project: "", // 项目 ,
    projectId: "", // (string, optional): 项目 ,
    age: "", // 参考年龄 ,
    promptWay: "", // 提示方式 ,
    standard: "", // 成功标准 ,
    target: "", // 目标 ,
    therapist: "", // 康复师 ,
    time: "", // 时间 ,
    image: "", // 图片 ,
    perfermenceList: []
  };

  // obj = {
  //   id: "", //儿童ID
  //   perfermence: "" //康复表现
  // };
  scopeList = []; //范畴列表
  subcategoryList = []; //子范畴列表
  conRehabilitationList = []; //项目列表
  user;

  // 查看时请求的接口
  checkInfoObj = {
    type: "2",
    recordId: "", //个人id
    teamId: "" //团队id
  };
  disabled = false;
  constructor(
    private router: Router,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    this.addDataObj.teamId = this.route.snapshot.paramMap.get("id");
    this.checkInfoObj.teamId = this.route.snapshot.paramMap.get("recordId"); //小组记录ID
    if (this.checkInfoObj.teamId != null) {
      this.httpReq.get("/training/detail", this.checkInfoObj, data => {
        if (data["code"] == 0) {
          const result = data["data"];
          this.addDataObj = result;
          this.disabled = true;
        } else {
          this.message.error(data.message);
        }
      });
    } else {
      this.user = this.localStorage.getUser();
      this.addDataObj.therapist = this.user.data.name;
      // 根据ID 获得所有的儿童信息
      this.httpReq.get(
        "/training/getTeamChild",
        { id: this.addDataObj.teamId },
        data => {
          if (data["code"] == 0) {
            const result = data["data"];
            result.forEach(e => {
              const obj = {
                id: "", //儿童ID,
                name: "", //儿童姓名
                perfermence: "" //康复表现
              };

              obj.id = e.id;
              obj.name = e.name;
              this.addDataObj.perfermenceList.push(obj);
            });
          } else {
            this.message.error(data.message);
          }
        }
      );
    }

    this.getConRehabilitation(); //获得范畴，子范畴，项目数据
  }

  // 保存小组训练
  saveTrainDetails() {
    this.addDataObj.time = this.jsUtil.dateFormat(this.addDataObj.time);
    this.httpReq.post("/training/save", null, this.addDataObj, data => {
      if (data["code"] == 0) {
        this.message.success("保存成功");
        this.back();
      } else {
        this.message.error(data.message);
      }
    });
  }

  // 获得范畴，子范畴，项目数据
  // 康复配置中获得所有得项目
  getConRehabilitation() {
    this.httpReq.get(
      "/rehabilitionConfig/searchDatas",
      { types: "project,category,subcategory" },
      data => {
        if (data["code"] == 0) {
          const result = data["data"];
          result.forEach(e => {
            // 获得项目列表
            if (e.type == "project") {
              this.conRehabilitationList = e.ddList;
            }

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
