import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { Utils } from "../../../../common/utils/utils";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  resCaseBase;
  //自定义分类列表
  customList = [];
  sortList = [];
  itemList = [];

  validateForm;

  isBtnLoading = false;
  isNumHidden = true;

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      customId: ["", [Validators.required]],
      sortId: ["", [Validators.required]],
      itemId: ["", [Validators.required]],
      danwei: ["", [Validators.required]],
      alias: ["", [Validators.required]],
      num: ["", [Validators.required, Validators.min(0)]]
    });

    this.resCaseBase = {
      id: ""
    };
    const resCaseBaseStr = this.route.snapshot.paramMap.get("resCaseBase");
    if (!Utils.isEmpty(resCaseBaseStr)) {
      this.resCaseBase = JSON.parse(resCaseBaseStr);
      console.log("tag", this.resCaseBase);

      this.validateForm.patchValue({
        sortId: this.resCaseBase.resCaseBaseInfo.parent.id
      });
      this.onSortChange();
      this.validateForm.patchValue({
        itemId: this.resCaseBase.resCaseBaseInfo.id
      });

      this.validateForm.patchValue({ danwei: this.resCaseBase.danwei });
      this.onDanweiChange();
      this.validateForm.patchValue({ num: this.resCaseBase.num });

      this.validateForm.patchValue({
        alias: this.resCaseBase.resCaseBaseInfo.alias
      });
      this.validateForm.patchValue({
        customId: this.resCaseBase.resCaseBaseInfo.rcbCustomInfo.id
      });
    }

    this.httpReq.get("resCaseBaseInfo/parentList", null, data => {
      if (data["code"] == 0) {
        this.sortList = data["data"];
      }
    });

    this.getCustomList();
  }

  back() {
    history.back();
  }

  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    let reqObj = this.validateForm.value;
    reqObj.resCaseBaseInfo_id = reqObj.itemId;
    delete reqObj.sortId;
    delete reqObj.itemId;
    console.log(reqObj);

    this.isBtnLoading = true;
    reqObj.id = this.resCaseBase.id;
    this.httpReq.post(
      "resCaseBase/saveOrUpdateBindCase",
      null,
      reqObj,
      data => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        }
      }
    );
  }
  onCustomChange() {}
  onSortChange() {
    const formData = this.validateForm.value;
    const sortId = formData.sortId;

    this.httpReq.post(
      "resCaseBaseInfo/sonList",
      null,
      { parent_id: sortId },
      data => {
        if (data["code"] == 0) {
          this.itemList = data["data"];
        }
      }
    );

    this.validateForm.patchValue({ itemId: undefined });
    this.validateForm.patchValue({ danwei: undefined });
    this.validateForm.patchValue({ num: undefined });
    this.isNumHidden = true;
  }

  onItemChange(id) {
    this.validateForm.patchValue({ danwei: undefined });
    this.validateForm.patchValue({ num: undefined });
    this.isNumHidden = true;

    this.itemList.forEach(element => {
      if (element.id == id) {
        this.validateForm.patchValue({ alias: element.caseName });
      }
    });
  }

  onDanweiChange() {
    const danwei = this.validateForm.value.danwei;
    if (danwei == "次/天" || danwei == "次/周" || danwei == "次/月") {
      this.validateForm.patchValue({ num: undefined });
      this.isNumHidden = false;
    } else if (danwei == "即时") {
      this.validateForm.patchValue({ num: 0 });
      this.isNumHidden = true;
    } else {
      this.isNumHidden = true;
    }
  }

  /**
   * 获取用户自定义分类列表
   */
  getCustomList(): void {
    this.httpReq.get("resCaseBaseCustom/allList", {}, data => {
      if (data["code"] == 0) {
        this.customList = data["data"];
      }
    });
  }
}
