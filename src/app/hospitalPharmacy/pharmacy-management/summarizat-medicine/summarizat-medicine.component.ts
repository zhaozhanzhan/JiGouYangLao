import { Component, OnInit } from "@angular/core";
import { GetRelativeInfoService } from "../get-relative-info.service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-summarizat-medicine",
  templateUrl: "./summarizat-medicine.component.html",
  styleUrls: ["./summarizat-medicine.component.css"]
})
export class SummarizatMedicineComponent implements OnInit {
  sendData = {
    /**
     {"page": "页码",
     "size": "每页数量",
     "sectionOfficeId":"科室Id",
     "sickWardId":"病区Id",
     "attendingDoc":"主治医生姓名",
     "type":"医嘱类型（0:长期,1:临时）",
     "dosageForm":"剂型"}
     */
    page: 0,
    size: 100,
    sectionOfficeId: "",
    medRoomId: "",
    sickWardId: "",
    attendingDoc: "",
    type: "0",
    dosageForm: ""
  };
  totalElements; // 总条数
  isLoading = false; //
  listOfData = []; // 列表数据
  officeList; // 科室列表
  sickWardList; // 病区列表
  medRoomList; // 药房列表
  westernMedicineOrdersIds = []; // 选中发药数组
  groupInfo = []; // 返给后台的数据
  timer;
  timerTime = 0;
  allChecked = false; // 是否全选
  isPartSel = false; // 是否半选中
  printCSS = ["assets/css/common.css", "assets/css/first-care-print.css"];
  constructor(
    public getInfo: GetRelativeInfoService,
    public httpReq: HttpReqService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit() {
    document.getElementsByClassName("ant-tabs-bar")[0]["style"]["display"] =
      "none";
    if (sessionStorage.getItem(this.router.url)) {
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      this.sendData.page = 0;
    }
    this.getInfo.getOfficeList(data => {
      this.officeList =
        data.data instanceof Array ? data.data : [{ name: "暂无科室", id: "" }];
      if (!this.sendData.sectionOfficeId) {
        this.sendData.sectionOfficeId = this.officeList[0].id;
      }
      this.findSickward();
    });
    // this.getInfo.getsickWardList((data)=>{this.sickWardList = data.data instanceof Array ? data.data:[{sickWardName:'暂无病区',id:''}]; if(!this.sendData.sickWardId) this.sendData.sickWardId = this.sickWardList[0].id});
    this.getInfo.getMedRoomList(data => {
      this.medRoomList =
        data.data instanceof Array
          ? data.data
          : [{ medRoomName: "暂无药房", id: "" }];
      if (!this.sendData.medRoomId)
        this.sendData.medRoomId = this.medRoomList[0].id;
    });
    this.list();
  }

  // 根据所选科室获取对应病区
  findSickward() {
    this.getInfo.getOfficeListForSickWard(
      this.sendData.sectionOfficeId,
      data => {
        this.sickWardList =
          data.data instanceof Array
            ? data.data
            : [{ sickWardName: "暂无病区", id: "" }];
        this.sendData.sickWardId = this.sickWardList[0].id;
      }
    );
  }

  // 防止请求异步导致列表请求参数不完整
  list() {
    let that = this;
    clearTimeout(that.timer);
    if (that.timerTime++ > 9) {
      that.message.error("列表请求参数获取失败！");
      return;
    }
    if (
      !(
        this.sendData.sectionOfficeId &&
        this.sendData.sickWardId &&
        this.sendData.medRoomId
      )
    ) {
      that.timer = setTimeout(function() {
        return that.list();
      }, 200);
      return;
    }
    that.getList();
  }

  // 获取医嘱列表
  getList(reset: boolean = false): void {
    if (reset) {
      this.sendData.page = 1;
    }
    // this.sendData.page = this.sendData.page - 1;
    // this.sendData.size = this.sendData.size;
    if (this.sendData.page < 0) {
      this.sendData.page = 0;
    }
    this.isLoading = true;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
    this.httpReq.post(
      "putGroupMedRecord/getGroupWesternMedicineOrderList",
      null,
      this.sendData,
      data => {
        this.isLoading = false;
        if (data.code == 0) {
          this.listOfData = data.data.list;
          this.totalElements = data.data.totalElements;
          this.listOfData.forEach((item, index, arr) => {
            item["checked"] = false;
            item["underLine"] = true;
            let arrlength = arr.length,
              nextIndex = index + 1;
            if (nextIndex < arrlength) {
              if (item.name == arr[nextIndex].name) {
                item["underLine"] = false;
              }
            }
          });
        }
      }
    );
  }

  // 选中
  checkBoxChange(data) {
    data.checked = !data.checked;
    if (data.checked) {
      if (this.westernMedicineOrdersIds.indexOf(data.id) == -1) {
        this.westernMedicineOrdersIds.push(data.id);
        let item = {
          id: data.id,
          allCount: data.count,
          wmoIds: data.wmoIds,
          flag: data.flag
        };
        this.groupInfo.push(item);
      }
    } else {
      let index = this.westernMedicineOrdersIds.indexOf(data.id);
      if (index !== -1) {
        this.westernMedicineOrdersIds.splice(index, 1);
        this.groupInfo.splice(index, 1);
      }
    }
    // 全选
    if (this.westernMedicineOrdersIds.length == this.listOfData.length) {
      this.isPartSel = false;
      this.allChecked = true;
    } else {
      if (this.westernMedicineOrdersIds.length == 0) {
        this.isPartSel = false;
        this.allChecked = false;
      } else this.isPartSel = true;
    }

  }

  // 页码变更
  PageIndexChange(PageIndexNum) {
    this.sendData.page = PageIndexNum - 1;
    this.getList();
  }

  // 每页条数变更
  PageSizeChange(PageSize) {
    this.sendData.size = PageSize;
    this.getList();
  }

  // 发药
  givingMedicine() {
    let Data = {
      groupInfo: this.groupInfo,
      userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
      medRoomId: this.sendData.medRoomId,
      type: this.sendData.type
    };
    if (!Data.groupInfo.length) {
      this.message.error("无选中条目!");
      return;
    }
    this.modalService.confirm({
      nzTitle: "确认发药？",
      nzContent: "",
      nzOkText: "确定",
      nzOkType: "primary",
      nzOnOk: () => {
        this.httpReq.post(
          "putGroupMedRecord/putGroupMedicine",
          null,
          Data,
          data => {
            if (data.code == 0) {
              this.message.success("发药成功！");
              this.westernMedicineOrdersIds = [];
              this.groupInfo = [];
              this.allChecked = false;
              this.isPartSel = false;
              this.getList();
            } else {
              // this.message.error(data.message);
            }
          }
        );
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }

  // 是否全选
  checkBoxAllChange() {
    this.allChecked = !this.allChecked;
    this.isPartSel = false;
    if (this.allChecked) {
      this.listOfData.forEach(item => {
        item["checked"] = false;
        this.checkBoxChange(item);
      });
      console.log(this.westernMedicineOrdersIds);
    } else {
      this.listOfData.forEach(item => {
        item["checked"] = true;
        this.checkBoxChange(item);
      });
    }
  }
}
