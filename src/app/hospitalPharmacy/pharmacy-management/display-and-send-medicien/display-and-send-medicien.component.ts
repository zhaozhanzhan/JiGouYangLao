import { Component, OnInit } from "@angular/core";
import { GetRelativeInfoService } from "../get-relative-info.service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { pureFunctionV } from "@angular/core/src/render3/pure_function";
@Component({
  selector: "app-display-and-send-medicien",
  templateUrl: "./display-and-send-medicien.component.html",
  styleUrls: ["./display-and-send-medicien.component.css"]
})
export class DisplayAndSendMedicienComponent implements OnInit {
  sendData = {
    /**
     * \"patient\":\"病人（老人姓名，住院号模糊检索）\",
     * \"sectionOfficeId\":\"科室选择（Id）\",
     * \"attendingDoc\":\"主治医生姓名\",
     * " +"\"type\":\"医嘱类型（0:长期,1:短期）\",
     * \"putMedicationType\":\"发药状态（0:未发,1:已发）\"
     */
    patient: "",
    medRoomId: "",
    sectionOfficeId: "",
    sickWardId: "",
    attendingDoc: "",
    type: "0",
    putMedicationType: "0",
    page: 0,
    size: 100
  };
  totalElements; // 总条数
  listOfData = []; // 列表数据
  isLoading = false; //
  officeList; // 科室列表
  sickWardList; // 病区列表
  medRoomList; // 药房列表
  westernMedicineOrdersIds = []; // 选中发药数组
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
  ngOnInit(): void {
    var that = this;
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
      this.sendData.page = 0;
    }
    // this.sendData.page = this.sendData.page - 1;
    // this.sendData.size = this.sendData.size;
    if (this.sendData.page < 0) {
      this.sendData.page = 0;
    }

    this.isLoading = true;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
    this.httpReq.post(
      "putMedicationRecord/getWesternMedicineOrderList",
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
      if (
        this.westernMedicineOrdersIds.indexOf(data.westernMedicineOrdersId) ==
        -1
      )
        this.westernMedicineOrdersIds.push(data.westernMedicineOrdersId);
    } else {
      let index = this.westernMedicineOrdersIds.indexOf(
        data.westernMedicineOrdersId
      );
      if (index !== -1) this.westernMedicineOrdersIds.splice(index, 1);
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
    /**
     * {"ids":"选择发药的id(英文逗号隔开)",
     * "userName":"操作员",
     * medRoomId: 药房
     * "type":"医嘱类型（0:长期,1:临时）",
     * "putMedicationType":"发药状态（0:未发,1:已发）"}
     */
    let Data = {
      ids: this.westernMedicineOrdersIds.join(","),
      userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
      medRoomId: this.sendData.medRoomId,
      type: this.sendData.type,
      putMedicationType: this.sendData.putMedicationType
    };
    if (!Data.ids) {
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
          "putMedicationRecord/putMedicine",
          null,
          Data,
          data => {
            if (data.code == 0) {
              this.westernMedicineOrdersIds = [];
              this.allChecked = false;
              this.isPartSel = false;
              this.message.success("发药成功！");
              this.getList();
            } else {
              // this.message.error(data.data.message);
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
    } else {
      this.listOfData.forEach(item => {
        item["checked"] = false;
      });
      this.westernMedicineOrdersIds = [];
    }
  }
}
