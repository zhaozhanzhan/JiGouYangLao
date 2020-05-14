import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";

@Component({
  selector: "app-doctor-record",
  templateUrl: "./doctor-record.component.html",
  styleUrls: ["./doctor-record.component.css"]
})
export class DoctorRecordComponent implements OnInit {
  baseUrl;
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    phone: "",
    sectionOfficeStr: "",
    status: "0",
    btime: "",
    etime: "",
    personType: "2"
  };
  isTableLoading = true;
  selectedDate = [];

  // 分配科室
  officeModel = false;
  officeModelData: any;
  allOffice = [];
  selOffice = [];
  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    this.baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.btime));
        this.selectedDate.push(new Date(this.reqObj.etime));
      }
    }

    this.updateList();
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    const that = this;
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    const baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    const url = baseUrl + "/doctorNew/list";
    fetch(url, { method: "post", body: JSON.stringify(that.reqObj) })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        that.isTableLoading = false;
        if (res.code == 0) {
          this.list = res.data.list;
          this.page.total = res["data"]["totalElements"];
        } else {
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  turnToAdd() {
    this.router.navigate(["add"], { relativeTo: this.route });
  }

  turnToEdit(employee, e) {
    if (e) {
      e.preventDefault();
    }

    this.router.navigate(["add", { data: JSON.stringify(employee) }], {
      relativeTo: this.route
    });
  }

  // 分配科室弹框
  showOfficeModel(data) {
    this.officeModelData = data;
    const url = this.baseUrl + "section_office/listAllNoMedRoom";
    fetch(url, { method: "post", body: null })
      .then(res => {
        return res.text();
      })
      .then(res => {
        return JSON.parse(res);
      })
      .then(res => {
        if (res.code == 0) {
          this.allOffice = res.data;
        } else {
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.officeModel = true;
  }
  officeModelCancel() {
    this.officeModel = false;
  }
  officeModelOk() {
    const sendData = {
      id: this.officeModelData.id,
      sectionOfficeId: this.selOffice
    };
    this.httpReq.post(
      "doctorNew/sectionOfficeAllocation",
      null,
      sendData,
      data => {
        if (data["status"] == 200) {
          this.message.info(data.message);
          this.updateList();
        }
      }
    );
    this.officeModel = false;
  }

  deLinkGroup(id) {
    this.modalService.confirm({
      nzTitle: "请确认是否从该班组移除？",
      nzContent: "",
      nzOkText: "确定",
      nzOkType: "danger",
      nzOnOk: () => {
        this.httpReq.post(
          "doctorNew/sectionOfficeRemove",
          null,
          { id: id },
          data => {
            this.isTableLoading = false;
            if (data["status"] == 200) {
              this.message.info(data.message);
              this.updateList();
            }
          }
        );
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }

  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]);
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]);
    } else {
      this.reqObj.btime = "";
      this.reqObj.etime = "";
    }
  }
}
