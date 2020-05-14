import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { Utils } from "../../common/utils/utils";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
@Component({
  selector: "app-childRehabilition",
  templateUrl: "./childRehabilition.component.html",
  styleUrls: ["./childRehabilition.component.css"]
})
export class ChildRehabilitionComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    timeStart: "",
    timeEnd: ""
  }; //请求列表得参数
  list = []; //列表得数组
  isTableLoading = false; //列表加载状态
  selectedDate = []; //日期
  isVisible = false; //添加儿童信息的弹出框状态

  // 儿童添加得参数
  addChildObj = {
    id: "", //儿童id,添加不需要传，修改该时传
    name: "", //名字
    sex: "", //性别
    folk: "", //名族
    parentName: "", //家长姓名
    relation: "", //家长与儿童关系
    phone: "", //电话
    address: "", //地址
    bornTime: "", //出生日期
    idCard: "", //身份证号
    remark: "" //备注
  };

  // 添加康复类型参数
  archivesObj = {
    id: "", //儿童得id
    types: "" //选择得康复类型
  };
  typesList = [];
  childRehabilitionIsVisible = false; //康复类型弹出框
  folkList = []; //民族
  sexList = []; //性别
  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService,
    private modalService: NzModalService //提示
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.reqObj.timeStart) &&
        !Utils.isEmpty(this.reqObj.timeEnd)
      ) {
        this.selectedDate.push(new Date(this.reqObj.timeStart));
        this.selectedDate.push(new Date(this.reqObj.timeEnd));
      }
    }

    this.updateList();
    this.getBasicConfiguration(); //获得民族和性别
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.get("/children/list", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }
  // 添加按钮
  turnToAdd(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (data == "") {
      this.addChildObj.id = "";
      this.addChildObj = {
        id: "", //儿童id,添加不需要传，修改该时传
        name: "", //名字
        sex: "", //性别
        folk: "", //名族
        parentName: "", //家长姓名
        relation: "", //家长与儿童关系
        phone: "", //电话
        address: "", //地址
        bornTime: "", //出生日期
        idCard: "", //身份证号
        remark: "" //备注
      };
    } else {
      this.addChildObj = data;
    }
    this.isVisible = true; //儿童基本信息弹出框显示
  }

  // 保存或修改儿童基本信息
  saveChildInfo() {
    if (
      this.addChildObj.name == "" ||
      this.addChildObj.sex == "" ||
      this.addChildObj.bornTime == ""
    ) {
      this.message.error("姓名、性别、出生日期不可为空");
      return;
    }

    // const idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    // if (!idcardReg.test(this.addChildObj.idCard)) {
    //   this.message.error("身份证输入不合法！");
    //   return;
    // }

    this.addChildObj.bornTime = this.jsUtil.dateFormat(
      this.addChildObj.bornTime
    );
    this.httpReq.post("/children/save", null, this.addChildObj, data => {
      this.isVisible = false;
      if (data["code"] == 0) {
        this.message.success("保存成功");
        this.updateList();
      } else {
        this.message.error(data["message"]);
      }
    });
  }
  // 显示康复类型弹出框
  addChildRehabilition(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.typesList = [];
    this.childRehabilitionIsVisible = true;
    this.archivesObj.id = id;
  }
  // 添加康复类型
  saveChildRehabilition() {
    this.archivesObj.types = this.typesList.join(",");
    this.httpReq.get("/children/addArchives", this.archivesObj, data => {
      this.childRehabilitionIsVisible = false;
      if (data["code"] == 0) {
        this.message.success("保存成功");
        this.updateList();
      } else {
        this.message.error(data["message"]);
      }
    });
  }
  // 选择日期
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.reqObj.timeStart = this.jsUtil.dateFormat(dateArr[0]);
    } else {
      this.reqObj.timeStart = "";
    }
    if (dateArr[1]) {
      this.reqObj.timeEnd = this.jsUtil.dateFormat(dateArr[1]);
    } else {
      this.reqObj.timeEnd = "";
    }
  }

  // 从数据字典中获得民族和性别
  getBasicConfiguration() {
    const that = this;
    this.httpReq.post(
      "dictMgt/listDataByTypes",
      null,
      { dictTypes: "folk,sex" },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const info = data["data"];
            info.forEach(e => {
              //folk民族
              if (e.dictType == "folk") {
                this.folkList = e.ddList;
              }
              //sex性别
              if (e.dictType == "sex") {
                this.sexList = e.ddList;
              }
            });
          } else {
            that.message.success(data["message"]);
          }
        }
      }
    );
  }

  // 跳转到智力残疾档案详情
  turnToBrainsDetails(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.router.navigate(
      [
        "brainsDetails",
        {
          id: data.id,
          isAssessment1: data.isAssessment1,
          data: JSON.stringify(data)
        }
      ],
      {
        relativeTo: this.route
      }
    );
  }

  //跳转到肢体障碍档案详情
  turnToLimeDetails(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.router.navigate(
      [
        "limeDetails",
        {
          id: data.id,
          isAssessment2: data.isAssessment2,
          data: JSON.stringify(data)
        }
      ],
      {
        relativeTo: this.route
      }
    );
  }

  // 删除
  delete(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.modalService.confirm({
      nzTitle: `确定是否删除？`,
      nzOnOk: () => {
        this.httpReq.get("children/delete", { id: id }, (data: any) => {
          if (data["code"] == 0) {
            this.message.success("删除成功！");
            this.updateList();
          }
        });
      }
    });
  }
}
