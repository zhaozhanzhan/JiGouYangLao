import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-addDictionaryData",
  templateUrl: "./addDictionaryData.component.html",
  styleUrls: ["./addDictionaryData.component.scss"]
})
export class AddDictionaryDataComponent implements OnInit {
  managementId; //项目的ID
  id; //修改时的id

  // 保存康复数据时的参数
  addDictionaryObj = {
    id: "", //添加时id为空，修改时ID有
    managementId: "", //配置id
    name: "", //项目名称
    sort: "", //排序
    type: "", //康复类型
    age: "", //参考年龄
    promptWay: "", //提示方式
    standard: "" //成功标准
  };
  state; //true是项目，false是范畴和子范畴
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.managementId = this.route.snapshot.paramMap.get("managementId");
    this.state = this.route.snapshot.paramMap.get("state");
    const digitalStr = this.route.snapshot.paramMap.get("info");
    if (digitalStr) {
      const digital = JSON.parse(digitalStr);
      this.id = digital.id;
      this.addDictionaryObj = digital;
    } else {
      this.id = "";
    }
  }

  back() {
    history.back();
  }

  saveForm() {
    this.addDictionaryObj.managementId = this.managementId;
    this.addDictionaryObj.id = this.id;
    if (this.addDictionaryObj.name == "") {
      this.message.error("项目名称不能为空");
      return;
    }

    console.log(this.state);
    if (this.state == "true") {
      if (this.addDictionaryObj.type == "") {
        this.message.error("康复类型不能为空");
        return;
      }
    }
    this.httpReq.post(
      "/rehabilitionConfig/save",
      null,
      this.addDictionaryObj,
      data => {
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
}
