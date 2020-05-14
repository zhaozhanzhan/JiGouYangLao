import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { Utils } from "../../common/utils/utils";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
@Component({
  selector: "app-printFiles",
  templateUrl: "./printFiles.component.html",
  styleUrls: ["./printFiles.component.css"]
})
export class PrintFilesComponent implements OnInit {
  // page = {
  //   total: 0,
  //   size: 10,
  //   index: 1
  // };

  // reqObj = {
  //   page: 1,
  //   size: 10,
  //   name: "",
  //   beginTime: "",
  //   endTime: ""
  // }; //请求列表得参数
  // list = []; //列表得数组
  // isTableLoading = false; //列表加载状态
  // selectedDate = []; //日期
  // isVisible = false; //添加儿童信息的弹出框状态

  // // 儿童添加得参数
  // addChildObj = {
  //   name: "", //名字
  //   sex: "", //性别
  //   folk: "", //名族
  //   parentName: "", //家长姓名
  //   relation: "", //家长与儿童关系
  //   phone: "", //电话
  //   address: "", //地址
  //   bornTime: "", //出生日期
  //   idCard: "", //身份证号
  //   remark: "" //备注
  // };
  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    // if (sessionStorage.getItem(this.router.url) !== null) {
    //   this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    //   if (
    //     !Utils.isEmpty(this.reqObj.beginTime) &&
    //     !Utils.isEmpty(this.reqObj.endTime)
    //   ) {
    //     this.selectedDate.push(new Date(this.reqObj.beginTime));
    //     this.selectedDate.push(new Date(this.reqObj.endTime));
    //   }
    // }
    // this.updateList();
    // this.getBasicConfiguration(); //获得民族和性别
  }

  // 获得所有列表的信息
  // updateList(reset: boolean = false): void {
  //   if (reset) {
  //     this.page.index = 1;
  //   }
  //   this.reqObj.page = this.page.index - 1;
  //   this.reqObj.size = this.page.size;
  //   sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
  //   this.isTableLoading = true;
  //   this.httpReq.post("/rcBaseInfo/listPage", null, this.reqObj, data => {
  //     this.isTableLoading = false;
  //     if (data["status"] == 200) {
  //       this.list = data["data"]["content"];
  //       this.page.total = data["data"]["totalElements"];
  //     }
  //   });
  // }

  // 添加按钮
  // turnToAdd() {
  //   this.isVisible = true; //儿童基本信息弹出框显示
  // }
  // 跳转到保存和修改页面
  // turnToAdd(data, e?: MouseEvent) {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   if (data == "") {
  //     this.router.navigate(["rehabilitationRegistrationAdd"], {
  //       relativeTo: this.route
  //     });
  //   } else {
  //     this.router.navigate(
  //       ["rehabilitationRegistrationAdd", { info: JSON.stringify(data) }],
  //       { relativeTo: this.route }
  //     );
  //   }
  // }

  // turnToCheck(data, e?: MouseEvent) {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   this.router.navigate(
  //     ["rehabilitationRegistrationCheck", { info: JSON.stringify(data) }],
  //     { relativeTo: this.route }
  //   );
  // }
  // 删除
  // delete(id, e?: MouseEvent) {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   this.globalService.delModal(() => {
  //     this.httpReq.post("/rcBaseInfo/del", null, { id: id }, data => {
  //       if (data["status"] == 200) {
  //         if (data["code"] == 0) {
  //           this.message.success("删除成功！");
  //           this.updateList();
  //         } else {
  //           this.message.error(data.message);
  //         }
  //       }
  //     });
  //   });
  // }

  // 选择日期
  // onRangerPickerChange(dateArr: Date[]) {
  //   if (dateArr[0]) {
  //     this.reqObj.beginTime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
  //   } else {
  //     this.reqObj.beginTime = "";
  //   }
  //   if (dateArr[1]) {
  //     this.reqObj.endTime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
  //   } else {
  //     this.reqObj.endTime = "";
  //   }
  // }

  // folkList = []; //民族
  // sexList = []; //性别
  // // 从数据字典中获得民族和性别
  // getBasicConfiguration() {
  //   const that = this;
  //   this.httpReq.post(
  //     "dictMgt/listDataByTypes",
  //     null,
  //     { dictTypes: "folk,sex" },
  //     data => {
  //       if (data["status"] == 200) {
  //         if (data["code"] == 0) {
  //           const info = data["data"];
  //           info.forEach(e => {
  //             //folk民族
  //             if (e.dictType == "folk") {
  //               this.folkList = e.ddList;
  //             }

  //             //sex性别
  //             if (e.dictType == "sex") {
  //               this.sexList = e.ddList;
  //             }
  //           });
  //         } else {
  //           that.message.success(data["message"]);
  //         }
  //       }
  //     }
  //   );
  // }
}
