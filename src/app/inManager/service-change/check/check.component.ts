import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.css"]
})
export class CheckComponent implements OnInit {
  serviceChange;
  userInfo;
  params = {
    id: ""
  };
  dateFormat = "yyyy-MM-dd";

  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {}

  ngOnInit() {
    this.serviceChange = {};
    this.serviceChange.oldman = {};

    let id = this.route.snapshot.paramMap.get("id");

    if (id) {
      let that = this;
      that.params.id = id;
      // that.httpService.doPostHttp(
      //   '/oldmanUnusualChange/findById',
      //   { id: id },
      //   function(successful, data, res) {
      //     that.serviceChange = data;
      //   },
      //   function(successful, msg, err) {
      //     const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      //     that.toastService.toast(toastCfg);
      //   }
      // );

      let param = this.httpReq.post(
        "/oldmanUnusualChange/findById",
        null,
        that.params,
        data => {
          if (data["status"] == 200) {
            that.serviceChange = data["data"];
          }
        }
      );
    }
  }

  back() {
    history.back();
  }
}
