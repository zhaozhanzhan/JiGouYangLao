import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from "@angular/core";
import {
  Router,
  ActivatedRoute,
  ActivationEnd,
  RouteReuseStrategy
} from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { ReuseTabService } from "@delon/abc";

@Component({
  selector: "app-patientFiles-right",
  templateUrl: "./rightContent.component.html",
  styleUrls: ["./rightContent.component.scss"]
})
export class RightContentComponent implements OnInit, OnDestroy {
  private router$: Subscription;

  @Input("parentUrl")
  parentUrl: string;

  tabs: any[] = [];
  //当前选中的分页下标
  selectedTabIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private reuseTabService: ReuseTabService
  ) {}

  private setActive() {
    const curUrl = this.router.url;
    const key = this.router.url.substr(this.router.url.lastIndexOf("/") + 1);
    // //排除没有默认选中的情况
    if (key.startsWith("patientFiles")) {
      return;
    }

    //判断当前tab列表是否已经存在该分页
    let exitNum = 0;

    let decodedUrl = decodeURI(key);
    let index = decodedUrl.indexOf("?data=");
    let urlKey = decodedUrl.slice(0, index);
    let jsonStr = decodedUrl.slice(index + 6);
    let paramData = null;
    try {
      paramData = JSON.parse(jsonStr);
    } catch (error) {}

    this.tabs.forEach(element => {
      if (
        element.key == urlKey ||
        element.url == curUrl ||
        urlKey.indexOf(element.key) != -1
      ) {
        exitNum++;
      }
    });
    if (exitNum == 0) {
      //不存在需要添加
      let item = {
        key: urlKey,
        tab: this.titleService.getTitle(),
        url: this.reuseTabService.curUrl,
        paramData: paramData
      };
      this.tabs.push(item);
    } else {
      //若存在，需要切换当前选中的分页到该功能上
      const idx = this.tabs.findIndex(w => w.key === urlKey);
      if (idx !== -1) this.selectedTabIndex = idx;
    }
  }

  ngOnInit(): void {
    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
    this.setActive();
  }

  to(item: any) {
    if (item.paramData) {
      this.router.navigate([`./${item.key}`, item.paramData], {
        relativeTo: this.route
      });
    } else {
      this.router.navigate([`./${item.key}`], {
        relativeTo: this.route
      });
    }
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
  }

  closeTab(index) {
    this.reuseTabService.close(this.tabs[index].url);
    this.reuseTabService.clear();
    this.tabs.splice(index, 1);
    //当前删除的tab在选中的之前，需要变动选中的下标位
    if (index < this.selectedTabIndex) {
      this.selectedTabIndex = index;
    }
  }

  back() {
    if (this.parentUrl == "父级医生工作站") {
      if (this.route.children.length > 0) {
        this.router.navigate([`./../doctorWorkstation/wardMage`], {
          relativeTo: this.route
        });
      } else {
        history.back();
      }
    } else if (this.parentUrl == "父级护士工作站") {
      if (this.route.children.length > 0) {
        this.router.navigate([`./../nurseWorkstation/wardMage`], {
          relativeTo: this.route
        });
      } else {
        history.back();
      }
    } else {
      this.router.navigate([`/nursingHome/homePage`], {
        relativeTo: this.route
      });
    }
  }
}
