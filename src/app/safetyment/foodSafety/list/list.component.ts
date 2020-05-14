import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  FirePatrolIsVisible=false;
  previewVisible=true;
  appayType="全部"
  date = "";
  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];
  queryParams = {
    page: 0,
    size: 10,
    name: name,
    isPin: ""
  };
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };
  upload_imgArr=[];
  food={
    name:'',//食品名称
    timeFrame:'',//留样时段
    reservedAmount:'',//留样量
    createTime:'',//留样时间
    reservedPeople:'',//留样人
    pinTime:'',//销样时间
    pinPeople:'',//销样人
    reservedImg:'',//样品图片
  }
  selectedDate = [];
  countHout='';
  countMin='';
  countSec='';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.loadingDataArray();
  }
  // 点击查看显示模态框
  showFirePatrol(id,e?: MouseEvent){
    if (e) {
        e.preventDefault();
      }
      this.FirePatrolIsVisible=true;
      if (id == null) {
        this.router.navigate(["info", "{}"], {
          relativeTo: this.route
        });
      } else {
        this.router.navigate(["info", id], {
          relativeTo: this.route
        });
      }
      // let param = this.httpReq.post(
      //   "/foodRetention/findById",
      //   null,
      //   {id:id},
      //   data => {
      //     if (data["status"] == 200) {
      //        this.food.name=data["data"].name;
      //        this.food.timeFrame=data["data"].timeFrame;
      //        this.food.reservedAmount=data["data"].reservedAmount;
      //        this.food.createTime=data["data"].createTime;
      //        this.food.reservedPeople=data["data"].reservedPeople;
      //        this.food.pinTime=data["data"].pinTime;
      //        this.food.pinPeople=data["data"].pinPeople;
      //        this.upload_imgArr = data["data"].reservedImg.split(",")
      //       //  this.food.reservedImg=data["data"].reservedImg;
      //     }
      //   }
      // );

  }
 // 点击取消，隐藏模态框
  handleCancel(e?: MouseEvent){
    if (e) {
        e.preventDefault();
      }
      this.FirePatrolIsVisible=false ;
  }
  turnToEdit(inApply) {
    this.router.navigate(["info", JSON.stringify(inApply)], {
      relativeTo: this.route
    });
  }
  dateS(){
    let myDate = new Date();
    let that=this
    const hour1 = myDate.getHours();
    let min = myDate.getMinutes(),sec = myDate.getSeconds();
    if(hour1<10){
      that.countHout ="0"+hour1
      console.log(hour1)
    }else{
      that.countHout =""+hour1
    }
    if(min<10){
      this.countMin ="0"+min
    }else{
      this.countMin =""+min
    }
    if(sec<10){
      this.countSec ="0"+sec
    }else{
      this.countSec =""+sec
    }
    return myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate()+" "+this.countHout+":"+this.countMin+":"+this.countSec;
  }
  // 请求食物列表
  loadingDataArray(reset: boolean = false) {
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
    let param = this.httpReq.post(
      "/foodRetention/list",
      null,
      this.queryParams,
      data => {

        this.queryParams.page++;
        sessionStorage.setItem(
          this.router.url,
          JSON.stringify(this.queryParams)
        );

        that.isTableLoading = false;
        if (data["status"] == 200) {
          console.log(data);
          this.dataArray = data["data"]["content"]; // 数据列表
          this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
      }

  //点击销样按钮
  PinSample(id,e?: MouseEvent){
    if (e) {
        e.preventDefault();
      }
      // this.FirePatrolIsVisible=true;

      let param = this.httpReq.post(
        "/foodRetention/doPin",
        null,
        {
          id:id,
          pinPeople:sessionStorage.getItem('userName'),
          pinTime:this.dateS()
        },
        data => {
          if (data["status"] == 200) {
            if(data.code==0){
              this.createMessage('success','销样成功');
              this.loadingDataArray();
            }else{
              this.createMessage('error',data['message']);
            }
          }
        }
      );

  }

}
