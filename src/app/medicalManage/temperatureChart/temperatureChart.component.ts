import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { personInfo } from "../temperatureChartDraw/chartDraw/chartDataModel";
import { LocalStorage } from "src/app/common/service/local.storage";
import { object, isObject } from "types/underscore";

@Component({
  selector: "app-temperatureChart",
  templateUrl: "./temperatureChart.component.html",
  styleUrls: ["./temperatureChart.component.scss"]
})
export class TemperatureChartComponent implements OnInit {
  @Input() inHospitalInfoId;
  tabSelectedIndex = 0; //分页显示选中的下标位
  user: any;
  accountId: string = ""; //当前登录者的id
  inPersonInfo: any; //传递进页面的患者信息
  TabInfo: any; //传递进标签页信息
  inHospitalId = ""; //患者的住院ID
  BloodPressMode = "normal"; // 血压模式模式 normal 为正常
  public printStyle: string = ".tableInfo {  width: 100%;}.temperature-chart .tableTitle {  color: #1b1b1b;  text-align: center;} #temperatureChart td {  padding: 0px 0px !important;font-size: 8px;}.temperature-chart table {  border-collapse: collapse;}.temperature-chart .fontRed {  color: red;}.temperature-chart .fixed_div {  position: relative;  top: 0;  left: 0;  z-index: 100;  overflow: hidden;}.tableInfo tr td {  border: 0px solid #bfbfbf;}.temperature-chart {  margin: 0 auto;  height: 100%;  color: #000;  -webkit-text-size-adjust: none;}.show-detail {  overflow-x: auto;}.show-detail::-webkit-scrollbar {  width: 0;  height: 8px;}.show-detail::-webkit-scrollbar-corner,.show-detail::-webkit-scrollbar-track {  background-color: #b7b7b7;}.show-detail::-webkit-scrollbar-thumb {  border-radius: 0;  background-color: rgba(0, 0, 0, 0.3);}.footBtn {  line-height: 28px;  text-align: left;  margin: 15px 0;}.footBtn .ant-calendar-picker {  margin-right: 10px;}.temperature-chart {  width: 100%;  height: 100%;  /* 打印样式调整 */}.temperature-chart .ant-spin-nested-loading {  width: 100%;  height: 100%;}.temperature-chart .ant-spin-nested-loading .ant-spin-container {  width: 100%;  height: 100%;}.temperature-chart table {  border-collapse: collapse;  table-layout: fixed;}.temperature-chart th,.temperature-chart td {  border: 1px solid #bfbfbf;  position: relative;}.temperature-chart .tempCartSvg {  position: relative;  height: 100%;}.temperature-chart .fixed_div {  position: relative;  top: 0;  left: 0;  z-index: 100;  overflow: hidden;}.temperature-chart table.patInfo {  width: 100%;  font-size: 8px;  margin-bottom: 20px;}.temperature-chart table.showInfo {  width: 100%;  font-size: 8px;}.temperature-chart table.patInfo td {  border: none;}.temperature-chart table.patInfo tr:nth-of-type(3) td,.temperature-chart table.patInfo tr:nth-of-type(4) td {  height: 14px;  line-height: 14px;}.temperature-chart table.patInfo tr:nth-of-type(4) td {  /*border-bottom: 1px solid #bfbfbf;*/}.temperature-chart table.patInfo td h1 {  text-align: center;  font-size: 15px;  font-weight: 500;  margin-top: 5px;  letter-spacing: 2px;}.temperature-chart table.patInfo td h3 {  text-align: center;  font-size: 18px;  font-weight: 500;  letter-spacing: 6px;}.temperature-chart .bline {  border-bottom: 1px solid #bfbfbf;  float: left;  width: 120px;  line-height: 12px;  height: 12px;  text-indent: 4px;  max-width: calc(100% - 83px);}.temperature-chart .btitle {  float: left;  text-indent: 8px;}.temperature-chart tr.percent4 td {  width: 25%;}.temperature-chart .showInfo {  width: 100%;}.temperature-chart .showInfo tr td {  text-align: center;  font-size: 8px;  height: 14px;  line-height: 14px;}.temperature-chart .showInfo tr:nth-of-type(4) td {  font-size: 8px;}.temperature-chart .showInfo tr {  height: 12px;}.temperature-chart .showInfo tr:nth-of-type(1) td {  border-top: 1px solid #888888;}.temperature-chart .showInfo tr td:nth-of-type(1) {  border-left: none;  text-align: center;  text-align-last: center;  padding: 0 8px;}.temperature-chart .showInfo tr td:last-of-type {}.temperature-chart .flow_div {  position: relative;  left: 0;  width: 100%;  overflow-x: hidden;  border: 1px solid #888888;  border-top: none;  border-bottom: none;}.temperature-chart .flow_div::-webkit-scrollbar {  width: 0;  height: 0;}.temperature-chart table.tableSvg {  width: 100%;}.temperature-chart table.tableSvg tr td {  font-size: 8px;}.temperature-chart table.tableSvg tr td:nth-of-type(1) {  font-size: 8px;  text-align: center;  border-left: none;}.temperature-chart table.tableSvg tr:nth-of-type(1) td:nth-of-type(1),.temperature-chart table.tableSvg tr:nth-of-type(1) td:last-of-type {  /*border-bottom: 1px solid #888888;*/}.temperature-chart table.tableSvg tr:last-of-type td {  /*border-bottom: none;*/}.temperature-chart table.tableSvg tr td:last-of-type {  border-top: none;}.temperature-chart table tr td.every:last-of-type {  border: none;}.temperature-chart table tr td.hx:last-of-type {  border: none;}.temperature-chart table.tableSvg tr:nth-of-type(1) td:last-of-type {  border: none;  border-bottom: none;}.temperature-chart table.tableSvg td {  text-align: center;}.temperature-chart .scale {  width: 100%;  display: block;  transform: scale(0.8);}.temperature-chart table tr.height {  height: 15px;}.temperature-chart table tr.height td.hx {  height: 34px;}.temperature-chart table tr.height:nth-of-type(1) td {  border-top: none;}.temperature-chart tr.height td {  border: 1px solid #bfbfbf;}.temperature-chart tr td.borderR,.temperature-chart tr.height td.borderR {  border-right: 1px solid red;}.temperature-chart tr.height.borderT td,.temperature-chart tr.borderT td {  border-top: 1px solid red;}.temperature-chart tr.height.borderB td,.temperature-chart tr.borderB td,.temperature-chart tr.height td.borderB {  border-bottom: 1px solid #888888;}.temperature-chart tr.height.borderRedB td,.temperature-chart tr.borderRedB td,.temperature-chart tr.height td.borderRedB {  border-bottom: 1px solid red;}.temperature-chart .svgCenter {  position: absolute;  width: 100%;  /*height:100%;*/  z-index: 100;}.temperature-chart #svgCenter {  position: absolute;  top: 0;  left: 104px;  width: calc(100% - 166px);  height: 100%;}.temperature-chart .fontSet {  -webkit-transform: scalex(0.99);}.temperature-chart #titleTr tr:nth-of-type(2) td {  padding-bottom: 3px;}.temperature-chart .svgLeft,.temperature-chart .svgRight,.temperature-chart #svgLeft,.temperature-chart #svgRight {  width: 100%;  height: 100%;  position: absolute;  top: 0;  left: 0;}.temperature-chart #svgTitle {  background: #fff;  border: 1px solid #bfbfbf;  padding: 1px 6px;  color: #3c3c3c;  font-weight: 500;  font-size: 12px;  border-radius: 3px;  -webkit-border-radius: 3px;  position: absolute;  z-index: 1000;  display: none;}.temperature-chart [line] {  cursor: pointer;}.temperature-chart .container.print table tr.height {  height: 15px;}.temperature-chart .container.print .footBtn {  display: none;}.temperature-chart .container.print .scale {  transform: scale(1);}.temperature-chart .container.print .patInfo td {  height: 17px;  line-height: 17px;  font-size: 8px;}.temperature-chart .container.print .showInfo td {  height: 15px;  line-height: 15px;  font-size: 8px;}.temperature-chart .container.alone.print tr.every td {  line-height: 15px;  font-size: 8px;}.temperature-chart .container.alone.print .tableSvg tr.addClone {  height: 15px;}.temperature-chart .container.print .flow_div {  max-height: inherit;}.temperature-chart text {  font-size: 8px;}.temperature-chart .container.print text {  font-size: 8px;}.temperature-chart circle,.temperature-chart rect,.temperature-chart line {  cursor: pointer;}.border_black_bottom {  border-bottom: 1px solid #888888 !important;}.temperature-chart .container.print table tr.height {  height: 15px;}.temperature-chart .container.print .footBtn {  display: none;}.temperature-chart .container.print .scale {  transform: scale(1);}.temperature-chart .container.print .patInfo td {  height: 17px;  line-height: 17px;  font-size: 11px;}.temperature-chart .container.print .showInfo td {  height: 15px;  line-height: 15px;  font-size: 11px;}.temperature-chart .container.alone.print tr.every td {  line-height: 15px;  font-size: 11px;}.temperature-chart .container.alone.print .tableSvg tr.addClone {  height: 15px;}.temperature-chart .container.print .flow_div {  max-height: inherit;}";
  constructor(
    private jsUtil: JsUtilsService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.accountId = this.user.data.id;

    let paramsStr = this.actRoute.snapshot.queryParams["data"];
    let tabInfo = this.actRoute.snapshot.queryParams["tabInfo"];
    if(typeof paramsStr === 'string') this.inPersonInfo = JSON.parse(paramsStr);
    if(typeof tabInfo === 'string') this.TabInfo = JSON.parse(tabInfo);;
    console.log("tag", this.inPersonInfo);
    console.log("tab", this.TabInfo);
    if(this.inHospitalInfoId){
      this.inHospitalId = this.inHospitalInfoId;
    }
    //获取传递过来的患者信息
    if (this.inPersonInfo && this.inPersonInfo.id) {
      this.inHospitalId = this.inPersonInfo.inHospitalInfo.id;
    }
    // 获取传递来的标签页信息
    if (this.TabInfo instanceof Object && this.TabInfo !== null && 'params' in this.TabInfo && 'BloodPressMode' in this.TabInfo.params) {
      this.BloodPressMode = this.TabInfo.params.BloodPressMode;
    }
  }
}
