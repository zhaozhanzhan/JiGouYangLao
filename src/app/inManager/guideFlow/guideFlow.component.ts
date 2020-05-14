import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../common/service/local.storage";

@Component({
  selector: "app-guideFlow",
  templateUrl: "./guideFlow.component.html",
  styleUrls: ["./guideFlow.component.scss"]
})
export class GuideFlowComponent implements OnInit {
  divTarget;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private localStorage: LocalStorage
  ) {}
  user;
  rolesMemo;
  ngOnInit(): void {
    this.showDrow = false;
    this.user = this.localStorage.getUser();
    if (
      this.user.rolesMemo != undefined &&
      this.user.rolesMemo != null &&
      this.user.rolesMemo.length > 2
    ) {
      this.rolesMemo = this.user.rolesMemo[1];

      console.log(this.rolesMemo);
    }
  }
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  ngAfterViewInit() {}

  //首页流程图中各步骤点击事件
  stepClick(hrefUrl: string, label: string) {
    // this.router.navigate([hrefUrl], { relativeTo: this.activatedRoute });
  }

  showDrow = false;
  showDrowMenu() {
    if (this.showDrow == true) {
      this.showDrow = false;
    } else {
      this.showDrow = true;
    }
  }
}
