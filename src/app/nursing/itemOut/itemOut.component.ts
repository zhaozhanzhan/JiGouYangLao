import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { Utils } from "../../common/utils/utils";

@Component({
  selector: "app-itemOut",
  templateUrl: "itemOut.component.html",
  styleUrls: ["./itemOut.component.scss"]
})
export class ItemOutComponent implements OnInit {
  tabIndex

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
  ) {}

  ngOnInit() {
  
  }
  public clickTab(ev: any) {
    // console.info(this.tabIndex);
    sessionStorage.setItem(this.router.url, String(this.tabIndex));
  }
  
}
