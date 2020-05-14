import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";

@Component({
  selector: "app-pharmact-config",
  templateUrl: "./pharmact-config.component.html",
  styleUrls: ["./pharmact-config.component.css"]
})
export class PharmactConfigComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: ""
  };
  // 绑定科室
  officeModel = false;
  officeModelData: any;
  allOffice = [];
  selOffice = "";

  isTableLoading = true;

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
    }

    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
      this.page.size = 10;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    if (this.reqObj.page < 0) {
      this.reqObj.page = 0;
    }
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post("med_room/listPage", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        const result = data["data"];
        this.list = result["content"]; // 数据列表
        this.page.total = result["numberOfElements"]; // 总条数
      }
    });
  }

  turnToAdd() {
    this.router.navigate(["add"], { relativeTo: this.route.parent });
  }

  turnToEdit(employeeGroup) {
    this.router.navigate(
      ["add", { employeeGroup: JSON.stringify(employeeGroup) }],
      { relativeTo: this.route.parent }
    );
  }

  // 绑定科室弹框
  showOfficeModel(data) {
    this.officeModelData = data;
    this.httpReq.post("section_office/listAllNoMedRoom", null, {}, data => {
      if (data["status"] == 200) {
        this.allOffice = data["data"];
        // if (this.officeModelData.sectionOfficeIdStr) {
        //     this.selOffice = this.officeModelData.sectionOfficeIdStr.split(",");
        // }
      }
    });
    this.officeModel = true;
  }
  officeModelCancel() {
    this.officeModel = false;
  }
  officeModelOk() {
    /**
     * {"id":"药房id","sectionOfficeId":"绑定科室Id","accountId":"账户Id"}
     */
    const sendData = {
      id: this.officeModelData.id,
      accountId: JSON.parse(localStorage.UserInfo).data.id,
      sectionOfficeId: this.selOffice
    };
    this.httpReq.post("med_room/bindSo", null, sendData, data => {
      if (data["code"] == 0) {
        this.msg.success("绑定科室成功");
        this.updateList();
      }
    });
    this.officeModel = false;
  }

  unbinding(id) {
    // {"id":"药房id","accountId":"账户Id"}
    const sendData = {
      id: id,
      accountId: JSON.parse(localStorage.UserInfo).data.id
    };
    this.modalService.confirm({
      nzTitle: "<b>确定要解除绑定吗?</b>",
      nzOnOk: () => {
        this.httpReq.post("med_room/relieveSo", null, sendData, data => {
          if (data["code"] == 0) {
            this.updateList();
            this.msg.success("解除绑定成功");
          }
        });
      }
    });
  }
}
