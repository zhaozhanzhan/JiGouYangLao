import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { NzMessageService } from "../../../../../node_modules/ng-zorro-antd";
@Component({
  selector: "app-elder-info",
  templateUrl: "./elder-info.component.html",
  styleUrls: ["./elder-info.component.css"]
})
export class ElderInfoComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {}

  back() {
    history.back();
  }
}
