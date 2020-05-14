import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { Utils } from "../../../common/utils/utils";
import { Local } from "../../../common/service/Storage";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  //选的的删除操作id、标识
  selectedDelId = "";
  selectedDelAction = "";

  //是否显示删除对话框
  isShowDelDialog = false;
  isDelBtnLoading = false;
  //消防设施配置项
  fireHydrant = [
    { label: "水喉", value: "水喉", checked: true },
    { label: "水带", value: "水带", checked: true },
    { label: "枪头", value: "枪头", checked: true },
    { label: "扳手", value: "扳手", checked: true },
    { label: "消防锤", value: "消防锤", checked: true },
    { label: "报警器", value: "报警器", checked: true },
    { label: "消防箱", value: "消防箱", checked: true },
    { label: "消防井钧", value: "消防井钧", checked: true }
  ];

  //是否显示巡查点编辑对话框
  isEditPointDialogShow = false;
  isSavePointLoading = false;

  //添加/编辑巡查点的参数
  savePointParams = {
    id: "", //消防点ID(修改接口)
    modifier: "", //修改人（修改接口）
    name: "", //巡查点名称
    hydrant: "", //消防栓
    linkedFireExtinguisherNum: 0, //灭火器数量
    otherFalicities: "", //其他消防设施
    otherFalicitiesArray: [{ item: "" }],
    hasHydrant: "", //是否有消防栓
    hasFireExtinguisher: "", //是否有灭火器
    hasOther: "", //是否有其他消防设施
    ffdArea_id: "", //绑定的区域id（新增接口）
    noteTaker: "", //记录人（新增接口）
    fireHydrant: this.fireHydrant
  };
  // 消防区域加载状态
  isAreaTableLoading = false;
  pointArray = [];
  resultPointData = {
    totalElements: 0
  };
  // 消防区域列表参数
  queryAreaParams = {
    page: 0,
    size: 10
  };
  //消防区域列表显示数据
  areaArray = [];
  resultAreaData = {
    totalElements: 0
  };

  //存储操作人
  firseName = "";

  // 消防区域巡查点加载状态
  isPointTableLoading = false;

  // 消防巡查点列表参数
  queryPointParams = {
    page: 0,
    size: 10,
    ffdArea_id: ""
  };
  //保存消防巡查区域的id
  selectedAreaId = "";
  selectedAreaName = "";

  //定义点击添加消防区域是否显示
  isEditAreaDialogShow = false;
  isAreaSaveLoading = false;
  //保存和编辑传参
  saveAreaParams = { id: "", modifier: "", name: "", noteTaker: "" };
  // 保存巡查周期的参数
  patrolCycleParam = {
    checkCycle: ""
  };
  // 巡查周期的显示框
  isPatrolCycleDialogShow = false;
  //编辑选择的巡查周期
  selectedPatrolCycle = "1";
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
    this.firseName = Local.getObj("UserInfo")["data"]["name"];
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryAreaParams = JSON.parse(
        sessionStorage.getItem(this.router.url)
      );
    }
    this.loadingAreaArray(true);

    this.loadingPatrolCycle();
  }

  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  //显示巡查周期
  showPatrolCycle(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.selectedPatrolCycle = this.patrolCycleParam.checkCycle;
    this.isPatrolCycleDialogShow = true;
  }
  //获取巡查周期设置
  loadingPatrolCycle() {
    let that = this;
    this.httpReq.post("ffdMemo/findCC", null, null, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          console.log("tag", data["data"]);
          that.patrolCycleParam.checkCycle = String(data["data"]["checkCycle"]);
        }
      }
    });
  }
  // 保存修改的巡查周期
  patrolCycleOk() {
    this.patrolCycleParam.checkCycle = this.selectedPatrolCycle;
    this.httpReq.post("ffdMemo/saveCC", null, this.patrolCycleParam, data => {
      if (data["status"] == 200) {
        if (data.code == "0") {
          this.createMessage("success", "修改成功");
          this.isPatrolCycleDialogShow = false;
        } else {
          this.createMessage("error", data["message"]);
          this.isPatrolCycleDialogShow = false;
        }
      }
    });
  }

  // 请求消防区域列表
  loadingAreaArray(reset: boolean = false) {
    const that = this;
    if (reset) {
      this.queryAreaParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryAreaParams.page = this.queryAreaParams.page - 1;
      if (this.queryAreaParams.page < 0) {
        this.queryAreaParams.page = 0;
      }
    }
    that.isAreaTableLoading = true;
    // 消防区域列表
    this.httpReq.post("ffdArea/listAll", null, this.queryAreaParams, data => {
      this.queryAreaParams.page++;
      that.isAreaTableLoading = false;

      if (data.code == "0") {
        data["data"] = JSON.parse(data["data"]);
        that.areaArray = data["data"]["value"]; // 数据列表
        that.resultAreaData.totalElements = data["data"]["totalElements"]; // 总条数
        if (that.areaArray && that.areaArray.length > 0 && reset) {
          that.selectedAreaId = this.areaArray[0].id;
          that.selectedAreaName = this.areaArray[0].name;
          that.queryPointArray(true);
        }
      } else {
        this.createMessage("error", data["message"]);
      }
    });
  }

  /**
   * 删除按钮
   * @param {any} id 要删除的数据对象ID
   */
  public del(id: any, type): void {
    this.selectedDelId = id;
    this.selectedDelAction = type;
    this.isShowDelDialog = true;
  }
  /**
   * 删除消防区域或巡查点
   * @param id
   * @param type fireArea区域，firePatrol巡查点
   */
  delAreaOrPoint() {
    if (Utils.isEmpty(this.selectedDelId)) {
      return;
    }
    let id = this.selectedDelId;
    let type = this.selectedDelAction;
    let param = {
      id: id
    };
    let url = "";
    if (type == "fireArea") {
      url = "ffdArea/del";
    } else {
      url = "fireFightingDevice/del";
    }
    const that = this;
    this.isDelBtnLoading = true;
    that.httpReq.post(url, null, param, data => {
      that.isDelBtnLoading = false;
      that.isShowDelDialog = false;
      if (data["status"] == 200) {
        if (data.code == "0") {
          this.createMessage("success", "删除成功");
          if (type == "fireArea") {
            that.loadingAreaArray(true);
          } else {
            that.queryPointArray(true);
          }
        } else {
          this.createMessage("error", data["message"]);
        }
      }
    });
  }

  /**
   * 编辑消防区域
   * @param data
   */
  doEditArea(data) {
    this.saveAreaParams = { id: "", modifier: "", name: "", noteTaker: "" };
    if (data) {
      this.saveAreaParams.id = data.id;
      this.saveAreaParams.name = data.name;
    }

    this.isEditAreaDialogShow = true;
  }
  /**
   * 区域编辑对话框保存按钮
   */
  doAreaDialogSave() {
    if (Utils.isEmpty(this.saveAreaParams.name)) {
      this.createMessage("error", "请输入消防区域名称");
      return;
    }

    const that = this;
    this.isAreaSaveLoading = true;
    if (Utils.isEmpty(this.saveAreaParams.id)) {
      //请求添加消防区域列表
      this.saveAreaParams.noteTaker = this.firseName;
      this.httpReq.post("ffdArea/save", null, this.saveAreaParams, data => {
        this.isAreaSaveLoading = false;
        if (data.code == "0") {
          this.createMessage("success", "添加成功");
          this.loadingAreaArray(true);
        }
        this.isEditAreaDialogShow = false;
      });
    } else {
      // 请求编辑消防区域列表
      this.saveAreaParams.modifier = this.firseName;
      this.httpReq.post("ffdArea/edit", null, this.saveAreaParams, data => {
        this.isAreaSaveLoading = false;
        if (data.code == "0") {
          this.createMessage("success", "修改成功");
          this.loadingAreaArray(true);
        }
        this.isEditAreaDialogShow = false;
      });
    }
  }

  // 请求消防区域巡查点列表
  queryPointArray(reset: boolean = false) {
    const that = this;
    if (reset) {
      this.queryPointParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryPointParams.page = this.queryPointParams.page - 1;
      if (this.queryPointParams.page < 0) {
        this.queryPointParams.page = 0;
      }
    }
    that.isPointTableLoading = true;
    this.queryPointParams.ffdArea_id = this.selectedAreaId;
    // 消防区域列表
    this.httpReq.post(
      "fireFightingDevice/list",
      null,
      this.queryPointParams,
      data => {
        that.queryPointParams.page++;
        that.isPointTableLoading = false;
        if (data["status"] == 200) {
          if (data.code == "0") {
            that.pointArray = data["data"]["content"]; // 数据列表
            that.resultPointData.totalElements = data["data"]["totalElements"]; // 总条数
          }
        }
      }
    );
  }
  //选择区域后查询巡查点列表
  choosedArea(id, name) {
    this.selectedAreaId = id;
    this.selectedAreaName = name;
    this.queryPointArray(true);
  }

  /**
   * 打开巡查点编辑对话框
   */
  doShowPointDialog(data) {
    if (data) {
      this.savePointParams = data;
      this.savePointParams.fireHydrant = JSON.parse(data.hydrant);
      this.savePointParams.otherFalicitiesArray = JSON.parse(
        data.otherFalicities
      );
    } else {
      this.savePointParams = {
        id: "", //消防点ID(修改接口)
        modifier: "", //修改人（修改接口）
        name: "", //巡查点名称
        hydrant: "", //消防栓
        linkedFireExtinguisherNum: 0, //灭火器数量
        otherFalicities: "", //其他消防设施
        otherFalicitiesArray: [{ item: "" }],
        hasHydrant: "", //是否有消防栓
        hasFireExtinguisher: "", //是否有灭火器
        hasOther: "", //是否有其他消防设施
        ffdArea_id: "", //绑定的区域id（新增接口）
        noteTaker: "", //记录人（新增接口）
        fireHydrant: this.fireHydrant
      };
    }

    console.log("tag", this.savePointParams);

    this.isEditPointDialogShow = true;
  }

  /**
   * 添加其他巡查点配置项
   */
  addOtherItem(): void {
    this.savePointParams.otherFalicitiesArray.push({ item: "" });
  }
  /**
   * 移除其他巡查点配置项
   * @param index
   */
  removeOtherItem(index): void {
    if (this.savePointParams.otherFalicitiesArray.length > 1) {
      this.savePointParams.otherFalicitiesArray.splice(index, 1);
    }
  }

  savePoint() {
    if (Utils.isEmpty(this.savePointParams.name)) {
      this.message.error("请输入巡查点名称！");
      return;
    }

    if (
      !this.savePointParams.hasFireExtinguisher &&
      !this.savePointParams.hasHydrant &&
      !this.savePointParams.hasOther
    ) {
      this.message.error("至少选择一项配备内容！");
      return;
    }

    if (this.savePointParams.hasHydrant) {
      const allUnChecked = this.savePointParams.fireHydrant.every(
        value => value.checked !== true
      );
      if (allUnChecked) {
        this.message.error("至少选择一个消防栓配置项！");
        return;
      }
    }

    if (this.savePointParams.hasFireExtinguisher) {
      if (this.savePointParams.linkedFireExtinguisherNum <= 0) {
        this.message.error("请输入灭火器数量！");
        return;
      }
    }

    if (this.savePointParams.hasOther) {
      if (this.savePointParams.otherFalicitiesArray.length == 0) {
        this.message.error("请输入其他配备项名称！");
        return;
      } else {
        console.log("tag", this.savePointParams.otherFalicitiesArray);
        const allUnEmpty = this.savePointParams.otherFalicitiesArray.every(
          value => !Utils.isEmpty(value.item)
        );
        if (!allUnEmpty) {
          this.message.error("请输入其他配备项名称！");
          return;
        }
      }
    }
    this.savePointParams.hydrant = JSON.stringify(
      this.savePointParams.fireHydrant
    );
    this.savePointParams.otherFalicities = JSON.stringify(
      this.savePointParams.otherFalicitiesArray
    );

    this.isSavePointLoading = true;

    if (Utils.isEmpty(this.savePointParams.id)) {
      this.savePointParams.ffdArea_id = this.selectedAreaId;
      this.savePointParams.noteTaker = this.firseName;
      // 请求新增消防区域列表
      this.httpReq.post(
        "fireFightingDevice/save",
        null,
        this.savePointParams,
        data => {
          this.isSavePointLoading = false;
          if (data.code == "0") {
            this.createMessage("success", "保存成功！");
            this.queryPointArray(true);
          }
          this.isEditPointDialogShow = false;
        }
      );
    } else {
      this.savePointParams.modifier = this.firseName;
      // 请求编辑消防区域列表
      this.httpReq.post(
        "fireFightingDevice/edit",
        null,
        this.savePointParams,
        data => {
          this.isSavePointLoading = false;
          if (data.code == "0") {
            this.createMessage("success", "保存成功！");
            this.queryPointArray(true);
          }
          this.isEditPointDialogShow = false;
        }
      );
    }
    console.log("tag", this.savePointParams);
  }
}
