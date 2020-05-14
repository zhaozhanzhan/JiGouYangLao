import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../common/service/local.storage";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {
  // 床位信息
  bedsInformationNumber = {
    totalBeds: "", //总床位数
    numberOfBeds: "", //使用床位数
    occupancyRate: "" //入住率
  };
  // 老人信息
  oldManInformationNumber = {
    totalNumberOfService: "", //总服务人数
    numberOfDischargedPatients: "", //出院人数
    currentOccupancy: "" //目前入住人数
  };
  // 护工信息
  careInformationNumber = {
    carNumber: "", //护工总数
    teamNumber: "" //班组数
  };
  // 护理信息
  nursingInformationNumber = {
    serviceNumber: "", //服务总数
    monthServiceNumber: "", //当月服务总数
    todayServiceNumber: "" //当日服务总数
  };

  // 消防设施
  fireFightingNumber = {
    facilitiesSum: "", //设施数量
    todayFireInspection: "", //今日消防巡查
    everydayFireInspection: "", //每日消防巡查
    patrolCycle: "" //巡查周期
  };

  chartOption = {};
  nursingServicesContainer = {};
  TodaynursingServicesContainer = {};
  constructor(
    private localStorage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.bedsInformation();
    this.oldManInformation();
    this.careInformation();
    this.nursingInformation();
    this.fireFighting();
    this.NursingGradeStatistics();
    this.nursingServices();
    this.TodaynursingServicesContainerS();
  }
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  // 消防设施
  fireFighting() {
    let that = this;
    that.httpReq.post("homePage/getFfdInfo", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          let result = JSON.parse(data["data"]);
          that.fireFightingNumber.facilitiesSum = result.ffdNum;
          that.fireFightingNumber.todayFireInspection = result.ffdMemoNum;
          that.fireFightingNumber.everydayFireInspection = result.fpInspectNum;
          that.fireFightingNumber.patrolCycle = result.checkStyle;
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }

  // 获得护理信息
  nursingInformation() {
    let that = this;
    that.httpReq.post("homePage/getResCaseInfo", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          let result = JSON.parse(data["data"]);
          that.nursingInformationNumber.serviceNumber = result.totalResCaseNum;
          that.nursingInformationNumber.monthServiceNumber =
            result.thisMonthResCaseNum;
          that.nursingInformationNumber.todayServiceNumber =
            result.todayResCaseNum;
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }
  // 获得护工信息
  careInformation() {
    let that = this;
    that.httpReq.post("homePage/getEmpInfo", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          let result = JSON.parse(data["data"]);
          that.careInformationNumber.carNumber = result.totalEmpNum;
          that.careInformationNumber.teamNumber = result.totalSpNum;
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }

  // 获得老人信息
  oldManInformation() {
    let that = this;
    that.httpReq.post("homePage/getOldmanInfo", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          let result = JSON.parse(data["data"]);
          that.oldManInformationNumber.totalNumberOfService =
            result.totalOldmanNum;
          that.oldManInformationNumber.numberOfDischargedPatients =
            result.checkOutOldmanNum;
          that.oldManInformationNumber.currentOccupancy =
            result.checkInOldmanNum;
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }

  // 获得床位信息
  bedsInformation() {
    let that = this;
    that.httpReq.post("homePage/getBedInfo", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          let result = JSON.parse(data["data"]);
          that.bedsInformationNumber.totalBeds = result.totalBedNum;
          that.bedsInformationNumber.numberOfBeds = result.usedBedNum;
          that.bedsInformationNumber.occupancyRate = result.rate;
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }

  // 获得入住老人护理统计
  NursingGradeStatistics() {
    let that = this;
    that.httpReq.post("homePage/getOldmanCareLvlCount", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          const result = data["data"];
          var getOldManList = JSON.parse(result).value;
          var dataOldManList = [];
          var dataOldManTitleList = [];
          for (var i = 0; i < getOldManList.length; i++) {
            var obj = {
              value: "",
              name: ""
            };

            var name = {
              name: ""
            };
            obj.value = getOldManList[i].levelNum;
            obj.name = getOldManList[i].levelName;

            name.name = getOldManList[i].levelName;
            dataOldManList.push(obj);
            dataOldManTitleList.push(name);
          }
          this.chartOption = {
            color: [
              "#f3483b",
              "#f3853b",
              "#4972fa",
              "#09a9ec",
              "#09c9ec",
              "#01c48b"
            ], //饼状图颜色数组
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              type: "scroll",
              orient: "vertical",
              right: 30,
              top: 150,
              bottom: 20,
              data: dataOldManTitleList
            },
            series: [
              {
                name: "",
                type: "pie",
                radius: "60%",
                center: ["35%", "45%"],
                data: dataOldManList,
                itemStyle: {
                  normal: {
                    label: {
                      //此处为指示线文字
                      show: true,
                      position: "inner", //标签的位置
                      textStyle: {
                        fontWeight: 200,
                        fontSize: 10 //文字的字体大小
                      },
                      formatter: function(p) {
                        //指示线对应文字
                        var data = p.data.value + "人";
                        return data;
                      }
                    },
                    labelLine: {
                      //指示线状态
                      show: true,
                      smooth: 0.2,
                      length: 10,
                      length2: 20
                    }
                  }
                }
              }
            ]
          };
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }

  // 获得护理服务趋势
  nursingServices() {
    let that = this;
    that.httpReq.post("/homePage/getResCaseTrend", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          const result = data["data"];
          var getNursingServicesList = JSON.parse(result).value;
          var dataNursingServicesMon = [];
          var dataNursingServicesNumber = [];
          for (var i = 0; i < getNursingServicesList.length; i++) {
            dataNursingServicesMon.push(getNursingServicesList[i].month + "月");
            dataNursingServicesNumber.push(getNursingServicesList[i].num);
          }
          dataNursingServicesMon.reverse();
          dataNursingServicesNumber.reverse();
          this.nursingServicesContainer = {
            legend: {
              textStyle: {
                color: "#000"
              },
              type: "scroll",
              orient: "vertical",
              right: 15,
              top: 5,
              bottom: 20,
              data: ["护理次数"]
            },
            xAxis: {
              type: "category",
              boundaryGap: true,
              data: dataNursingServicesMon,
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#afbcc0", // 左边线的颜色
                  width: "3" // 坐标线的宽度
                }
              },
              axisLabel: {
                color: "#afbcc0", // 坐标值得具体的颜色
                fontSize: 14
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: ["#afbcc0"],
                  width: 1
                }
              }
            },
            yAxis: {
              type: "value",
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#afbcc0", // 左边线的颜色
                  width: "3" // 坐标线的宽度
                }
              },
              axisLabel: {
                textStyle: {
                  color: "#afbcc0", // 坐标值得具体的颜色
                  fontSize: 12
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ["#afbcc0"],
                  width: 1
                }
              }
            },
            series: [
              {
                data: dataNursingServicesNumber,
                type: "line",
                name: "护理次数",
                label: {
                  normal: {
                    show: true,
                    formatter: function(params) {
                      var data = params.value;
                      if (params.value > 0) {
                        return params.value;
                      } else {
                        return "";
                      }
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    borderRadius: 200, // 添加渐变颜色
                    color: "#f9204e"
                  }
                },
                areaStyle: {
                  normal: {}
                }
              }
            ]
          };
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }

  // 获得入住老人护理统计
  TodaynursingServicesContainerS() {
    let that = this;
    that.httpReq.post("/homePage/getTodayResCaseCount", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          const result = data["data"];
          var getServiceStatisticsTodayList = JSON.parse(result).value;
          var dataServiceStatisticsTodayList = [];
          var dataServiceStatisticsTodayTitle = [];
          for (var i = 0; i < getServiceStatisticsTodayList.length; i++) {
            var obj = {
              value: "",
              name: ""
            };

            var name = {
              name: ""
            };
            obj.value = getServiceStatisticsTodayList[i].memoNum;
            obj.name = getServiceStatisticsTodayList[i].memoName;

            name.name = getServiceStatisticsTodayList[i].memoName;
            dataServiceStatisticsTodayList.push(obj);
            dataServiceStatisticsTodayTitle.push(name);
          }
          this.TodaynursingServicesContainer = {
            color: [
              "#f3483b",
              "#f3853b",
              "#4972fa",
              "#09a9ec",
              "#09c9ec",
              "#01c48b"
            ], //饼状图颜色数组
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              type: "scroll",
              orient: "vertical",
              right: 15,
              top: 150,
              bottom: 20,
              data: dataServiceStatisticsTodayTitle
            },
            series: [
              {
                name: "",
                type: "pie",
                radius: "60%",
                center: ["35%", "45%"],
                data: dataServiceStatisticsTodayList,
                itemStyle: {
                  normal: {
                    label: {
                      //此处为指示线文字
                      show: true,
                      position: "inner", //标签的位置
                      textStyle: {
                        fontWeight: 200,
                        fontSize: 10 //文字的字体大小
                      },
                      formatter: function(p) {
                        //指示线对应文字
                        var data = p.data.value + "次";
                        return data;
                      }
                    },
                    labelLine: {
                      //指示线状态
                      show: true,
                      smooth: 0.2,
                      length: 10,
                      length2: 20
                    }
                  }
                }
              }
            ]
          };
        } else {
          that.createMessage("error", data["message"]);
        }
      }
    });
  }
}
