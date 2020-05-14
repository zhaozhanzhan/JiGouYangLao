import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { getBuildingService } from "../getBuilding.service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import * as differenceInDays from 'date-fns/difference_in_days';
import { Utils } from "src/app/common/utils/utils";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  oldid; // 带过来的老人id
  isTableLoading = false; //加载得等待
  list = []; //列表
  public buildArr = []; // 建筑列表
  public floorArr = []; // 楼层列表
  public roomArr = []; // 房间列表
  reqObj = {
    buildingId: "",//建筑Id
    cardno: "",//老人身份证号
    floorId: "",//楼层
    month: "",//月份
    name: "",//老人姓名
    page: 0,
    roomId: "",//房间Id
    size: 20,
    status: 1//结算状态[1:未结算][2:已结算][3:已拖欠]
  };
  total: 0; //总条数
  choosedMonth;
  disabledDate = (current: Date): boolean => {
    return differenceInDays(current, new Date()) > 0;
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private entrSer: getBuildingService // 获层建筑、楼层、房间
  ) { }

  ngOnInit() {
    this.oldid = this.route.snapshot.paramMap.get('id');
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.choosedMonth = new Date(this.reqObj.month);
    } else {
      this.choosedMonth = new Date();
    }

    // 获取建筑、楼层、房间 备选
    this.serBuild(); // 获取建筑列表
    this.updateList(); // 查询列表数据

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
    if (this.choosedMonth instanceof Date) {
      this.reqObj.month = Utils.dateFormat(this.choosedMonth, "yyyy-MM");
    }
    console.error(this.reqObj);

    const that = this;
    that.list = [];
    this.isTableLoading = true;
    this.httpReq.post("monthlySettlement/listPage", null, that.reqObj, data => {
      sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
      this.isTableLoading = false;
      if (data.code == "0") {
        that.reqObj.page++;
        that.total = data["data"]["totalElements"];
        that.list = data["data"]["result"];
      } else {
        that.message.error(data["message"]);
      }
    });
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

  goto(routeName: string, id) {
    if (id) this.router.navigate([routeName, { id: id, month: Utils.dateFormat(this.choosedMonth, "yyyy-MM") }], { relativeTo: this.route.parent });
    else console.error("can't find id in params!");
  }

}
