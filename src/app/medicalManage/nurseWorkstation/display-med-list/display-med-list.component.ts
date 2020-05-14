import { Component, OnInit } from "@angular/core";
import { GetRelativeInfoService } from "../../../hospitalPharmacy/pharmacy-management/get-relative-info.service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-display-med-list",
  templateUrl: "./display-med-list.component.html",
  styleUrls: ["./display-med-list.component.css"]
})
export class DisplayMedListComponent implements OnInit {
  sendData = {
    /**
     * \"patient\":\"病人（老人姓名，住院号模糊检索）\",
     * \"sectionOfficeId\":\"科室选择（Id）\",
     * \"attendingDoc\":\"主治医生姓名\",
     * " +"\"type\":\"医嘱类型（0:长期,1:短期）\",
     * \"putMedicationType\":\"发药状态（0:未发,1:已发）\"
     */
    patient: "",
    sectionOfficeId: "",
    sickWardId: "",
    medRoomId: "",
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
    private message: NzMessageService,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    document.getElementsByClassName("ant-tabs-bar")[0]["style"]["display"] =
      "none"; // 注释掉调试打印页
    if (sessionStorage.getItem(this.router.url)) {
      // console.log(JSON.parse(sessionStorage.getItem(this.router.url)));
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
    if (!this.sendData.medRoomId) {
      that.timer = setTimeout(function() {
        return that.list();
      }, 100);
      return;
    }
    that.getList();
  }

  // 获取医嘱列表
  getList(reset: boolean = false): void {
    if (reset) {
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
            item["checked"] = false; // 用于判断是否选中
            item["sortNum"] = index; // 用于打印排序
            item["underLine"] = true; // 用于打印样式
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
        this.westernMedicineOrdersIds.every(item => {
          return item.westernMedicineOrdersId !== data.westernMedicineOrdersId;
        })
      )
        this.westernMedicineOrdersIds.push(data);
    } else {
      let delete_index;
      if (
        this.westernMedicineOrdersIds.some((item, index) => {
          if (item.westernMedicineOrdersId == data.westernMedicineOrdersId)
            delete_index = index;
          return item.westernMedicineOrdersId == data.westernMedicineOrdersId;
        })
      )
        this.westernMedicineOrdersIds.splice(delete_index, 1);
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

    // 遮罩
    let printModelWidth = document.getElementById("printModel");
    if (this.westernMedicineOrdersIds.length > 0)
      printModelWidth.style.width = "0";
    else printModelWidth.style.width = "90px";
    // 排序
    if (this.westernMedicineOrdersIds.length == 1) {
      this.westernMedicineOrdersIds[0].underLine = true;
    } else if (this.westernMedicineOrdersIds.length > 1) {
      let sortF = function(a, b) {
        return a.sortNum - b.sortNum;
      };
      this.westernMedicineOrdersIds.sort(sortF);
      this.westernMedicineOrdersIds.forEach((item, index, arr) => {
        item["underLine"] = true;
        let arrlength = arr.length,
          nextIndex = index + 1;
        if (nextIndex < arrlength) {
          if (item.admissionNo == arr[nextIndex].admissionNo)
            item["underLine"] = false;
        }
      });
    }
    console.log(this.westernMedicineOrdersIds);
  }

  // 页码变更
  PageIndexChange(PageIndexNum) {
    console.log()
    this.sendData.page = PageIndexNum - 1;
    this.getList();
  }

  // 每页条数变更
  PageSizeChange(PageSize) {
    this.sendData.size = PageSize;
    this.getList();
  }

  //
  noSelnoPrint(e) {
    e.stopPropagation();
    this.message.error("当前无选中条目！");
  }

  // 是否全选
  checkBoxAllChange() {
    this.allChecked = !this.allChecked;
    console.log(this.allChecked);
    this.isPartSel = false;
    if (this.allChecked) {
      this.listOfData.forEach(item => {
        item["checked"] = false;
        this.checkBoxChange(item);
      });
      console.log(this.westernMedicineOrdersIds);
    } else {
      this.listOfData.forEach(item => {
        item["checked"] = false;
      });
      this.westernMedicineOrdersIds = [];
    }
    // 遮罩
    console.log(this.westernMedicineOrdersIds);
    let printModelWidth = document.getElementById("printModel");
    if (this.westernMedicineOrdersIds.length > 0)
      printModelWidth.style.width = "0";
    else printModelWidth.style.width = "90px";
  }
}
