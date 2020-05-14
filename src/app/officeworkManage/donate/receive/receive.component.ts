import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-receive",
  templateUrl: "./receive.component.html",
  styleUrls: ["./receive.component.css"]
})
export class ReceiveComponent implements OnInit {
  tabIndex = 0;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.tabIndex = Number(sessionStorage.getItem(this.router.url));
    }
  }

  turnToAdd() {
    this.router.navigate(["add", { state: "add" }], { relativeTo: this.route });
  }

  /**
   * Tab标签页点击事件
   * @param {*} ev
   */
  public clickTab(ev: any) {
    // console.info(this.tabIndex);
    sessionStorage.setItem(this.router.url, String(this.tabIndex));
  }
}
