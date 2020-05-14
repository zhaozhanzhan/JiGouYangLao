/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-10 18:09:18
 * @Description:
 */
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzTreeNode, NzFormatEmitEvent, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-audit",
  templateUrl: "./audit.component.html",
  styleUrls: ["./audit.component.css"]
})
export class AuditComponent implements OnInit {
  isLoadingData = false;
  isSaveBtnLoading = false;
  review;
  userInfo;

  validateForm: FormGroup;
  ruzhuForm: FormGroup;

  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      name: ["", [Validators.required]],
      sex: ["", [Validators.required]],
      nation: [""],
      birthYearMonth: ["", [Validators.required]],
      cardno: [
        "",
        [Validators.pattern(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)]
      ],
      personnelSort: [""],
      personnelSortMemo: ["", []],
      laborAbility: ["", [Validators.required]],
      careLevelCase_id: [""]
    });

    // this.ruzhuForm = this.fb.group({
    //   bed_id: ["", [Validators.required]],
    //   isTry: ["", []],
    //   inDate: ["", []]
    // });
  }
  reviewId;
  nodes = [
    new NzTreeNode({
      title: "楼房管理",
      key: "1",
      disabled: true
    })
  ];
  expandKeys = ["1"];

  nursingGradeList = [];

  ngOnInit() {
    this.review = {};
    this.userInfo = this.localStroage.getUser();
    let reviewId = this.route.snapshot.paramMap.get("id");
    console.log('tag', reviewId)
    this.review.id = reviewId;
    let that = this;
    this.isLoadingData = true;
    if (reviewId) {
      let that = this;
      that.httpReq.post(
        "oldMemo/findByOldman",
        null,
        { oldman_id: reviewId },
        function (data) {
          if (data["code"] == 0) {
            let oldMemoResult = null;
            try {
              oldMemoResult = JSON.parse(data["data"]);
              oldMemoResult.memo = JSON.parse(oldMemoResult.memo);
            } catch (error) { }
            if (oldMemoResult == null) {
              that.httpReq.post(
                "oldman/findById",
                null,
                { id: reviewId },
                function (data) {
                  that.isLoadingData = false;
                  if (data["code"] == 0) {
                    that.copyDataToReview(JSON.parse(data["data"]));
                  }
                }
              );
            } else {
              that.review = oldMemoResult;
              //已进行保存过入院审核的信息
              that.isLoadingData = false;

              if (that.review.isBilling) {
                that.review.isBilling = "是";
                if ((that.review.isBilling = "是")) {
                  that.review.invoiceType = oldMemoResult.memo.invoiceType;
                  that.review.Gename = oldMemoResult.memo.Gename;
                  that.review.Gname = oldMemoResult.memo.Gname;
                  that.review.DutyParagraph = oldMemoResult.memo.DutyParagraph;
                }
              } else {
                that.review.isBilling = "否";
              }
            }
          } else {
            that.httpReq.post(
              "oldman/findById",
              null,
              { id: reviewId },
              function (data) {
                that.isLoadingData = false;
                if (data["code"] == 0) {
                  that.copyDataToReview(JSON.parse(data["data"]));
                }
              }
            );
          }
        }
      );
    }

    this.httpReq.get("careLevelCase/allList", null, function (data) {
      if (data["code"] == 0) {
        that.nursingGradeList = data["data"];
      }
    });

    that.httpReq.get("building/all2", null, function (data) {
      if (data["code"] == 0) {
        const treeData = JSON.parse(data["data"]);

        treeData.children.forEach(ele => {
          that.nodes[0].addChildren([new NzTreeNode(ele)]);
        });
      }
    });
  }

  copyDataToReview(data) {

    this.review.oldman_id = data.id;
    this.review.name = data.name;
    this.review.sex = data.sex;
    this.review.nation = data.nation;
    this.review.birthYearMonth = data.birthYearMonth;
    this.review.cardno = data.cardno;
    this.review.personnelSort = data.personnelSort;
    this.review.personnelSortMemo = data.personnelSortMemo;
    this.review.laborAbility = data.laborAbility;
    this.review.epName = data.EconomicProvider.name;
    this.review.epCardno = data.EconomicProvider.cardno;
    this.review.epAddress = data.EconomicProvider.address;
    // this.review.careLevelCase_name=data.EconomicProvider.careLevelCase_name
    this.review.epRelationship = data.EconomicProvider.relationship;
    this.review.epPhone = data.EconomicProvider.phone;
    this.review.eAge = data.EconomicProvider.age;
    this.review.invoiceType = data.EconomicProvider.memo.invoiceType;
    this.review.Gename = data.EconomicProvider.memo.Gename;
    this.review.Gname = data.EconomicProvider.memo.Gname;
    this.review.DutyParagraph = data.EconomicProvider.memo.DutyParagraph;
  }

  onSelectedIndexChange(selectIndex: number) {
    // console.log(selectIndex);
    // alert(selectIndex);
  }

  onReligionChange(value) {
    if (this.review.religion === "无") {
      this.review.religionMemo = "";
    }
  }

  onMedicalPaymentChange(value) {
    if (this.review.medicalPayment !== "其他") {
      this.review.medicalPaymentMemo = "";
    }
  }

  onPersonnelSortChange(value) {
    if (this.review.personnelSort === "社会代养") {
      this.review.personnelSortMemo = "";
    }
  }

  back() {
    history.back();
  }

  onSavePersonalInfo() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    for (const i in this.ruzhuForm.controls) {
      this.ruzhuForm.controls[i].markAsDirty();
      this.ruzhuForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    this.review.noteTaker = this.userInfo.name;
    const that = this;
    this.isSaveBtnLoading = true;

    if (that.review.isBilling == "是") {
      that.review.isBilling = true;
    } else {
      that.review.isBilling = false;
    }

    if (Utils.isEmpty(this.review.id)) {
      this.httpReq.post("oldMemo/save", null, this.review, function (data) {
        that.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.back();
        } else {
          that.message.error(data["message"]);
        }
      });
    } else {
      this.httpReq.post("oldMemo/edit", null, this.review, function (data) {
        that.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.back();
        } else {
          that.message.error(data["message"]);
        }
      });
    }
  }

  onExpandChange(e: NzFormatEmitEvent): void {
    if (e.node.getChildren().length === 0 && e.node.isExpanded) {
      let that = this;

      that.httpReq.get("building/all2", null, function (data) {
        if (data["code"] == 0) {
          const treeData = JSON.parse(data["data"]);
          treeData.children.forEach(ele => {
            e.node.addChildren([new NzTreeNode(ele)]);
          });
        }
      });
    }
  }

  onApply() {
    if (Utils.isEmpty(this.review.id)) {
      this.message.error("数据出错，请重试！");
      return;
    }
    let that = this;
    that.httpReq.post("oldMemo/doApply", null, { id: this.review.id }, function (
      data
    ) {
      if (data["code"] == 0) {
        that.message.success("审核成功！");
        that.back();
      } else {
        that.message.error(data["message"]);
      }
    });
  }
}
