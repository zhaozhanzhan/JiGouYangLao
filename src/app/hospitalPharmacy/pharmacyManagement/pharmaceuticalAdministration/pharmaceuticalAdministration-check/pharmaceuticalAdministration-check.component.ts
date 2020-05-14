import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { ActivatedRoute } from "@angular/router";
import { GlobalMethod } from "../../../../common/service/GlobalMethod";
@Component({
  selector: "app-pharmaceuticalAdministration-check",
  templateUrl: "./pharmaceuticalAdministration-check.component.html",
  styleUrls: ["./pharmaceuticalAdministration-check.component.css"]
})
export class PharmaceuticalAdministrationCheckComponent implements OnInit {
  result;
  constructor(
    private httpReq: HttpReqService, //数据请求
    private fb: FormBuilder, // 响应式表单,
    private localStorage: LocalStorage, //存储
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private msg: NzMessageService, // 消息提醒
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let data = this.route.snapshot.paramMap.get("data");
    if (data) {
      this.result = JSON.parse(data);
      console.log(this.result);
    }
    this.getAllDataDictionary();
  }
  unitList = []; //单位
  dosageFormList = []; //剂型
  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "/dictionaryMedicationData/dataListAllTwo",
      null,
      {
        dictTypes: "unit,dosageForm"
      },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const info = data["data"];
            info.forEach(e => {
              //单位
              if (e.dictType == "unit") {
                this.unitList = e.ddList;
              }

              //剂型
              if (e.dictType == "dosageForm") {
                this.dosageFormList = e.ddList;
              }
            });
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }
  back() {
    history.back();
  }
}
