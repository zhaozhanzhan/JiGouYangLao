import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.css"]
})
export class CheckComponent implements OnInit {
  isLoadingData = false;
  review;
  memo;
  reviewId;
  nursingGradeList = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService // Http请求服务
  ) {}

  ngOnInit() {
    this.review = {};
    this.memo = {};
    let oldmanId = this.route.snapshot.paramMap.get("id");
    if (oldmanId) {
      this.isLoadingData = true;
      let that = this;
      that.httpReq.post(
        "/oldMemo/findByOldman",
        null,
        { oldman_id: oldmanId },
        function(data) {
          that.isLoadingData = false;
          if (data["status"] == 200) {
            if (data["code"] == 0) {
              that.review = JSON.parse(data["data"]);
              if (that.review.isBilling == true) {
                that.review.isBilling = "是";
              } else {
                that.review.isBilling = "否";
              }
              console.log(that.review.memo);
              if (that.review.memo != "") {
                that.review.memo = JSON.parse(that.review.memo);
                console.log(that.review.memo + typeof that.review.memo);
                that.review.invoiceType = that.review.memo.invoiceType;
                that.review.Gename = that.review.memo.Gename;
                that.review.Gname = that.review.memo.Gname;
                that.review.DutyParagraph = that.review.memo.DutyParagraph;
              } else {
                that.review.invoiceType = "";
                that.review.Gename = "";
                that.review.Gname = "";
                that.review.DutyParagraph = "";
              }
            }
          }
        }
      );
    }
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
}
