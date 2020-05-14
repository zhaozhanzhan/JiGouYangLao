import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzTreeNode, NzFormatEmitEvent, NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.css"]
})
export class ReviewComponent implements OnInit {
  isLoadingData = false;
  isSaveBtnLoading = false;
  review;
  userInfo;
  invoiceType;
  Gename;
  Gname;
  DutyParagraph;
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
      personnelSortMemo: ["", []]
      // laborAbility: ['', []],
    });

    this.ruzhuForm = this.fb.group({
      bed_id: ["", [Validators.required]],
      careLevelCase_id: ["", [Validators.required]],
      isTry: ["", []],
      inDate: ["", []]
    });
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
    let appayType = this.route.snapshot.paramMap.get("appayType");

    let that = this;
    this.isLoadingData = true;
    if (reviewId) {
      if (appayType == "5") {
        let that = this;
        that.httpReq.post(
          "oldMemo/findByOldman",
          null,
          { oldman_id: reviewId },
          function(data) {
            if (data["code"] == 0) {
              let oldMemoResult = null;
              try {
                oldMemoResult = JSON.parse(data["data"]);
              } catch (error) {}
              if (oldMemoResult == null) {
                that.httpReq.post(
                  "oldman/findById",
                  null,
                  { id: reviewId },
                  function(data) {
                    that.isLoadingData = false;
                    if (data["code"] == 0) {
                      that.copyDataToReview(JSON.parse(data["data"]));
                    }
                  }
                );
              } else {
                //已进行保存过入院审核的信息
                that.isLoadingData = false;
                that.review = oldMemoResult;
                that.review.memo = JSON.parse(that.review.memo);
                // that.review.epAge=
                that.invoiceType = that.review.memo.invoiceType;
                that.Gename = that.review.memo.Gename;
                that.Gname = that.review.memo.Gname;
                that.DutyParagraph = that.review.memo.DutyParagraph;
                if (that.review.isBilling) {
                  that.review.isBilling = "是";
                } else {
                  that.review.isBilling = "否";
                }
              }
            } else {
              that.httpReq.post(
                "oldman/findById",
                null,
                { id: reviewId },
                function(data) {
                  that.isLoadingData = false;
                  if (data["code"] == 0) {
                    that.copyDataToReview(JSON.parse(data["data"]));
                  }
                }
              );
            }
          }
        );
      } else {
        that.httpReq.post("oldman/findById", null, { id: reviewId }, function(
          data
        ) {
          that.isLoadingData = false;
          if (data["code"] == 0) {
            that.copyDataToReview(JSON.parse(data["data"]));
          }
        });
      }
    }

    this.httpReq.get("careLevelCase/allList", null, function(data) {
      if (data["code"] == 0) {
        that.nursingGradeList = data["data"];
      }
    });

    that.httpReq.get("building/all2", null, function(data) {
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
    // this.review.laborAbility = data.laborAbility;
    this.review.epName = data.EconomicProvider.name;
    this.review.epCardno = data.EconomicProvider.cardno;
    this.review.epAddress = data.EconomicProvider.address;
    this.review.epRelationship = data.EconomicProvider.relationship;
    this.review.epPhone = data.EconomicProvider.phone;
    this.review.epAge = data.EconomicProvider.age;

    if (data.bedId != "undefined") {
      this.review.bed_id = data.bedId;
    } else {
      this.review.bed_id = "";
    }

    if (data.bedName != "undefined") {
      this.review.bed_name = data.bedName;
    } else {
      this.review.bed_name = "";
    }

    if (data.careLevelCaseId != "undefined") {
      this.review.careLevelCase_id = data.careLevelCaseId;
    } else {
      this.review.careLevelCase_id = "";
    }

    if (data.inDate != "undefined") {
      this.review.inDate = data.inDate;
    } else {
      this.review.inDate = "";
    }

    if (data.nursingFee != "undefined") {
      this.review.nursingFee = data.nursingFee;
    } else {
      this.review.nursingFee = "";
    }

    if (data.bedFee != "undefined") {
      this.review.bedFee = data.bedFee;
    } else {
      this.review.bedFee = "";
    }

    if (data.foodFee != "undefined") {
      this.review.foodFee = data.foodFee;
    } else {
      this.review.foodFee = "";
    }

    if (data.otherFee != "undefined") {
      this.review.otherFee = data.otherFee;
    } else {
      this.review.otherFee = "";
    }

    if (data.isBilling != "undefined") {
      if (data.isBilling == true) {
        this.review.isBilling = "是";
      } else {
        this.review.isBilling = "否";
      }
    } else {
      this.review.isBilling = "";
    }

    if (data.memo != undefined) {
      let memo = JSON.parse(data.memo);
      this.invoiceType = memo.invoiceType;
      if (memo.Gename != "undefined") {
        this.Gename = memo.Gename;
      }

      if (memo.Gname != "undefined") {
        this.Gname = memo.Gname;
      }

      if (memo.DutyParagraph != "undefined") {
        this.DutyParagraph = memo.DutyParagraph;
      }
    } else {
      this.Gename = "";
      this.Gname = "";
      this.DutyParagraph = "";
    }
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
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
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
    this.review.memo = {};
    this.review.memo.invoiceType = that.invoiceType;
    this.review.memo.Gename = that.Gename;
    this.review.memo.Gname = that.Gname;
    this.review.memo.DutyParagraph = that.DutyParagraph;
    if (Utils.isEmpty(this.review.id)) {
      this.httpReq.post("oldMemo/save", null, this.review, function(data) {
        that.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.createMessage("success", "保存成功");
          that.back();
        } else {
          that.createMessage("error", data["message"]);
        }
      });
    } else {
      this.httpReq.post("oldMemo/edit", null, this.review, function(data) {
        that.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.createMessage("success", "保存成功");
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

      that.httpReq.get("building/all2", null, function(data) {
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
    that.httpReq.post("oldMemo/doApply", null, { id: this.review.id }, function(
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

  isBilling() {
    let that = this;
    if (that.review.isBilling == "否") {
      that.invoiceType = "";
      that.Gename = "";
      that.Gname = "";
      that.DutyParagraph = "";
    }
  }
}
