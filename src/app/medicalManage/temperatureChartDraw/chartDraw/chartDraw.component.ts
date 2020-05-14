import { Utils } from "../../../common/utils/utils";
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
import {
  ChartDataInfo,
  temperatureType,
  PointData,
  dayData
} from "./chartDataModel";
import { ENgxPrintComponent } from "e-ngx-print";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-temperatureChartDraw",
  templateUrl: "./chartDraw.component.html",
  styleUrls: ["./chartDraw.component.scss"]
})
export class ChartDrawComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    //切换到当前图标模式分页
    setTimeout(_ => this.updateToDraw(), 0);
  }
  //体温单天数对象，用于按天初始化表格；
  iniDayTable = [0, 1, 2, 3, 4, 5, 6];
  //体温单网格列数对象，用于按网格数进行表格绘制；
  iniGridCol = [];
  //体温单网格行数对象，用于按网格数进行表格绘制；
  gridRow = [];

  //体温单数据对象
  tempData: ChartDataInfo = null;
  //体温单中每天的数据对象；
  tempDayInfoArray = [];

  //体温单绘制hmtl内容存放对象
  tempContentString = "";
  //体温单绘制内容容器
  tempContent;
  //打印使用的style
  temperatureStyle =
    ".tableInfo {  width: 100%;}.temperature-chart .tableTitle {  color: #1b1b1b;  text-align: center;}td {  padding: 0px 0px !important;font-size: 8px;}.temperature-chart table {  border-collapse: collapse;}.temperature-chart .fontRed {  color: red;}.temperature-chart .fixed_div {  position: relative;  top: 0;  left: 0;  z-index: 100;  overflow: hidden;}.tableInfo tr td {  border: 0px solid #bfbfbf;}.temperature-chart {  margin: 0 auto;  height: 100%;  color: #000;  -webkit-text-size-adjust: none;}.show-detail {  overflow-x: auto;}.show-detail::-webkit-scrollbar {  width: 0;  height: 8px;}.show-detail::-webkit-scrollbar-corner,.show-detail::-webkit-scrollbar-track {  background-color: #b7b7b7;}.show-detail::-webkit-scrollbar-thumb {  border-radius: 0;  background-color: rgba(0, 0, 0, 0.3);}.footBtn {  line-height: 28px;  text-align: left;  margin: 15px 0;}.footBtn .ant-calendar-picker {  margin-right: 10px;}.temperature-chart {  width: 100%;  height: 100%;  /* 打印样式调整 */}.temperature-chart .ant-spin-nested-loading {  width: 100%;  height: 100%;}.temperature-chart .ant-spin-nested-loading .ant-spin-container {  width: 100%;  height: 100%;}.temperature-chart table {  border-collapse: collapse;  table-layout: fixed;}.temperature-chart th,.temperature-chart td {  border: 1px solid #bfbfbf;  position: relative;}.temperature-chart .tempCartSvg {  position: relative;  height: 100%;}.temperature-chart .fixed_div {  position: relative;  top: 0;  left: 0;  z-index: 100;  overflow: hidden;}.temperature-chart table.patInfo {  width: 100%;  font-size: 8px;  margin-bottom: 20px;}.temperature-chart table.showInfo {  width: 100%;  font-size: 8px;}.temperature-chart table.patInfo td {  border: none;}.temperature-chart table.patInfo tr:nth-of-type(3) td,.temperature-chart table.patInfo tr:nth-of-type(4) td {  height: 14px;  line-height: 14px;}.temperature-chart table.patInfo tr:nth-of-type(4) td {  /*border-bottom: 1px solid #bfbfbf;*/}.temperature-chart table.patInfo td h1 {  text-align: center;  font-size: 15px;  font-weight: 500;  margin-top: 5px;  letter-spacing: 2px;}.temperature-chart table.patInfo td h3 {  text-align: center;  font-size: 18px;  font-weight: 500;  letter-spacing: 6px;}.temperature-chart .bline {  border-bottom: 1px solid #bfbfbf;  float: left;  width: 120px;  line-height: 12px;  height: 12px;  text-indent: 4px;  max-width: calc(100% - 83px);}.temperature-chart .btitle {  float: left;  text-indent: 8px;}.temperature-chart tr.percent4 td {  width: 25%;}.temperature-chart .showInfo {  width: 100%;}.temperature-chart .showInfo tr td {  text-align: center;  font-size: 8px;  height: 14px;  line-height: 14px;}.temperature-chart .showInfo tr:nth-of-type(4) td {  font-size: 8px;}.temperature-chart .showInfo tr {  height: 12px;}.temperature-chart .showInfo tr:nth-of-type(1) td {  border-top: 1px solid #888888;}.temperature-chart .showInfo tr td:nth-of-type(1) {  border-left: none;  text-align: center;  text-align-last: center;  padding: 0 8px;}.temperature-chart .showInfo tr td:last-of-type {}.temperature-chart .flow_div {  position: relative;  left: 0;  width: 100%;  overflow-x: hidden;  border: 1px solid #888888;  border-top: none;  border-bottom: none;}.temperature-chart .flow_div::-webkit-scrollbar {  width: 0;  height: 0;}.temperature-chart table.tableSvg {  width: 100%;}.temperature-chart table.tableSvg tr td {  font-size: 8px;}.temperature-chart table.tableSvg tr td:nth-of-type(1) {  font-size: 8px;  text-align: center;  border-left: none;}.temperature-chart table.tableSvg tr:nth-of-type(1) td:nth-of-type(1),.temperature-chart table.tableSvg tr:nth-of-type(1) td:last-of-type {  /*border-bottom: 1px solid #888888;*/}.temperature-chart table.tableSvg tr:last-of-type td {  /*border-bottom: none;*/}.temperature-chart table.tableSvg tr td:last-of-type {  border-top: none;}.temperature-chart table tr td.every:last-of-type {  border: none;}.temperature-chart table tr td.hx:last-of-type {  border: none;}.temperature-chart table.tableSvg tr:nth-of-type(1) td:last-of-type {  border: none;  border-bottom: none;}.temperature-chart table.tableSvg td {  text-align: center;}.temperature-chart .scale {  width: 100%;  display: block;  transform: scale(0.8);}.temperature-chart table tr.height {  height: 15px;}.temperature-chart table tr.height td.hx {  height: 34px;}.temperature-chart table tr.height:nth-of-type(1) td {  border-top: none;}.temperature-chart tr.height td {  border: 1px solid #bfbfbf;}.temperature-chart tr td.borderR,.temperature-chart tr.height td.borderR {  border-right: 1px solid red;}.temperature-chart tr.height.borderT td,.temperature-chart tr.borderT td {  border-top: 1px solid red;}.temperature-chart tr.height.borderB td,.temperature-chart tr.borderB td,.temperature-chart tr.height td.borderB {  border-bottom: 1px solid #888888;}.temperature-chart tr.height.borderRedB td,.temperature-chart tr.borderRedB td,.temperature-chart tr.height td.borderRedB {  border-bottom: 1px solid red;}.temperature-chart .svgCenter {  position: absolute;  width: 100%;  /*height:100%;*/  z-index: 100;}.temperature-chart #svgCenter {  position: absolute;  top: 0;  left: 104px;  width: calc(100% - 166px);  height: 100%;}.temperature-chart .fontSet {  -webkit-transform: scalex(0.99);}.temperature-chart #titleTr tr:nth-of-type(2) td {  padding-bottom: 3px;}.temperature-chart .svgLeft,.temperature-chart .svgRight,.temperature-chart #svgLeft,.temperature-chart #svgRight {  width: 100%;  height: 100%;  position: absolute;  top: 0;  left: 0;}.temperature-chart #svgTitle {  background: #fff;  border: 1px solid #bfbfbf;  padding: 1px 6px;  color: #3c3c3c;  font-weight: 500;  font-size: 12px;  border-radius: 3px;  -webkit-border-radius: 3px;  position: absolute;  z-index: 1000;  display: none;}.temperature-chart [line] {  cursor: pointer;}.temperature-chart .container.print table tr.height {  height: 15px;}.temperature-chart .container.print .footBtn {  display: none;}.temperature-chart .container.print .scale {  transform: scale(1);}.temperature-chart .container.print .patInfo td {  height: 17px;  line-height: 17px;  font-size: 8px;}.temperature-chart .container.print .showInfo td {  height: 15px;  line-height: 15px;  font-size: 8px;}.temperature-chart .container.alone.print tr.every td {  line-height: 15px;  font-size: 8px;}.temperature-chart .container.alone.print .tableSvg tr.addClone {  height: 15px;}.temperature-chart .container.print .flow_div {  max-height: inherit;}.temperature-chart text {  font-size: 8px;}.temperature-chart .container.print text {  font-size: 8px;}.temperature-chart circle,.temperature-chart rect,.temperature-chart line {  cursor: pointer;}.border_black_bottom {  border-bottom: 1px solid #888888 !important;}.temperature-chart .container.print table tr.height {  height: 15px;}.temperature-chart .container.print .footBtn {  display: none;}.temperature-chart .container.print .scale {  transform: scale(1);}.temperature-chart .container.print .patInfo td {  height: 17px;  line-height: 17px;  font-size: 11px;}.temperature-chart .container.print .showInfo td {  height: 15px;  line-height: 15px;  font-size: 11px;}.temperature-chart .container.alone.print tr.every td {  line-height: 15px;  font-size: 11px;}.temperature-chart .container.alone.print .tableSvg tr.addClone {  height: 15px;}.temperature-chart .container.print .flow_div {  max-height: inherit;}";

  @Input()
  personInfo;

  @Input() BloodPressMode = "normal"; // 血压显示模式 normal 为正常模式

  @Input()
  temperatureInfoData = [];

  @ViewChild("print") printComponent: ENgxPrintComponent;
  isPrintNow = false;
  systemInfo;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private sanitizer: DomSanitizer
  ) {
    for (let index = 0; index < 44; index++) {
      this.iniGridCol.push(index);
    }
  }

  ngOnInit() {
    //初始化网格行数
    //多加1行,系统自带会有1行
    this.gridRow.push({
      isBlackLine: false, //刻度线条
      isRedLine: false //37°线条
    });
    //后40行
    for (let index = 0; index < 40; index++) {
      let line = {
        isBlackLine: false,
        isRedLine: false
      };
      if (index % 5 == 0) {
        line.isBlackLine = true;
        if (index / 5 == 5) {
          line.isRedLine = true;
        }
      }

      this.gridRow.push(line);
    }
    this.gridRow.push({
      isBlackLine: false
    });

    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
  }

  /**
   * 进行页面绘制
   *
   * @memberof ChartDrawComponent
   */
  updateToDraw() {
    this.tempData = {
      titleInfo: {
        level1Title: this.systemInfo.sysTitle,
        level2Title: "体 温 单"
      },
      personInfo: this.personInfo,
      data: this.temperatureInfoData
    };
    this.saxDayInfo();
    this.saxToDraw(this.tempData);
    this.tempContent = this.sanitizer.bypassSecurityTrustHtml(
      this.tempContentString
    );
  }

  onPrint(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isPrintNow = true;
    this.printComponent.print();
  }

  printComplete() {
    this.isPrintNow = false;
  }

  //解析体温、脉搏、心率、呼吸数据，并绘制画点、线
  saxToDraw(tempData: ChartDataInfo) {
    let dayArray = tempData.data;
    let allPointArray: Array<PointData> = [];
    //绘制内容初始化
    this.tempContentString = "";
    if (!Utils.isArray(dayArray)) {
      dayArray = [];
    }
    for (let dayIndex = 0; dayIndex < dayArray.length; dayIndex++) {
      const pointArray = dayArray[dayIndex].pointsData;
      allPointArray = allPointArray.concat(pointArray);
    }
    //体温线对象；
    let temperatureLine = [];
    //心率线对象；
    let heartRateLine = [];
    //脉搏线对象
    let pulseLine = [];
    //呼吸线对象
    let breatheLine = [];

    for (let index = 0; index < allPointArray.length; index++) {
      //解析到某天，某时的数据对象----pointInfo
      const pointInfo = allPointArray[index];
      const dayIndex = pointInfo.dayIndex;
      const pointIndex = pointInfo.pointIndex;
      //根据第几天，几时，计算横向x轴的坐标
      let x = dayIndex * 6 * 15 + pointIndex * 15 + 67;

      //体温数据对象---tempInfo
      const tempInfo = pointInfo.temperature;
      let tempY = this.changeTempratureValueToY(tempInfo.value);
      if (tempY > 0 || tempInfo.isUncheck) {
        let tempLineInfo = {
          dayIndex: dayIndex,
          pointIndex: pointIndex,
          x: x,
          y: tempY
        };
        temperatureLine.push(tempLineInfo);
      }
      //处理后体温数据对象---handingTempInfo
      const handingTempInfo = pointInfo.handingTemperature;
      let handingTempY = this.changeTempratureValueToY(handingTempInfo.value);

      //脉搏数据对象---pulseInfo
      const pulseInfo = pointInfo.pulse;
      let pulseY = this.changeHeartRateValueToY(pulseInfo);
      if (pulseY > 0 || tempInfo.isUncheck) {
        let pulseLineInfo = {
          dayIndex: dayIndex,
          pointIndex: pointIndex,
          x: x,
          y: pulseY
        };
        pulseLine.push(pulseLineInfo);
      }
      //心率数据对象---heartRateInfo
      const heartRateInfo = pointInfo.heartRate;
      let heartRateY = this.changeHeartRateValueToY(heartRateInfo);
      if (heartRateY > 0 || tempInfo.isUncheck) {
        let heartRateLineInfo = {
          dayIndex: dayIndex,
          pointIndex: pointIndex,
          x: x,
          y: heartRateY
        };
        heartRateLine.push(heartRateLineInfo);
      }

      //呼吸数据对象---breatheInfo
      const breatheInfo = pointInfo.breathe;
      let breatheY = this.changeBreatheValueToY(breatheInfo.value);
      if (breatheY > 0 || tempInfo.isUncheck) {
        let breatheLineInfo = {
          dayIndex: dayIndex,
          pointIndex: pointIndex,
          x: x,
          y: breatheY
        };
        breatheLine.push(breatheLineInfo);
      }
      //绘制处理后体温标识
      this.drawPoint(x, handingTempY, "handingTemp");
      //绘制处理后体温的红灯笼绘制，绘制垂直虚线
      this.drawStrokeDasharray(x, tempY, x, handingTempY);
      //绘制呼吸标识
      this.drawPoint(x, breatheY, "breathe");
      //体温标识绘制
      let type = "";
      if (tempInfo.type == temperatureType.OralTemp) {
        //口温
        type = "oralTemp";
      } else if (tempInfo.type == temperatureType.EarTemp) {
        //耳温
        type = "earTemp";
      } else if (
        tempInfo.type == temperatureType.OxterTemp //腋温
      ) {
        type = "oxterTemp";
      } else if (
        tempInfo.type == temperatureType.AnorectumTemp //肛温
      ) {
        type = "anorectumTemp";
      }
      //=================判断体温和心率、脉搏重叠的情况================
      //是否需要绘制脉搏，如果和体温重叠，不需要绘制
      let isNeedDrawPulsePoint = true;
      //是否需要心率脉搏，如果和体温重叠，不需要绘制
      let isNeedDrawHeartRatePoint = true;
      //判断体温和脉搏是否Y轴重叠
      if (pulseY == tempY || heartRateY == tempY) {
        if (tempInfo.type == temperatureType.OralTemp) {
          //当脉搏、心率的标识和口温重叠时，以蓝点红圈标识；
          type = "oralTempPulse";
        } else if (tempInfo.type == temperatureType.AnorectumTemp) {
          //当脉搏、心率的标识和肛温重叠时，以红点蓝圈标识；
          type = "anorectumTempPulse";
        } else {
          //当脉搏、心率的标识和体温重叠时，以蓝×红圈标识；
          type = "tempPulse";
        }

        if (pulseY == tempY) {
          isNeedDrawPulsePoint = false;
        }
        if (heartRateY == tempY) {
          isNeedDrawHeartRatePoint = false;
        }
      }
      if (isNeedDrawPulsePoint) {
        //绘制脉搏标识
        this.drawPoint(x, pulseY, "pulse");
      }
      if (isNeedDrawHeartRatePoint) {
        //绘制心率线
        this.drawPoint(x, heartRateY, "heartRate");
        //绘制垂直的红线，用于标识心率短绌
        this.drawRedLine(x, pulseY, x, heartRateY);
      }
      //体温标识在其他标识之后绘制，是防止体温、心率、脉搏、呼吸值都处于同一Y轴坐标时，体温标识被遮挡，无法识别
      this.drawPoint(x, tempY, type);
      //==========================================================

      //===体温在35℃线上时画蓝色向下箭头===============
      if (tempY == 565) {
        this.drawBlueArrowUnderLinde35(x);
        //此时体温的标识，需要使用蓝色圆形标识，因此，设定type=‘oralTemp’
        this.drawPoint(x, tempY, "oralTemp");
      }
      //===========================================

      //绘制42℃线下内容
      const pointUndexLine42Content = pointInfo.underLine42;
      this.drawUnderLine42(dayIndex, pointIndex, pointUndexLine42Content);
      //绘制35℃线上内容
      const pointAboveLine35Content = pointInfo.aboveLine35;
      this.drawAboveLinde35(dayIndex, pointIndex, pointAboveLine35Content);
      //绘制35℃线下内容
      const pointUnderLine35Content = pointInfo.underLine35;
      this.drawUnderLinde35(dayIndex, pointIndex, pointUnderLine35Content);
    }

    //体温线绘制
    this.saxTemplatureLine(temperatureLine);
    //脉搏线绘制
    this.saxPulseLine(pulseLine);
    //呼吸线绘制，体温和呼吸线都都为蓝色
    this.saxTemplatureLine(breatheLine);
    //心率线绘制，脉搏线和心率线都为红色
    this.saxPulseLine(heartRateLine);
  }

  /**
   * 绘制42℃线下内容
   *
   * @param {*} dayIndex 哪一天的数据
   * @param {*} pointIndex 哪一时间点的数据
   * @param {Array<string>} content 绘制内容
   * @memberof ChartDrawComponent
   */
  drawUnderLine42(
    dayIndex,
    pointIndex,
    content: { first: string; second: string }
  ) {
    let strArray = [];

    strArray = strArray.concat(content.first.split(""));
    strArray.push(" ");
    strArray = strArray.concat(content.second.split(""));

    for (let strIndex = 0; strIndex < strArray.length; strIndex++) {
      const element = strArray[strIndex];
      //根据第几天，几时，计算横向x轴的坐标
      let x = dayIndex * 6 * 15 + pointIndex * 15 + 67;
      //基于42℃线所在位置计算y坐标
      let y = 57 + 15 * strIndex;
      let temp = `<text style="font-size:10px" x="${x}" y="${y}" fill="red">${element}</text>`;
      //拼接文本
      this.tempContentString += temp;
    }
  }

  /**
   * 绘制35℃线上文本内容
   *
   * @param {*} dayIndex
   * @param {*} pointIndex
   * @param {string} content
   * @memberof ChartDrawComponent
   */
  drawAboveLinde35(dayIndex, pointIndex, content: string) {
    let strArray = content.split("");
    for (let strIndex = 0; strIndex < strArray.length; strIndex++) {
      const element = strArray[strIndex];
      //根据第几天，几时，计算横向x轴的坐标
      let x = dayIndex * 6 * 15 + pointIndex * 15 + 67;
      //基于35℃线所在位置计算y坐标
      let y = 567 - 15 * strIndex;
      let temp = `<text style="font-size:10px" x="${x}" y="${y}" fill="blue">${element}</text>`;
      //拼接文本
      this.tempContentString += temp;
    }
  }

  /**
   *绘制35℃线下文本内容
   *
   * @param {*} dayIndex
   * @param {*} pointIndex
   * @param {string} content
   * @memberof ChartDrawComponent
   */
  drawUnderLinde35(dayIndex, pointIndex, content: string) {
    let strArray = content.split("");
    for (let strIndex = 0; strIndex < strArray.length; strIndex++) {
      const element = strArray[strIndex];
      //根据第几天，几时，计算横向x轴的坐标
      let x = dayIndex * 6 * 15 + pointIndex * 15 + 67;
      //基于35℃线所在位置计算y坐标
      let y = 582 + 15 * strIndex;
      let temp = `<text style="font-size:10px" x="${x}" y="${y}" fill="blue">${element}</text>`;
      //拼接文本
      this.tempContentString += temp;
    }
  }
  /**
   *体温低于35℃时，在35℃线下绘制蓝色向下箭头
   *
   * @param {*} dayIndex
   * @param {*} pointIndex
   * @param {string} content
   * @memberof ChartDrawComponent
   */
  drawBlueArrowUnderLinde35(x) {
    //基于35℃线所在位置计算y坐标
    let y1 = 569;
    let y2 = 591;
    let temp = `<line
                x1="${x + 6}"
                y1="${y1}"
                x2="${x + 6}"
                y2="${y2}"
                style="stroke: blue; stroke-width: 1.3"
                marker-end="url(#markerArrow)"
              ></line>
              <!--  向下的蓝色箭头 -->
            <marker
              id="markerArrow"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="0"
            >
              <path
                d="M0,0  L8,0 L4,7 L 0,0"
                style="fill: blue"
              ></path>
            </marker>`;
    //拼接文本
    this.tempContentString += temp;
  }

  /**
   *绘制点
   *
   * @param {*} dayIndex
   * @param {*} pointIndex
   * @memberof ChartDrawComponent
   */
  drawPoint(x, y, type) {
    if (y < 0) {
      return;
    }
    let temp = ``;
    switch (type) {
      case "oralTemp": //口温
        temp = `<use xlink: href = "#oralTemp" x = "${x}" y = "${y}" />`;
        break;
      case "earTemp": //耳温
        temp = `<use xlink: href = "#earTemp" x = "${x + 2}" y = "${y + 2}" />`;
        break;
      case "oxterTemp": //腋温
        temp = `<use xlink: href = "#oxterTemp" x = "${x + 2}" y = "${y}" />`;
        break;
      case "anorectumTemp": //肛温
        temp = `<use xlink: href = "#anorectumTemp" x = "${x}" y = "${y}" />`;
        break;
      case "handingTemp": //处理后体温
        //处理后体温的标识点和心率标识是一样的，都是使用红色圆圈标识；
        temp = ` <use xlink: href = "#heartRate" x = "${x}" y = "${y}" />`;
        break;
      case "pulse": //脉搏
        temp = `<use xlink: href = "#pulse" x = "${x}" y = "${y}" />`;
        break;
      case "heartRate": //心率
        temp = `<use xlink: href = "#heartRate" x = "${x}" y = "${y}" />`;
        break;
      case "breathe": //心率
        temp = `<use xlink: href = "#breathe" x = "${x}" y = "${y}" />`;
        break;
      case "tempPulse": //体温和脉搏重叠
        temp = `<use xlink: href = "#tempPulse" x = "${x}" y = "${y}" />`;
        break;
      case "anorectumTempPulse": //肛温和脉搏重叠
        temp = `<use xlink: href = "#anorectumTempPulse" x = "${x}" y = "${y}" />`;
        break;
      case "oralTempPulse": //口温和脉搏重叠
        temp = `<use xlink: href = "#oralTempPulse" x = "${x}" y = "${y}" />`;
        break;
    }
    //拼接文本
    this.tempContentString += temp;
  }

  /**
   * 根据体温值计算y轴坐标
   *
   * @param {string} valueStr
   * @returns
   * @memberof ChartDrawComponent
   */
  changeTempratureValueToY(valueStr: string) {
    if (Utils.isEmpty(valueStr)) {
      return -1;
    }
    let valueFloat = parseFloat(valueStr);
    if (valueFloat == NaN) {
      return -1;
    }
    //当体温值小于35摄氏度时按照35℃绘制；
    if (valueFloat < 35) {
      valueFloat = 35;
    }
    //当体温值高于42.8摄氏度时按照42.8绘制；
    if (valueFloat > 42.6) {
      valueFloat = 42.6;
    }
    //体温单0.2为1格，1格==15px;
    let y = 640 - ((((valueFloat - 34) / 0.2) * 15) >> 0);
    return y;
  }

  //绘制红色虚线，用于标识降温线
  drawStrokeDasharray(x1, y1, x2, y2) {
    if (y1 < 0 || y2 < 0) {
      return;
    }
    x1 = x1 + 6;
    x2 = x2 + 6;
    y1 = y1 + 5;
    y2 = y2 + 5;
    let temp = ` <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-dasharray="2 2" stroke="red" />`;
    //拼接文本
    this.tempContentString += temp;
  }
  //绘制红色实线，用于标识脉搏短绌
  drawRedLine(x1, y1, x2, y2) {
    if (y1 < 0 || y2 < 0) {
      return;
    }
    x1 = x1 + 6;
    x2 = x2 + 6;
    y1 = y1 + 5;
    y2 = y2 + 5;
    let temp = ` <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke-width: 1" stroke="red" />`;
    //拼接文本
    this.tempContentString += temp;
  }
  /**
   *处理心率、脉搏数值，转换成y轴坐标
   *
   * @param {string} value
   * @memberof ChartDrawComponent
   */
  changeHeartRateValueToY(valueStr: string) {
    if (Utils.isEmpty(valueStr)) {
      return -1;
    }
    //转换成整数
    let valueInt = parseInt(valueStr);
    if (valueInt == NaN) {
      return -1;
    }
    //心率低于20，超过180不处理
    if (valueInt < 20 || valueInt > 180) {
      return -1;
    }
    //心率和脉搏都是4次1格，1格==15px
    let y = 640 - ((((valueInt - 20) / 4) * 15) >> 0);
    return y;
  }

  /**
   *处理呼吸数值，转换成y轴坐标
   *
   * @param {string} value
   * @memberof ChartDrawComponent
   */
  changeBreatheValueToY(valueStr: string) {
    if (Utils.isEmpty(valueStr)) {
      return -1;
    }
    //转换成整数
    let valueInt = parseInt(valueStr);
    if (valueInt == NaN) {
      return -1;
    }
    //呼吸低于10，超过90不处理
    if (valueInt < 10 || valueInt > 90) {
      return -1;
    }
    //呼吸刻度是2次1格，1格==15px
    let y = 640 - ((((valueInt - 10) / 2) * 15) >> 0);
    return y;
  }

  /**
   *绘制体温线
   *
   * @param {[]} tempLine
   * @memberof ChartDrawComponent
   */
  saxTemplatureLine(tempLine) {
    if (Utils.isArray(tempLine) && tempLine.length < 2) {
      return;
    }
    for (let index = 0; index < tempLine.length; index++) {
      if (index >= 1) {
        let lastLinePoint = tempLine[index - 1];
        let curLinePoint = tempLine[index];
        this.drawBlueLine(
          lastLinePoint.x,
          lastLinePoint.y,
          curLinePoint.x,
          curLinePoint.y
        );
      }
    }
  }

  /**
   *绘制脉搏线
   *
   * @param {[]} tempLine
   * @memberof ChartDrawComponent
   */
  saxPulseLine(pulseLine) {
    if (Utils.isArray(pulseLine) && pulseLine.length < 2) {
      return;
    }
    for (let index = 0; index < pulseLine.length; index++) {
      const element = pulseLine[index];
      if (index >= 1) {
        let lastLinePoint = pulseLine[index - 1];
        let curLinePoint = pulseLine[index];
        this.drawRedLine(
          lastLinePoint.x,
          lastLinePoint.y,
          curLinePoint.x,
          curLinePoint.y
        );
      }
    }
  }

  //绘制蓝色实线，用于标识体温线
  drawBlueLine(x1, y1, x2, y2) {
    if (y1 < 0 || y2 < 0) {
      return;
    }
    x1 = x1 + 6;
    x2 = x2 + 6;
    y1 = y1 + 5;
    y2 = y2 + 5;
    let temp = ` <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke-width: 1" stroke="blue" />`;
    //拼接文本
    this.tempContentString += temp;
  }

  /**
   *按天解析数据，空缺的天的数据用空对象补足
   *
   * @memberof ChartDrawComponent
   */
  saxDayInfo() {
    this.tempDayInfoArray = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      let dayInfo = {};
      if (Utils.isArray(this.tempData.data)) {
        for (let i = 0; i < this.tempData.data.length; i++) {
          const info = this.tempData.data[i];
          if (info.dayIndex == dayIndex) {
            dayInfo = info;
          }
        }
      }
      this.tempDayInfoArray.push(dayInfo);
    }
  }
}
