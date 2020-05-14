import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-hospitalRegistration-check",
  templateUrl: "./hospitalRegistration-check.component.html",
  styleUrls: ["./hospitalRegistration-check.component.css"]
})
export class HospitalRegistrationCheckComponent implements OnInit {
  result;
  folkList = []; //folk民族
  sexList = []; //性别
  occupationList = []; //职业
  provincesList = []; //省的列表
  citysList = []; //市列表
  areasList = []; //县列表
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService, //数据请求
    private msg: NzMessageService // 消息提醒
  ) {}

  ngOnInit() {
    let data = this.route.snapshot.paramMap.get("data");
    if (data) {
      this.result = JSON.parse(data);
      this.getListProvinces();
      this.getListCitys();
      this.getListAreas();
    }
    this.getAllDataDictionary();
  }

  back() {
    history.back();
  }

  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "dictMgt/listDataByTypes",
      null,
      { dictTypes: "folk,sex,occupation" },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const info = data["data"];
            info.forEach(e => {
              //folk民族
              if (e.dictType == "folk") {
                this.folkList = e.ddList;
                console.log(this.folkList);
              }
              //sex性别
              if (e.dictType == "sex") {
                this.sexList = e.ddList;
              }
              //occupation职业
              if (e.dictType == "occupation") {
                this.occupationList = e.ddList;
              }
            });
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }

  getListProvinces() {
    const that = this;
    this.httpReq.post("/chnAreas/listProvinces", null, {}, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          that.provincesList = data["data"];
        } else {
          that.msg.success(data["message"]);
        }
      }
    });
  }

  getListCitys() {
    const that = this;
    this.httpReq.post(
      "/chnAreas/listCitys",
      null,
      { provCode: this.result.birthPlacePro },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.citysList = data["data"];
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }

  getListAreas() {
    const that = this;
    this.httpReq.post(
      "chnAreas/listAreas",
      null,
      { cityCode: this.result.birthPlaceCity },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            that.areasList = data["data"];
          } else {
            that.msg.success(data["message"]);
          }
        }
      }
    );
  }
}
