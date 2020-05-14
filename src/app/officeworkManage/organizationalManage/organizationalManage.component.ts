import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { FormBuilder } from "@angular/forms";
import { ConfigInfoComponent } from "./configInfo/configInfo.component";
@Component({
  selector: "app-organizationalManage",
  templateUrl: "organizationalManage.component.html",
  styleUrls: ["./organizationalManage.component.css"]
})
export class OrganizationalManageComponent implements OnInit {
  @ViewChild(ConfigInfoComponent)
  configInfoView: ConfigInfoComponent;

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private fb: FormBuilder, // 响应式表单
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
  saveScan(saveImgUrlsArray: Array<string>) {
    console.log(saveImgUrlsArray);
  }

  selectedConfigPage() {
    this.configInfoView.initBMap();
  }
}
