import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-monthPlanDetails",
  templateUrl: "./monthPlanDetails.component.html",
  styleUrls: ["./monthPlanDetails.component.css"]
})
export class MonthPlanDetailsComponent implements OnInit {
  // 获取季度的计划列表参数
  listPlanObj = {
    id: "", //记录的ID
    type: "月度" //获取哪个计划列表
  };

  planList = []; //计划列表数组
  isVisible = false; //添加计划名称和时间显示
  // 添加计划名称和计划时间参数
  addPlanObj = {
    name: "", //计划名称
    type: "月度", //计划的类型
    childrenId: "", //记录的ID
    startTime: "", //开始时间
    endTime: "", //结束时间  ,
    month: "", //月
    therapist: "" //康复师
  };
  selectedDate = []; //日期

  // 添加具体季度内容参数
  addPlanDetailsObj = {
    feedback: "", //反馈 ,
    id: "", //id ,
    name: "", //季度计划名字 ,
    indexs: "", //下标 ,
    plan: "", //计划 ,
    planId: "", //计划id ,
    problem: "", //问题 ,
    project: "", //项目 ,
    target: "", //目标 ,
    therapist: "", //康复师
    startTime: "", //开始时间
    endTime: "", //结束时间
    month: "" //月
  };
  obj;
  userInfo;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    therapist: "", //康复训练师
    startTime: "", //时间开始
    endTime: "", //时间结束
    childrenId: "", //儿童id
    month: "" //月份
  }; //请求列表得参数
  list = []; //列表得数组
  isTableLoading = false; //列表加载状态
  dateMore = []; //日期
  collectVisible = false; //显示汇总列表弹出框
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private modalService: NzModalService //提示
  ) {}

  ngOnInit() {
    this.listPlanObj.id = this.route.snapshot.paramMap.get("id"); //获得传递过来的记录ID
    this.addPlanObj.childrenId = this.route.snapshot.paramMap.get("id"); //获得传递过来的记录ID
    this.reqObj.childrenId = this.route.snapshot.paramMap.get("id"); //获得传递过来的记录ID

    this.obj = JSON.parse(this.route.snapshot.paramMap.get("data")); //获得传递过来的记录ID
    let userInfoData: any = this.localStorage.getUser();
    this.userInfo = userInfoData.data;

    // 获取季度的计划列表
    this.getListPlan();
  }

  // 添加时弹出框显示
  add() {
    this.isVisible = true;
    this.addPlanObj.name = "";
    this.addPlanObj.month = "";
    this.selectedDate = [];
  }
  // 保存整个计划
  savePlan(data) {
    this.addPlanDetailsObj.planId = data.id;
    this.addPlanDetailsObj.therapist = data.therapist;
    this.addPlanDetailsObj.name = data.name;
    this.addPlanDetailsObj.target = data.target;
    this.addPlanDetailsObj.project = data.project;
    this.addPlanDetailsObj.problem = data.problem;
    this.addPlanDetailsObj.plan = data.plan;
    this.addPlanDetailsObj.month = this.jsUtil.dateFormat(
      data.month,
      "YYYY-MM"
    );
    // this.addPlanDetailsObj.startTime = this.jsUtil.dateFormat(data.startTime);
    // this.addPlanDetailsObj.endTime = this.jsUtil.dateFormat(data.endTime);

    if (this.addPlanDetailsObj.name == "") {
      this.message.error("月度计划名称不能为空");
      return;
    }

    if (this.addPlanDetailsObj.month == "") {
      this.message.error("训练月份不能为空");
      return;
    }
    this.httpReq.post(
      "/rehabilitationPlan/addPlanData",
      null,
      this.addPlanDetailsObj,
      data => {
        if (data["code"] == 0) {
          this.message.success("保存成功");
          this.getListPlan();
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
  // 保存添加的计划名称和日期
  saveNewPlan() {
    if (this.addPlanObj.name == "") {
      this.message.error("月度计划名称不能为空");
      return;
    }

    if (this.addPlanObj.month == "") {
      this.message.error("月份不能为空");
      return;
    } else {
      this.addPlanObj.month = this.jsUtil.dateFormat(
        this.addPlanObj.month,
        "YYYY-MM"
      );
    }

    this.addPlanObj.therapist = this.userInfo.name;
    this.httpReq.post(
      "/rehabilitationPlan/addPlan",
      null,
      this.addPlanObj,
      data => {
        this.isVisible = false;
        if (data["code"] == 0) {
          this.message.success("保存成功");
          this.getListPlan();
        } else {
          this.message.error(data.message);
        }
      }
    );
  }

  delete(id) {
    this.modalService.confirm({
      nzTitle: `确定是否删除？`,
      nzOnOk: () => {
        this.httpReq.get(
          "rehabilitationPlan/deletePlan",
          { id: id },
          (data: any) => {
            if (data["code"] == 0) {
              this.message.success("删除成功！");
              this.getListPlan();
            }
          }
        );
      }
    });
  }

  // 获取季度的计划列表
  getListPlan() {
    this.httpReq.get("/rehabilitationPlan/listPlan", this.listPlanObj, data => {
      if (data["code"] == 0) {
        this.planList = data["data"];
      }
    });
  }

  // 选择日期
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.addPlanObj.startTime = this.jsUtil.dateFormat(dateArr[0]);
    } else {
      this.addPlanObj.startTime = "";
    }
    if (dateArr[1]) {
      this.addPlanObj.endTime = this.jsUtil.dateFormat(dateArr[1]);
    } else {
      this.addPlanObj.endTime = "";
    }
  }

  // 返回
  back() {
    history.back();
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    this.isTableLoading = true;
    this.httpReq.get("/rehabilitationPlan/listSummary", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // 选择日期
  onRangerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.reqObj.startTime = this.jsUtil.dateFormat(dateArr[0]);
    } else {
      this.reqObj.startTime = "";
    }
    if (dateArr[1]) {
      this.reqObj.endTime = this.jsUtil.dateFormat(dateArr[1]);
    } else {
      this.reqObj.endTime = "";
    }
  }

  checkCollect(data) {
    this.collectVisible = true;
    this.reqObj.month = this.jsUtil.dateFormat(data.month, "YYYY-MM");
    this.updateList();
  }
}
