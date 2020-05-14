import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {

  queryParams = {
    page: 0,
    size: 10,
    beginDate: "",
    engDate: "",
    recorder:"",
    areaId:"",
    inspectConclusion:""
  };
  resultData = {
    totalElements: 0
  };


  results={
    dataTimes:"",
    radioValue:''
  }
  dataTime;
  selectedDate=[];
  isTableLoading = false;
  dataArray;
  ObtainPatrol=[];
  radioValue;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      const message= JSON.parse(sessionStorage.getItem(this.router.url));
      if(message.dataTimes==null){
        this.dataTime=undefined;
      }else{
        this.dataTime=message.dataTimes;
        this.dataTime=new Date( this.dataTime);
      }
      this.radioValue=message.radioValue
      // this.getRadio();
      console.log("刚加载时"+this.radioValue)
    }else{
      this.dataTime=undefined
    }

    // this.getRadio();
    // this.onRangerPickerChange(this.dataTime);
    this.loadingDataArray();
    this.getObtainPatrol();
  }

  getObtainPatrol(){
    // 获得巡查区域
  this.httpReq.post('/fpInspect/allList', null, null, (data) => {
  if (data['status'] == 200) {
    if (data.code == '0') {
      console.log(data)
      this.ObtainPatrol = data['data'];
    } else {
      this.createMessage('error', data['message']);
    }
  }
  });
  console.log(typeof(this.dataTime))
}
  getRadio(){
        // 获得巡查周期
      this.httpReq.post('/ffdMemo/findCC', null, null, (data) => {
      if (data['status'] == 200) {
        if (data.code == '0') {
          this.radioValue = String(data['data']['checkCycle']);
        console.log("获得巡查周期"+this.radioValue)
        } else {
          this.createMessage('error', data['message']);
        }
      }
      });
      console.log(typeof(this.dataTime))
  }
  createMessage(type: string, mess: string): void {
		this.message.create(type, `${mess}`);
	}
  // 点击查看显示模态框
  showFirePatrol(info,e?: MouseEvent){
    if (e) {
        e.preventDefault();
      }
      if (info == null) {
        this.router.navigate(["info", "{}"], {
          relativeTo: this.route
        });
      } else {
        this.router.navigate(["info", JSON.stringify(info)], {
          relativeTo: this.route
        });
      }
      // this.FirePatrolIsVisible=true;
  }

  loadingDataArray(reset: boolean = false) {
    this.onRangerPickerChange(this.dataTime);
    const that = this;
    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }

    that.isTableLoading = true;

    this.results.dataTimes=this.dataTime;
    this.results.radioValue=this.radioValue
    let param = this.httpReq.post(
      "fpInspect/list",
      null,
      this.queryParams,
      data => {

        this.queryParams.page++;

        console.log("接口内的"+this.dataTime)
        sessionStorage.setItem(
          this.router.url,
          JSON.stringify(this.results)
        );
        that.isTableLoading = false;
        if (data["status"] == 200) {
          data["data"]=JSON.parse(data["data"])
          if(data.code=="0"){
            this.dataArray = data["data"]["value"]; // 数据列表
            this.resultData.totalElements = data["data"]["total"]; // 总条数
          }
        }
      }
    );
  }


  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {

    this.getRadio();
    console.log(this.radioValue )
    if(this.dataTime==undefined){
      this.queryParams.beginDate = "";
      this.queryParams.engDate = "";
    }else{
        if(this.radioValue=='1'){
            this.dataTime=this.jsUtil.dateFormat(dateArr, 'YYYY-MM-DD');

            //如果周期是日，传的时间参数
            this.queryParams.beginDate = this.dataTime + " 00:00:00";
            this.queryParams.engDate = this.dataTime + " 23:59:59";
        }else if(this.radioValue=='2'){
          // 如果是周，传选择的日期这一周的时间

            let now =this.dataTime;
            console.log(now)
            let nowTime = now.getTime() ;
            let day = now.getDay();
            let oneDayTime = 24*60*60*1000 ;
            //显示周一
            let MondayTime = nowTime - (day-1)*oneDayTime ;
            //显示周日
            let SundayTime =  nowTime + (7-day)*oneDayTime ;
            //初始化日期时间
            let monday = new Date(MondayTime);
            let  sunday = new Date(SundayTime);

            this.queryParams.beginDate=this.jsUtil.dateFormat(monday, 'YYYY-MM-DD')+ " 00:00:00";
            this.queryParams.engDate=this.jsUtil.dateFormat(sunday, 'YYYY-MM-DD')+ " 23:59:59";

        }else{
          // 如果是月，传选择的日期这一月的时间
          this.dataTime = this.jsUtil.dateFormat(this.dataTime, 'YYYY-MM');
          let  yearmouth=[];
          let days;
          yearmouth= this.dataTime.split('-');
          yearmouth[0]=parseInt(yearmouth[0]);
          yearmouth[1]=parseInt(yearmouth[1]);
          // 判断一个月有多少天
          if(yearmouth[1] == 2){
            days= yearmouth[0] % 4 == 0 ? 29 : 28;
          }
          else if(yearmouth[1] == 1 || yearmouth[1] == 3 || yearmouth[1] == 5 || yearmouth[1] == 7 || yearmouth[1] == 8 || yearmouth[1] == 10 || yearmouth[1] == 12){
            //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
            days= 31;
          }
          else{
            //其他月份，天数为：30.
            days= 30;
          }
          this.queryParams.beginDate=this.dataTime+'-1'+' 00:00:00';
          this.queryParams.engDate = this.dataTime+'-'+days+ ' 23:59:59';
          }
      }
  }
}
