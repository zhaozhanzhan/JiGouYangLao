import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-checkInInfor",
  templateUrl: "./checkInInfor.component.html",
  styleUrls: ["./checkInInfor.component.css"]
})
export class CheckInInforComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "", //名字
    btime: "", //"开始时间",
    etime: "", //"结束时间"
    inId: "" //入院Id
  };

  isTableLoading = false;
  selectedDates = [];
  user;
  accountId;
  status='1';//最近一次得入住信息得状态
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private modalService: NzModalService //提示
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.accountId = this.user.data.id;

    let data = JSON.parse(this.route.snapshot.paramMap.get("data"));
    this.reqObj.inId = data.id;

    if (sessionStorage.getItem(this.router.url) !== null) {
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDates.push(new Date(this.reqObj.btime));
        this.selectedDates.push(new Date(this.reqObj.etime));
      }
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.updateList();
  }

  // 添加跳转
  turnToAdd() {
    this.router.navigate(["addEdit", { id: this.reqObj.inId }], {
      relativeTo: this.route
    });
  }
  // 修改跳转
  turnToEdit(data) {
    this.router.navigate(
      ["addEdit", { data: JSON.stringify(data), id: this.reqObj.inId }],
      {
        relativeTo: this.route
      }
    );
  }

  // 查看跳转
  turnTocheck(data) {
    this.router.navigate(["check", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }
  //返回
  back() {
    history.back();
  }
  // 获得列表
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post(
      "/in_hospitals_info/listPage",
      null,
      this.reqObj,
      data => {
        this.isTableLoading = false;
        if (data["code"] == 0) {
          this.list = data["data"]["content"];
          if(this.list.length>0){
            this.status=this.list[0].status
          }
         
          this.page.total = data["data"]["totalElements"];
        }
      }
    );
  }

  // 删除
  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post(
        "/in_hospitals_info/delete",
        null,
        { id: id, accountId: this.accountId },
        data => {
          if (data["code"] == 0) {
            this.message.success("删除成功！");
            this.updateList();
          }
        }
      );
    });
  }

  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.reqObj.btime = "";
    }
    if (dateArr[1]) {
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.btime = "";
    }
  }
}
