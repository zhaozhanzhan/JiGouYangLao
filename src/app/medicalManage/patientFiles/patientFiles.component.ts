import { Component, OnInit, EventEmitter, Input } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  ActivationEnd,
  RouteReuseStrategy
} from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { LocalStorage } from "../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { ReuseTabService } from "@delon/abc";

@Component({
  selector: "app-patientFiles",
  templateUrl: "./patientFiles.component.html",
  styleUrls: ["./patientFiles.component.scss"]
})
export class PatientFilesComponent implements OnInit {
  @Input("patientId") patientId: string; // 病人ID
  organizationName = "medicalRecord";
  public menuList: Array<{
    titName?: string; // 标题名称
    urlLink?: string; // 组件名称
    isShow?: boolean; // 是否显示
    icon?: string; //功能图标
    params?: any; // 参数对象
  }> = [
    {
      titName: "病案首页",
      urlLink: this.organizationName,
      isShow: false,
      icon: ""
    },
    {
      titName: "体温单",
      urlLink: "temperatureChart",
      params: {
        BloodPressMode: 'innormal'
      },
      isShow: false,
      icon: ""
    },
    {
      titName: "体温单（正常）",
      urlLink: "temperatureChart/normal",
      params: {
        BloodPressMode: 'normal'
      },
      isShow: false,
      icon: ""
    },
    {
      titName: "糖尿病记录单",
      urlLink: "diabetesOrder",
      isShow: false,
      icon: ""
    },
    {
      titName: "血压记录单",
      urlLink: "bloodOrder",
      isShow: false,
      icon: ""
    },
    {
      titName: "入院记录",
      urlLink: "residentAdmiNote",
      isShow: false,
      icon: ""
    },
    {
      titName: "病程记录",
      urlLink: "progressNote",
      isShow: false,
      icon: ""
    },
    {
      titName: "长期医嘱单",
      urlLink: "standingOrder",
      isShow: false,
      icon: ""
    },
    {
      titName: "临时医嘱单",
      urlLink: "temporaryOrder",
      isShow: false,
      icon: ""
    },
    {
      titName: "首次护理记录单",
      urlLink: "firstCare",
      isShow: false,
      icon: ""
    },

    {
      titName: "一般护理记录单",
      urlLink: "nursingOrder",
      isShow: false,
      icon: ""
    },
    {
      titName: "护理记录单",
      urlLink: "nursingOrderYG",
      isShow: false,
      icon: ""
    },
    {
      titName: "静脉用药记录单",
      urlLink: "intraMedication",
      isShow: false,
      icon: ""
    },
    {
      titName: "器械检查报告",
      urlLink: "apparatusCheck",
      isShow: false,
      icon: ""
    },
    {
      titName: "血、尿、粪常规化验报告",
      urlLink: "assayOrder",
      isShow: false,
      icon: ""
    },
    {
      titName: "特殊化验报告",
      urlLink: "specialOrder",
      isShow: false,
      icon: ""
    },
    {
      titName: "病案质量评分",
      urlLink: "medicalScore",
      isShow: false,
      icon: ""
    },
    {
      titName: "变更主治医生",
      urlLink: "attendingPhysician",
      isShow: false,
      icon: ""
    },
    {
      titName: "请假外出",
      urlLink: "leaveOut",
      isShow: false,
      icon: ""
    }
  ]; // 左侧菜单列表数组

  public comNameArr: Array<string> = []; // 组件名称数组

  public topMenuArray: Array<{
    titName?: string; // 标题名称
    comName?: string; // 组件名称
    isShow?: boolean; // 是否显示
  }> = []; // 顶部菜单

  public selComName: string = ""; // 已选择的组件
  public selTabIndex: number = null; // 已选择的Tab索引

  public paramObj: any; // 传递过来的参数对象
  personInfoStr: string; //传递过来的老人信息
  private router$: Subscription;
  //当前访问的功能的地址
  curUrlTag = "";
  user;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private actRoute: ActivatedRoute, // 获取传递的参数
    private localStorage: LocalStorage, //存储
    private modalService: NzModalService, //提示
    private msg: NzMessageService, // 消息提醒
    private titleService: Title
  ) {}

  ngOnInit() {
    this.personInfoStr = this.actRoute.snapshot.paramMap["params"]["data"];
    this.paramObj = JSON.parse(this.personInfoStr); // 传递过来的参数
    // console.log(this.paramObj);
    // console.log("=================", this.paramObj.parentUrl);
    // this.user = this.localStorage.getUser();
    // this.accountId = this.user.data.id;
    // if (sessionStorage.getItem(this.router.url) !== null) {
    //   this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    // }
    // this.updateList();

    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
    this.setActive();
  }
  private setActive() {
    //根据当前页面的url地址获取到功能的URL；
    const key = this.router.url.substr(this.router.url.lastIndexOf("/") + 1);
    this.menuList.forEach(element => {
      //根据当前页面的url获取功能名称，并设置到标题上
      if (element.urlLink == key) {
        this.titleService.setTitle(element.titName);
      }
    });
    this.curUrlTag = key;
    // 根据不同得机构显示住院病案首页
    this.user = JSON.parse(localStorage.getItem("systemInfo"));
    // this.user.sysTitle = "无锡市江南颐养院";
    if (this.user.sysTitle == "无锡市江南颐养院") {
      this.menuList[0].urlLink = "medicalRecordJN";
    } else {
      this.menuList[0].urlLink = "medicalRecord";
    }
  }
  /**
   * 返回上一页
   * @memberof PatientFilesComponent
   */
  public back() {
    window.history.back();
  }

  /**
   * 打开标签
   * @param {*} tabObj 标签对象
   * @memberof PatientFilesComponent
   */
  public openTag(tabObj: any) {
    console.log("tag", tabObj);
    this.titleService.setTitle(tabObj.titName);
  }

  // 转JSON
  stringify(item: Object){
    return JSON.stringify(item) || {}
  }
}
