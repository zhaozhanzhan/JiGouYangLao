/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-11 16:51:53
 * @Description:
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { NzTreeNode, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { ENgxPrintComponent } from "e-ngx-print";

@Component({
  selector: "app-buildingCode",
  templateUrl: "buildingCode.component.html",
  styleUrls: ["./buildingCode.component.css"]
})
export class BuildingCodeComponent implements OnInit {

  codeList = [];

  expandKeys = ["1"];
  nodes = [];

  /**
   * 打印样式配置
   */
  printConfig = {
    paddingTop: 1,
    paddingBottom: 1,
    paddingSize: 10,
    codeSize: 100,
    fontSize: 14,
    fontTop: 1
  }
  queryBuildingCodeParam = {
    buildingType: "",
    id: "",
    qrCodeType: ""
  };

  printCodeType = "1";

  //打印状态控制
  isPrintNow: boolean = false; // 是否正在打印
  printCSS: Array<string> = [
  ]; // 打印内容css文件路径
  printStyle: string = ``;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件


  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) { }

  mouseAction(name: string, e: any): void {
    if (name != "click") {
      return;
    }
    if (e.node.level == 0) {
      // this.updateBuildingList();
    } else if (e.node.level == 1) {
      this.updateCodeList('1', e.node.key);
    } else if (e.node.level == 2) {
      this.updateCodeList('2', e.node.key);
    } else if (e.node.level == 3) {
      this.updateCodeList('3', e.node.key);
    } else {
    }
  }

  ngOnInit() {
    this.updateBuildingTree();
    // this.updateBuildingList();
  }

  updateBuildingTree() {
    this.nodes = [];
    this.httpReq.get("building/all1", null, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        this.nodes.push(new NzTreeNode(result));
      }
    });
  }

  updateCodeList(buildingType, id) {
    this.queryBuildingCodeParam = {
      buildingType: buildingType,
      id: id,
      qrCodeType: this.printCodeType
    }
    this.httpReq.post(
      "building/getQrCodeInfo",
      null,
      this.queryBuildingCodeParam,
      data => {
        if (data["status"] == 200) {
          try {
            this.codeList = JSON.parse(data["data"]);
          } catch (error) {
            this.codeList = [];
          }
        }
      }
    );
  }

  /**
* 单击打印按钮调用打印方法
* @param {MouseEvent} [ev]
* @memberof MedicalRecordComponent
*/
  public clickPrint() {
    this.printComponent.print(); // 调用打印方法
  }

}
