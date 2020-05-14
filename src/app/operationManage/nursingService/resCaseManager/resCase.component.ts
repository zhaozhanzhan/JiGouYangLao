import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";

@Component({
  selector: "app-goodsManager",
  templateUrl: "./resCase.component.html"
})
export class ResCaseComponent implements OnInit {
  isTableLoading;
  resCaseBaseList;
  resCaseList;
  nursingGradeList;

  nursingGradeSelect;
  nursingGradeSelectOld;
  canEdit = false;
  isSaveBtnLoading = false;

  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    this.nursingGradeSelect = {};

    this.httpReq.get("resCaseBase/list", null, data => {
      if (data["status"] == 200) {
        this.resCaseBaseList = data["data"];
      }
    });

    this.httpReq.get("careLevelCase/allList", null, data => {
      if (data["status"] == 200) {
        this.nursingGradeList = data["data"];
      }
    });

    this.httpReq.get("resCase/list", null, data => {
      if (data["status"] == 200) {
        const resCaseList = JSON.parse(data["data"]);
        this.resCaseList = resCaseList;

        resCaseList.forEach(ele1 => {
          ele1.careLevelCase.forEach(ele2 => {
            this.nursingGradeSelect[
              ele1.resCaseBaseInfo.id + "-" + ele2.id
            ] = true;
          });
        });

        this.nursingGradeSelectOld = this.jsUtil.deepClone(
          this.nursingGradeSelect
        );
      }
    });
  }

  save() {
    let params = [];
    this.resCaseBaseList.forEach(ele1 => {
      let param = {
        resCaseBase_id: ele1.id,
        careLevelCase_ids: ""
      };
      let careLevelCase_idList = [];
      this.nursingGradeList.forEach(ele2 => {
        if (this.nursingGradeSelect[ele1.id + "-" + ele2.id]) {
          careLevelCase_idList.push(ele2.id);
        }
      });
      if (careLevelCase_idList.length > 0) {
        param.careLevelCase_ids = careLevelCase_idList.join(",");
        params.push(param);
      }
    });

    this.isSaveBtnLoading = true;
    this.httpReq.post("resCase/save", null, { rcbJson: params }, data => {
      if (data["status"] == 200) {
        this.isSaveBtnLoading = false;
        this.canEdit = false;
        this.message.success("保存成功！");
        this.nursingGradeSelectOld = this.jsUtil.deepClone(
          this.nursingGradeSelect
        );
      }
    });
  }

  changeState() {
    this.canEdit = true;
  }

  cancel() {
    this.nursingGradeSelect = this.jsUtil.deepClone(this.nursingGradeSelectOld);
    this.canEdit = false;
  }
}
