import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-handoversheet",
  templateUrl: "handoversheet.component.html",
  styleUrls: ["./handoversheet.component.scss"]
})
export class HandoverSheetComponent implements OnInit {
  isLoadingData = false;
  list = [];
  dataList = [];
  employeesGroupList;
  dateTime = "";
  FirePatrolIsVisible = false; //详情弹窗框显示
  TeamDetailsName = ""; //班组的名字

  // reqObj = {
  // 	spId: '4028815e657f6e3001657fa843f30002',
  // 	yearMonth: '2018-09'
  // };
  reqObj = {
    spId: "",
    yearMonth: ""
  };
  date = new Date(2018, 6, 21);

  loading = true;
  isSelectLoading = false;
  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.onSearch("");
    this.reqObj.yearMonth = this.jsUtil.dateFormat(new Date(), "YYYY-MM");
  }

  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  onChange(result: Date): void {
    this.reqObj.yearMonth = this.jsUtil.dateFormat(result, "YYYY-MM");
    // this.reqObj.yearmonth = '2018-7';
    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (this.reqObj.spId == "" || this.reqObj.spId == null) {
      this.createMessage("error", "请选择班组");
      return;
    }

    if (this.reqObj.yearMonth == "") {
      this.createMessage("error", "请选择月份");
      return;
    }
    let that = this;
    that.isLoadingData = true;
    this.httpReq.post("shiftLog/listByDay", null, this.reqObj, data => {
      that.isLoadingData = false;
      if (data["status"] == 200) {
        if (data.code == "0") {
          that.list = JSON.parse(data["data"]);
          that.dataList = [];
          for (var i = 0; i < that.list.length; i++) {
            let dayDetail = { day: "", date: undefined, value: {} };

            dayDetail.day = that.list[i].day;
            dayDetail.date = new Date(dayDetail.day);
            dayDetail.value = that.list[i].value;
            that.dataList.push(dayDetail);
          }

          console.log(that.dataList);
          
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }

  searchList() {
    this.updateList();
  }

  onSearch(value: string): void {
    this.isSelectLoading = true;
    const that = this;
    this.httpReq.post(
      "schedulingProgram/list1",
      null,
      { name: value },
      data => {
        that.loading = false;
        if (data["status"] == 200) {
          that.employeesGroupList = data["data"];
          if (that.employeesGroupList && that.employeesGroupList.length > 0) {
            that.reqObj.spId = that.employeesGroupList[0].id;
          }
          // this.page.total = result.total; // 总条数
        }
      }
    );
  }

  // 	getMonthData(date: Date): number | null {
  // 		if (date.getMonth() === 8) {
  // 			return 1394;
  // 		}
  // 		return null;
  //   }

  // 请求详情时候的参数
  teamOrGroup = {
    day: "",
    spId: "",
    scheduling: "早班"
  };
  teamDetails = {
    teamName: "", //班别
    employeesName: "", //提交人
    memo: "" //日志详情
  };
  teamorArray 
  click(dayDate) {
    this.FirePatrolIsVisible = true;
    this.teamOrGroup.day = dayDate;
    this.teamOrGroup.spId = this.reqObj.spId;

    this.httpReq.post("/shiftLog/list", null, this.teamOrGroup, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
            this.teamorArray=data["data"];
            // this.TeamDetailsName=this.teamOrGroup.day+data['data'].memo.schProgram.name+'交接班详情'
          if (data["data"].length == 0) {
            this.teamDetails.employeesName = "";
          
          } else {
            this.teamDetails.teamName = data["data"][0].schProgram.name;
          
          }
        }
      }
    });
  }

  //   取消弹窗的事件
  handleCancel() {
    this.FirePatrolIsVisible = false;
  }

  isShow(curDate, curDay) {
    let tempDay = this.jsUtil.dateFormat(curDate);
    if (tempDay == curDay) {
      return true;
    }
    return false;
  }
}
