import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorage } from "../../../common/service/local.storage";

import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  upload_imgArr = [];
  food = {
    name: "", //食品名称
    timeFrame: "", //留样时段
    reservedAmount: "", //留样量
    createTime: "", //留样时间
    reservedPeople: "", //留样人
    pinTime: "", //销样时间
    pinPeople: "", //销样人
    reservedImg: "" //样品图片
  };
  SatetyAnapType = "";
  safePhotoId = {
    id: ""
  };
  Detail = {
    CreatDate: "", //创建时间
    jiluren: "", //记录人
    results: "", //处理结果
    chuliren: "", //处理人
    memo: "", //详情
    photourl: "" //图片
  };

  DetailEdit = {
    id: "",
    state: "",
    jiluren: "", //记录人
    results: "", //处理结果
    chuliren: "", //处理人
    memo: "", //详情
    url: "" //图片
  };
  photourlArray = [];

  infoDetaile;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private modalService: NzModalService
  ) {}
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  ngOnInit() {
    const employeeStr = this.route.snapshot.paramMap.get("id");

    this.infoDetaile = JSON.parse(employeeStr);
    this.SatetyAnapType = this.infoDetaile.type;
    this.safePhotoId.id = this.infoDetaile.id;
    this.DetailEdit.id = this.infoDetaile.id;
    console.log(this.infoDetaile.id);
    // this.FirePatrolIsVisible=true;
    let param = this.httpReq.post(
      "safePhoto/findById",
      null,
      this.safePhotoId,
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.Detail.CreatDate = data["data"]["createDate"];
            this.Detail.jiluren = data["data"]["jiluren"];
            this.Detail.results = data["data"]["results"];
            this.Detail.chuliren = data["data"]["chuliren"];
            this.Detail.memo = data["data"]["memo"];
            this.Detail.photourl = data["data"]["photourl"];
            this.photourlArray = this.Detail.photourl.split(",");
            console.log("图片" + this.photourlArray[0]);

            // 编辑时候的参数
            // this.DetailEdit.id=id
            this.DetailEdit.jiluren = this.Detail.jiluren;
            this.DetailEdit.memo = this.Detail.memo;
            this.DetailEdit.url = this.Detail.photourl;
          } else {
            this.createMessage("error", data["message"]);
          }
        }
      }
    );
  }

  back() {
    history.back();
  }
  // 点击确认 如果type是edit  就显示处理人和处理结果 然后修改
  handleOk() {
    if (this.SatetyAnapType == "edit") {
      this.DetailEdit.state = "已处理";
      this.DetailEdit.results = this.Detail.results;
      this.DetailEdit.chuliren = this.Detail.chuliren;
      let param = this.httpReq.post(
        "safePhoto/edit",
        null,
        this.DetailEdit,
        data => {
          if (data["status"] == 200) {
            if (data.code == "0") {
              this.createMessage("success", "修改成功");
              this.back();
            } else {
              this.createMessage("error", data["message"]);
            }
          }
        }
      );
    }
  }
}
