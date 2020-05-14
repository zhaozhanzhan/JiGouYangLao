import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
  AfterContentChecked
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "src/app/common/utils/utils";

@Component({
  selector: "app-temperatureTable",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TemperatureTableComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    //切换到当前图标模式分页
    if (changes["tabSelectedIndex"].currentValue == 0) {
      this.queryTemperatureInfo();
    }
  }
  @Input()
  tabSelectedIndex = 0;
  //患者信息存放对象
  @Input()
  inHospitalId = "";

  @Input() BloodPressMode = "normal"; // 血压显示模式 normal 为正常模式

  //存储获取到的患者信息
  personInfo;
  //存储体温单数据
  temperatureInfoData;
  //存放选择的日期对象，供查询使用
  queryDayDate;

  isLoading = false;

  //是否有上一页
  isHastLast = false;
  //是否有下一页
  isHastNext = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.queryDayDate = new Date();
    this.queryTemperatureInfo();
  }

  // 获取体温单数据
  queryTemperatureInfo(): void {
    if (!this.queryDayDate) {
      this.queryDayDate = new Date();
    }
    let queryParam = {
      personInfoId: this.inHospitalId,
      dateStr: Utils.dateFormat(this.queryDayDate)
    };

    this.isLoading = true;
    let that = this;
    this.httpReq.post("temp_chart/list", null, queryParam, data => {
      this.isLoading = false;
      if (data["code"] == 0) {
        let resultData = JSON.parse(data.data);
        that.personInfo = resultData.personInfo;
        that.temperatureInfoData = resultData.data;
      }
    });
  }

  //获取上一页数据
  goLast() {
    let inDate = new Date(this.personInfo.inDate);
    let diffDay = this.dateDiff(inDate, this.queryDayDate);
    if (diffDay > 7) {
      this.queryDayDate = this.addDate(this.queryDayDate, -7);
      this.temperatureInfoData = [];
      this.queryTemperatureInfo();
    } else {
      this.message.warning("没有上一页数据了！");
    }
  }
  //获取下一页数据
  goNext() {
    this.queryDayDate = this.addDate(this.queryDayDate, 7);
    this.temperatureInfoData = [];
    this.queryTemperatureInfo();
  }

  /**
   * 计算两个日期的相差天数
   */
  dateDiff(d1, d2) {
    var day = 24 * 60 * 60 * 1000;
    try {
      var checkTime = d1.getTime();
      var checkTime2 = d2.getTime();
      var cha = (checkTime2 - checkTime) / day;
      return cha;
    } catch (e) {
      return 0;
    }
  }

  /**
   * 日期，在原有日期基础上，增加days天数，默认增加1天
   */
  addDate(date, days) {
    if (days == undefined || days == "") {
      days = 1;
    }
    date.setDate(date.getDate() + days);
    return date;
  }
}
