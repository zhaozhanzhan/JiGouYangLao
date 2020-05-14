/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-10 17:18:45
 * @Description:
 */
import { Component, OnInit } from "@angular/core";
import { GetRelativeInfoService } from "../get-relative-info.service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { BehaviorSubject, Observable } from "rxjs";
import { debounceTime, map, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { ServeConfigService } from "../../../common/config/serve-config.service";
import { copyFileSync } from "fs";
@Component({
  selector: "app-in-hospitol-return-medicine",
  templateUrl: "./in-hospitol-return-medicine.component.html",
  styleUrls: ["./in-hospitol-return-medicine.component.css"]
})
export class InHospitolReturnMedicineComponent implements OnInit {
  /**
   {"page": "页码",
   "size": "每页数量",
   "patient":"病人（老人姓名，住院号模糊检索）",
   "sectionOfficeId":"科室选择（Id）",
   "attendingDoc":"主治医生姓名",
   "sickWardId":"病区id"}
  */
  sendData = {
    page: 0,
    size: 100,
    patient: "",
    sectionOfficeId: "",
    medRoomId: "",
    attendingDoc: "",
    sickWardId: ""
  };
  reMedInfo = {
    // 弹框表单
    orderType: "0", // 医嘱类型
    admissionNo: "", // 住院号
    name: "", // 姓名
    bedNum: "", // 床号
    mainDoc: "", // 主治医生
    date: "", // 日期
    medName: "", // 药品名
    num: "", // 退药数量
    type: "", // 规格单位
    backRemark: "", // 备注
    adviceId: ""//医嘱Id
  };
  Loading = false; //
  listOfData = []; // 退药列表
  totalElements; // 总条数
  officeList; // 科室列表
  sickWardList; // 病区列表
  medRoomList; // 药房列表
  returnMedicineModel = false;
  selMedicine; // 根据住院号查询返回药品列表
  timer;
  timerTime = 0;
  listTimer;
  nzOkLoading = false;

  searchChange$ = new BehaviorSubject("");

  //医嘱列表
  adviceList = [];
  //检索到的患者列表
  patientList = [];
  isLoading = false;
  searchBedNum;

  constructor(
    public getInfo: GetRelativeInfoService,
    private message: NzMessageService,
    private router: Router,
    public httpReq: HttpReqService,
    private http: HttpClient,
    private serveConfigService: ServeConfigService
  ) { }
  ngOnInit() {
    if (sessionStorage.getItem(this.router.url)) {
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      this.sendData.page = 0;
    }
    // this.getInfo.getOfficeList((data)=>{this.officeList = data.data instanceof Array ? data.data:[{name:'暂无科室',id:''}];this.sendData.sectionOfficeId = this.officeList[0].id});
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
      that.timer = setTimeout(function () {
        return that.list();
      }, 200);
      return;
    }
    that.getList();
  }
  /**
   * 显示退药对话框
   * @param type "长期医嘱：0，临时医嘱：1"
   */
  showReturnMedicineModel(type) {
    this.reMedInfo.adviceId = "";
    this.reMedInfo.admissionNo = "";
    this.reMedInfo.name = "";
    this.reMedInfo.bedNum = "";
    this.reMedInfo.mainDoc = "";
    this.reMedInfo.date = "";
    this.reMedInfo.medName = "";
    this.reMedInfo.num = "";
    this.reMedInfo.type = "";
    this.reMedInfo.backRemark = "";
    this.patientList = [];

    this.returnMedicineModel = true;
    this.reMedInfo.orderType = type;
  }
  //
  returnMedicineModelCancel() {
    this.returnMedicineModel = false;
  }
  //
  returnMedicineModelOk() {
    /**
     * {"id": "西药医嘱id",
     * "num": "退药数量（大于0的整数）",
     * "backRemark": "退药备注",
     * "userName":"操作员"}
     */
    if (this.reMedInfo.medName == "") {
      this.message.error("选择对应医嘱进行退药操作！");
      return;
    }
    this.nzOkLoading = true;
    this.loadding();
    let data = {
      id: this.reMedInfo.medName,
      num: this.reMedInfo.num,
      type: this.reMedInfo.orderType,
      backRemark: this.reMedInfo.backRemark,
      userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
    };
    this.httpReq.post("putBackMedRecord/save", null, data, data => {
      if (data.code == 0) {
        this.message.success("退药成功！");
        this.getList();
        this.returnMedicineModel = false;
      }
      this.nzOkLoading = false;
      this.debounce(this.unloading, 500)();
    });
  }
  // 日期选择回调
  onDateChange(result: Date): void {
  }

  // 获取退药列表
  getList(reset: boolean = false): void {
    if (reset) {
      this.sendData.page = 0;
    }

    if (this.sendData.page < 0) {
      this.sendData.page = 0;
    }
    this.Loading = true;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
    this.httpReq.post(
      "putBackMedRecord/getMedBackList",
      null,
      this.sendData,
      data => {
        this.Loading = false;
        if (data.code == 0) {
          this.listOfData = data.data.content;
          this.totalElements = data.data.totalElements;
        }
      }
    );
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

  // 插入loading
  loadding() {
    let returnMedicineModel = document.getElementsByClassName(
      "ant-modal-content"
    )[0];
    let model = document.createElement("div");
    model.id = "loadModel";
    model.innerHTML = `
      <div style="position:absolute;left:0;top:0;width:100%;height:100%;background:#b0bec5;opacity:0.5;">
        <div class="loader"></div>
      </div>
    `;
    returnMedicineModel.appendChild(model);
  }
  // 移除loading
  unloading() {
    let returnMedicineModel = document.getElementsByClassName(
      "ant-modal-content"
    )[0];
    let model = document.getElementById("loadModel");
    if (model instanceof HTMLElement) returnMedicineModel.removeChild(model);
  }

  // 根据住院号查找
  searchPatientInfo(value) {
    console.log('tag', value);
    this.isLoading = true;
    this.patientList = [];
    this.httpReq.post(
      "putBackMedRecord/getWestMedList",
      null,
      {
        condition: value,
        type: this.reMedInfo.orderType
      },
      data => {
        this.isLoading = false;
        if (data.code == 0) {
          this.patientList = data.data;
        }
      }
    );
  }

  // 选择药品变更
  changeMed() {
    this.selMedicine.forEach(item => {
      if (item.id === this.reMedInfo.medName) {
        this.reMedInfo.medName = item.id;
        this.reMedInfo.date = item.sendMedDate;
        this.reMedInfo.type = item.medUnit;
      }
    });
  }


  // 防抖
  debounce(func, wait) {
    let that = this;
    return function () {
      clearTimeout(that.timer);
      that.timer = setTimeout(function () {
        func.apply(that);
      }, wait);
    };
  }
  /**
   * 根据输入内容检索老人的姓名或住院号
   * @param value 选择的值
   * @param type 值所对应的属性是住院号还是姓名
   */
  onChoosePatientInfo(value) {
    this.selMedicine = [];

    this.reMedInfo.bedNum = "";
    this.reMedInfo.mainDoc = "";
    this.reMedInfo.date = "";
    this.reMedInfo.medName = "";
    this.reMedInfo.type = "";
    this.reMedInfo.name = "";
    this.reMedInfo.admissionNo = "";
    this.patientList.forEach(item => {
      if (value == item.basicId) {
        this.adviceList = item.tempOrdersList;
        this.reMedInfo.bedNum = item.bedNum;
        this.reMedInfo.mainDoc = item.attendingDoc;
        this.reMedInfo.name = item.tempOrdersId;
        this.reMedInfo.admissionNo == item.tempOrdersId;

      }
    });
  }

  //根据当前老人选择对应医嘱
  onChooseAdviceInfo() {
    this.adviceList.forEach(item => {
      if (this.reMedInfo.adviceId == item.tempOrdersId) {
        if (item.list.length) {
          this.selMedicine = item.list;
          this.reMedInfo.medName = item.list[0].id;
          this.reMedInfo.date = item.list[0].sendMedDate;
          this.reMedInfo.type = item.list[0].medUnit;
        }
      }
    });
  }
}
