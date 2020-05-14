import { Component, OnInit, ViewChild } from "@angular/core";
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
  previewVisible = true;
  appayType = "全部";
  date = "";
  fileList = [
    {
      uid: -1,
      name: "xxx.png",
      status: "done",
      url:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    }
  ];
  queryParams = {
    page: 0,
    size: 10,
    state: ""
  };
  fireHydrant = [
    //消防栓
    { label: "水喉", value: "水喉", checked: true },
    { label: "水带", value: "水带", checked: true },
    { label: "枪头", value: "枪头", checked: true },
    { label: "消防锤", value: "消防锤", checked: true },
    { label: "报警器", value: "报警器", checked: true },
    { label: "消防箱", value: "消防箱", checked: true },
    { label: "消防井钧", value: "消防井钧", checked: true },
    { label: "扳手", value: "扳手", checked: true }
  ];
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };
  selectedDate = [];

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
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.loadingDataArray();
  }
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  safePhotoId = {
    id: ""
  };
  Detail = {
    CreatDate: "", //创建时间
    jiluren: "", //记录人
    results: "", //处理结果
    chuliren: "", //处理人
    memo: "", //详情
    photourl: "" //图片
  };
  DetailEdit = {
    id: "",
    state: "",
    jiluren: "", //记录人
    results: "", //处理结果
    chuliren: "", //处理人
    memo: "", //详情
    url: "" //图片
  };

  SatetyAnapType = "";
  id = {
    id: "",
    type: ""
  };
  // 点击查看显示模态框
  showFirePatrol(id, type, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.id.id = id;
    this.id.type = type;
    if (id == null) {
      this.router.navigate(["info", "{}"], {
        relativeTo: this.route
      });
    } else {
      this.router.navigate(["info", JSON.stringify(this.id)], {
        relativeTo: this.route
      });
    }
  }

  turnToEdit(inApply) {
    this.router.navigate(["info", JSON.stringify(inApply)], {
      relativeTo: this.route
    });
  }

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
      "safePhoto/pagelist",
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
          if (data.code == "0") {
            this.dataArray = data["data"]["content"]; // 数据列表
            this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
          }
        }
      }
    );
  }
}
