import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-infoDetails",
  templateUrl: "./infoDetails.component.html",
  styleUrls: ["./infoDetails.component.scss"]
})
export class infoDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}

  infoDetaile = {
    updateDate: "",
    modifier: "",
    hydrant: [],
    ffdMemo: {
      ffdmemo: "",
      updateDate: "",
      isQualified: false,
      noteTaker: "",
      id: "",
      url: ""
    },
    hasHydrant: false,
    hasOther: true,
    name: "",
    linkedFireExtinguisherNum: "0",
    otherFalicities: [],
    noteTaker: "",
    id: "",
    feList: [],
    hasFireExtinguisher: false,
    createDate: ""
  };
  // 获得图片
  urlArray = [];
  // 获得巡查信息
  patrolDetails = {
    ffdmemo: "",
    updateDate: "",
    isQualified: false,
    noteTaker: "",
    id: "",
    url: ""
  };
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  ngOnInit() {
    const infoDetaile = this.route.snapshot.paramMap.get("infoDetails");
    console.log(JSON.stringify(infoDetaile));

    let temp = JSON.parse(infoDetaile);
    if (temp && temp.hydrant && temp.otherFalicities && temp.ffdMemo) {
      this.infoDetaile = temp;
      this.infoDetaile.hydrant = JSON.parse(temp.hydrant);
      this.infoDetaile.otherFalicities = JSON.parse(temp.otherFalicities);
      // 获得巡查信息
      this.patrolDetails = this.infoDetaile.ffdMemo;
      if (this.infoDetaile.ffdMemo.url == undefined) {
        this.urlArray = [];
      } else {
        this.urlArray = this.infoDetaile.ffdMemo.url.split(",");
      }
    }
  }

  back() {
    history.back();
  }
}
