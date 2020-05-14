import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  FireAreaID = {
    //请求巡查的详情参数
    areaId: "",
    fpDate: ""
  };
  PatrolAreaDetails = {
    areaName: "", //巡查区域
    fpName: "", //巡查人
    fpDate: "" //巡查时间
  };
  PatrolAreaDetailsValue = []; //获得每一个数据的列表
  PatrolAreaListItem = []; //获得所有的标题

  list = [];

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  FireInspection;
  ngOnInit() {
    const info = this.route.snapshot.paramMap.get("info");
    this.FireInspection = JSON.parse(info);

    this.FireAreaID.areaId = this.FireInspection.id;
    console.log("info" + info);
    this.FireAreaID.fpDate = this.FireInspection.fpDate;
    this.PatrolAreaDetails.areaName = this.FireInspection.areaName;
    this.PatrolAreaDetails.fpName = this.FireInspection.fpName;
    this.PatrolAreaDetails.fpDate = this.FireInspection.fpDate;

    // 获得每一个单个的标题
    this.httpReq.post("fpInspect/listItem", null, null, data => {
      if (data["status"] == 200) {
        data["data"] = JSON.parse(data["data"]);
        if (data.code == "0") {
          this.PatrolAreaListItem = data["data"]["value"];
          // 请求每一项标题里面的内容
          this.httpReq.post(
            "fpInspect/listDesc",
            null,
            this.FireAreaID,
            data => {
              if (data["status"] == 200) {
                data["data"] = JSON.parse(data["data"]);
                if (data.code == "0") {
                  this.PatrolAreaDetailsValue = data["data"]["value"];
                  // 获得每一项的数据
                  this.PatrolAreaListItem.forEach(e => {
                    const value = {
                      fpTypeDesc: "", //标题
                      inspectDesc: "", //详情
                      picUrl: [], //图片
                      fpType: "", //类型
                      isQualified: "" //选择是否
                    };
                    value.fpTypeDesc = e.fpTypeDesc;
                    this.PatrolAreaDetailsValue.forEach(a => {
                      if (a.fpType == e.fpType) {
                        a.isQualified = a.isQualified.toString();
                        value.inspectDesc = a.inspectDesc;
                        value.picUrl = a.picUrl.split(",");
                        value.fpType = a.fpType;
                        value.isQualified = a.isQualified;
                      }
                    });
                    this.list.push(value);
                  });
                } else {
                  this.createMessage("error", data["message"]);
                }
              }
            }
          );
        } else {
          this.createMessage("error", data["message"]);
        }
      }
    });
  }

  back() {
    history.back();
  }

  openNew(str) {
    window.open(str);
  }
}
