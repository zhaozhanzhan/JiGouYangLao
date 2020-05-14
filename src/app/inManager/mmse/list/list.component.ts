import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
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
    name: name,
    btime: "",
    etime: ""
  };
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
      if (
        !Utils.isEmpty(this.queryParams.btime) &&
        !Utils.isEmpty(this.queryParams.etime)
      ) {
        this.selectedDate.push(new Date(this.queryParams.btime));
        this.selectedDate.push(new Date(this.queryParams.etime));
      }
    }
    this.loadingDataArray();
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
    this.httpReq.post("mmse/list", null, this.queryParams, data => {
      this.queryParams.page++;
      sessionStorage.setItem(this.router.url, JSON.stringify(this.queryParams));

      that.isTableLoading = false;
      if (data["status"] == 200) {
        this.dataArray = data["data"]["content"]; // 数据列表
        this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
      }
    });
  }
  //删除
  // del(info, e?: MouseEvent) {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   let that = this;
  //   this.modalService.confirm({
  //     nzTitle: "请确认是否删除？",
  //     // nzContent:
  //     //   '<b style="color: red;">评估记录删除后无法恢复，请谨慎操作！</b>',
  //     nzOkText: "确认",
  //     nzOkType: "danger",
  //     nzOnOk: () => {
  //       let param = {
  //         id: info.id
  //       };
  //       that.isTableLoading = true;
  //       that.httpReq.post("mmse/del", null, param, data => {
  //         that.isTableLoading = false;
  //         if (data["status"] == 200) {
  //           that.loadingDataArray();
  //         }
  //       });
  //     },
  //     nzCancelText: "取消",
  //     nzOnCancel: () => {}
  //   });
  // }
  showDeleteConfirm(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.clickDelBtn(id);
  }
  /**
   * 单击删除按钮
   * @param {any} id 要删除的数据对象ID
   */
  public clickDelBtn(id: any): void {
    this.globalService.delModal(() => {
      this.deleteData(id);
    });
  }
  deleteData(id) {
    let that = this;
    let param = {
      id: id
    };
    that.isTableLoading = true;
    that.httpReq.post("mmse/del", null, param, data => {
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.message.success("删除成功");
        that.loadingDataArray();
      }
    });
  }
  //跳转详情页面
  showInfo(info, e?: MouseEvent) {
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
  }

  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.queryParams.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.queryParams.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.queryParams.btime = "";
      this.queryParams.etime = "";
    }
  }
}
