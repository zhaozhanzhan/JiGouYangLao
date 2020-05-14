import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "src/app/common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Session } from "src/app/common/service/Storage";
import { EntrustMedicineService } from "../entrust-medicine.service";
import * as _ from "underscore";
@Component({
  selector: "app-wardMage",
  templateUrl: "./wardMage.component.html",
  styleUrls: ["./wardMage.component.css"]
})
export class WardMageComponent implements OnInit {
  isLoading = false; //加载得等待
  list = []; //病人得卡片列表
  public buildArr = []; // 建筑列表
  public floorArr = []; // 楼层列表
  public roomArr = []; // 房间列表
  public careLevelCaseList = []; //护理等级列表
  page = {
    size: 12,
    index: 1
  };

  reqObj = {
    page: 0, //"页码",
    size: 12, //"每页数量",
    name: "", //"姓名",
    buildId: "", //建筑Id
    floorId: "", //楼层ID
    roomId: "", //房间Id
    sickWardId: "", //"病区",
    status: "", //状态（全部/正常/外出就诊）,
    cultureType: "", //修养类型（全部/政府供养/社会寄养）,
    careLevelId: "", //护理等级（全部/介助/介护/自理）
    medicalType: "" //医疗类型（全部/城镇职工基本医疗保险/城镇居民基本医疗保险/新型农村合作医疗/贫困救助/商业医疗保险/全公费/全自费/其他）
  };
  total: 0; //总条数
  user; //用户的详情信息
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private modalService: NzModalService, //提示
    private entrSer: EntrustMedicineService // 获层建筑、楼层、房间
  ) {}

  ngOnInit() {
    const sessinData = Session.getObj(this.router.url);
    if (_.isObject(sessinData) && !_.isEmpty(sessinData)) {
      this.reqObj = sessinData;
    }

    // 获取建筑、楼层、房间 备选
    this.serBuild(); // 获取建筑列表
    this.updateList(); // 查询列表数据
    this.getCareLevelCaseList(); //获得所有的护理等级
  }

  // 列表
  updateList(reset: boolean = false): void {
    if (reset) {
      this.reqObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.reqObj.page = this.reqObj.page - 1;
      if (this.reqObj.page < 0) {
        this.reqObj.page = 0;
      }
    }

    const that = this;
    that.list = [];
    this.isLoading = true;
    this.httpReq.post("clinicPatient/listPage", null, that.reqObj, data => {
      sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
      this.isLoading = false;
      if (data.code == "0") {
        that.reqObj.page++;
        that.total = data["data"]["totalElements"];
        that.list = data["data"]["patientList"];
      } else {
        that.message.error(data["message"]);
      }
    });
  }

  // 选择分页时调用
  onPageIndexChange(curIndex: Number) {
    this.updateList();
  }

  /**
   * 查询建筑列表
   * @memberof ListComponent
   */
  public serBuild() {
    this.entrSer.getBuild((data: any) => {
      if (data.code == 0) {
        this.buildArr = data["data"]; // 获取建筑列表
      }
    });
  }

  /**
   * 改变建筑查询楼层列表
   * @param {string} [buildId=""] // 设置默认值为空
   * @memberof ListComponent
   */
  public changeBuild(buildId: string = "") {
    this.reqObj.floorId = ""; // 重置楼层
    this.reqObj.roomId = ""; // 重置房间
    this.floorArr = []; // 重置楼层列表
    this.roomArr = []; // 重置房间列表
    if (buildId) {
      // 如果有ID,查询楼层列表
      this.serFloor(buildId);
    } else {
      this.serFloor();
    }
  }

  /**
   * 查询楼层列表
   * @param {string} [buildId=""] 建筑ID
   * @memberof ListComponent
   */
  public serFloor(buildId: string = "") {
    if (buildId) {
      // 如果有建筑ID,查询楼层列表
      this.entrSer.getFloor(buildId, (data: any) => {
        this.floorArr = data["data"];
      });
    } else {
      this.reqObj.floorId = ""; // 重置楼层
      this.reqObj.roomId = ""; // 重置房间
      this.floorArr = []; // 重置楼层列表
      this.roomArr = []; // 重置房间列表
    }
    this.updateList(true); // 查询列表数据
  }

  /**
   * 改变楼层查询房间列表
   * @param {string} [id=""] // 设置默认值为空
   * @memberof ListComponent
   */
  public changeFloor(floorId: string = "") {
    this.reqObj.roomId = ""; // 重置房间
    this.roomArr = []; // 重置房间列表
    if (floorId) {
      // 如果有楼层ID,查询房间列表
      this.serRoom(floorId);
    } else {
      this.serRoom();
    }
  }

  /**
   * 查询房间列表
   * @param {string} [floorId=""] 楼层ID
   * @memberof ListComponent
   */
  public serRoom(floorId: string = "") {
    if (floorId) {
      // 如果有楼层ID,查询房间列表
      this.entrSer.getRoom(floorId, (data: any) => {
        this.roomArr = data["data"];
      });
    } else {
      this.reqObj.roomId = ""; // 重置房间
      this.roomArr = []; // 重置房间列表
    }
    this.updateList(true); // 查询列表数据
  }

  // 跳转到病人档案病区管理，
  //  data传递得具体数据
  toPatient(data) {
    this.router.navigate([
      "nursingHome/medicalManage/outpatienManage/patientDetails",
      { data: JSON.stringify(data) }
    ]);
  }

  // 跳转到长期医嘱打印，
  //  data传递得具体数据
  toLongTerm(data) {
    this.router.navigate([
      "nursingHome/medicalManage/outpatienManage/longTerm",
      { data: JSON.stringify(data) }
    ]);
  }
  // 获得护理等级数据
  getCareLevelCaseList() {
    this.httpReq.get("careLevelCase/allList", null, data => {
      if (data.code == "0") {
        this.careLevelCaseList = data["data"];
      } else {
        this.message.error(data["message"]);
      }
    });
  }
}
