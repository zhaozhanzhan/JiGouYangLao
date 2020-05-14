import { Component, OnInit, ViewChild } from "@angular/core";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  constructor(
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService
  ) {}

  isLoadingData = false;
  dataList = [];
  employeesGroupList;
  dateTime = "";
  TeamDetailsName = ""; //班组的名字
  selectedDate = [];

  reqObj = {
    spId: "",
    yearMonth: ""
  };
  date = new Date(2018, 6, 21);
  loading = true;
  isSelectLoading = false;

  params = {
    btime: "",
    etime: "",
    ffdAreaId: ""
  };
  radioValue; //消防巡查周期
  videoMode = "month"; //显示日历为年还是月  year

  ngOnInit() {
    this.reqObj.yearMonth = this.jsUtil.dateFormat(new Date(), "YYYY-MM");
    // 消防巡查周期获得数据
    this.httpReq.post("/ffdMemo/findCC", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          this.radioValue = String(data["data"]["checkCycle"]);
          if (this.radioValue == "1" || this.radioValue == "2") {
            this.videoMode = "month";
          } else {
            this.videoMode = "year";
          }
        } else {
          this.createMessage("error", data["message"]);
        }
      }
    });
    this.onSearch();
  }

  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  onChange(result: Date): void {
    this.reqObj.yearMonth = this.jsUtil.dateFormat(result, "YYYY-MM");
    let yearmouth = [];
    let days;
    yearmouth = this.reqObj.yearMonth.split("-");
    yearmouth[0] = parseInt(yearmouth[0]);
    yearmouth[1] = parseInt(yearmouth[1]);
    // 判断一个月有多少天
    if (yearmouth[1] == 2) {
      days = yearmouth[0] % 4 == 0 ? 29 : 28;
    } else if (
      yearmouth[1] == 1 ||
      yearmouth[1] == 3 ||
      yearmouth[1] == 5 ||
      yearmouth[1] == 7 ||
      yearmouth[1] == 8 ||
      yearmouth[1] == 10 ||
      yearmouth[1] == 12
    ) {
      //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
      days = 31;
    } else {
      //其他月份，天数为：30.
      days = 30;
    }
    this.params.btime = this.reqObj.yearMonth + "-1" + " 00:00:00";
    this.params.etime = this.reqObj.yearMonth + "-" + days + " 23:59:59";
    this.updateList();
  }

  updateDate;
  updateList(): void {
    let that = this;
    that.dataList = [];
    that.isLoadingData = true;
    this.httpReq.post("ffdMemo/list1", null, this.params, data => {
      that.isLoadingData = false;
      if (data.code == "0") {
        data["data"] = JSON.parse(data["data"]);
        let list = data["data"]["value"];
        for (var i = 0; i < list.length; i++) {
          if (that.videoMode == "year") {
            list[i].updateDate = list[i].updateDate.slice(0, 7);
          } else {
            list[i].updateDate = list[i].updateDate.slice(0, 10);
          }

          let dayDetail = { day: "", date: undefined, isQualified: "" };

          dayDetail.day = list[i].updateDate;
          dayDetail.date = new Date(dayDetail.day);
          dayDetail.isQualified = list[i].isQualified;
          that.dataList.push(dayDetail);
        }
      }
    });
  }

  onSelectedAreaChange(areaId) {
    this.params.ffdAreaId = areaId;
    this.updateList();
  }

  // 获得所有区域
  onSearch() {
    this.isSelectLoading = true;
    const that = this;
    this.httpReq.post(
      "ffdArea/listAll",
      null,
      {
        page: 0,
        size: 99999
      },
      data => {
        that.loading = false;
        if (data["status"] == 200) {
          data["data"] = JSON.parse(data["data"]);
          that.employeesGroupList = data["data"]["value"];
          if (that.employeesGroupList && that.employeesGroupList.length > 0) {
            that.params.ffdAreaId = that.employeesGroupList[0].id;
            that.onChange(new Date());
          }
        }
      }
    );
  }

  isShow(curDate, curDay) {
    let tempDay = this.jsUtil.dateFormat(curDate);
    if (tempDay == curDay) {
      return true;
    }
    return false;
  }

  /**
   * 时间范围筛选
   */
  // onRangerPickerChange(dateArr: Date[]) {
  // 	if (dateArr.length == 2) {
  // 		this.params.btime = this.jsUtil.dateFormat(dateArr[0]) + ' 00:00:00';
  // 		this.params.etime = this.jsUtil.dateFormat(dateArr[1]) + ' 23:59:59';
  // 	} else {
  // 		this.params.btime = '';
  // 		this.params.etime = '';
  // 	}
  // }
}
