import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { RegexpConfig } from "../../../common/service/GlobalConfig";
@Component({
  selector: "app-paid",
  templateUrl: "./paid.component.html",
  styleUrls: ["./paid.component.css"]
})
export class PaidComponent implements OnInit {
  oldid; // 带过来的老人id
  // 查询老人基本信息
  olderInfo = {
    name: "",
    sex: "",
    age: "",
    cardno: "",
    roomName: "",
    inDate: "",
    days: "",
    ConsumerRegistration: [] // 查询老人账目信息列表
  };
  // 查询老人账目信息列表

  // 后台获取账目列表
  accountList = [];
  // 选择缴存账目信息
  accountInfo;

  // 缴费方式
  payMode = [];

  // 新增缴存 弹框相关
  isVisibleAddModel = false;
  // 后台获取抵扣卷列表
  selCouponD = [];
  // 添加抵扣卷
  couponListD = [];

  // 后台获取补价卷列表
  selCouponB = [];
  // 添加补价卷
  couponListB = [];

  // 弹框提交所需
  modelForm = {
    id: null, // 老人id
    account: null, // 缴存账目
    depositAccountsId: null, // 缴存账目id
    methodPayment: null, // 支付方式
    capturePutsMoney: null, // 金额
    paymentPeople: null, // 缴款人姓名
    paymentTel: null, // 缴款人电话
    couponD: [], // 抵扣卷
    couponB: [], // 补价卷
    operator: JSON.parse(localStorage.getItem("UserInfo")).data.id // 操作人（当前登录id）
  };

  /* {
  "id":"老人ID",
  "depositAccountsId":"缴存账目id",
  "methodPayment":"支付方式",
  "capturePutsMoney":"缴存金额",
  "paymentPeople":"缴存人",
  "paymentTel":"缴存人电话"，
    couponD: [], // 抵扣卷
      couponB: [], // 补价卷
  "oldManVouchers": [{"rebateId":"抵扣券ID","rebateNum":"抵扣券数量","supplementCouponsNum":"增补券数量","supplementCouponsId":"增补券ID"}]} */

  // 二次确认筐
  isVisibleSubmitModel = false;
  submitOKLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.oldid = this.route.snapshot.paramMap.get("id");
    if (this.oldid) {
      this.modelForm.id = this.oldid;
      this.getInfo(this.oldid);
    }
    this.getAccountList();
    this.getPayMode();
    this.getcouponD();
    this.getcouponB();
  }

  // 新增弹框相关
  addaccount() {
    this.isVisibleAddModel = true;
  }
  addModalCancel() {
    this.isVisibleAddModel = false;
    this.clearForm();
  }
  addModalOk() {
    if (!this.modelForm.account) {
      this.message.error("请选择缴存账目！");
      return;
    }
    // if(!this.modelForm.methodPayment){
    //   this.message.error('请选择缴费方式！');
    //   return
    // }
    if (this.modelForm.capturePutsMoney <= 0) {
      this.message.error("请输入缴纳金额！");
      return;
    }
    if (!this.modelForm.paymentPeople) {
      this.message.error("请输入缴款人姓名！");
      return;
    }
    if (!this.modelForm.paymentTel) {
      this.message.error("请输入缴款人电话！");
      return;
    }
    if (this.couponListB.length) {
      this.modelForm.couponB = this.couponListB.filter(x => x.id);
    }
    if (this.couponListD.length) {
      this.modelForm.couponD = this.couponListD.filter(x => x.id);
    }
    try {
      this.modelForm.depositAccountsId = this.modelForm.account.id;
    } catch (error) {
      console.error(error);
    }
    console.error(this.modelForm);

    // 表格验证通过 跳出二次确认框
    this.isVisibleSubmitModel = true;
  }

  // 添加卷
  addCoupon(list) {
    if (this[list].some(x => !x.id)) {
      this.message.error("存在未选择优惠卷选项，请选择后再添加！");
      return;
    }
    this[list].push({
      num: 1,
      id: null
    });
  }
  // 删除卷
  delCoupen(list, index) {
    this[list].splice(index, 1);
  }

  // 清空弹框
  clearForm() {
    this.modelForm = {
      id: this.oldid, // 老人id
      account: null, // 缴存账目
      depositAccountsId: null, // 缴存账目id
      methodPayment: null, // 支付方式
      capturePutsMoney: null, // 金额
      paymentPeople: null, // 缴款人姓名
      paymentTel: null, // 缴款人电话
      couponD: [], // 抵扣卷
      couponB: [], // 补价卷
      operator: JSON.parse(localStorage.getItem("UserInfo")).data.id // 操作人（当前登录id）
    };
    this.couponListD = [];
    this.couponListB = [];
  }

  // 填入电话检测
  matchPhone(phone) {
    if (!RegexpConfig.mobile.test(phone)) {
      this.message.warning("温馨提示： 缴款人电话输入可能有误，请确认~");
    }
  }

  // 二次弹框
  submitModelCancel() {
    this.isVisibleSubmitModel = false;
  }
  async submitModelOk() {
    this.submitOKLoading = true;
    await this.submitForm();
    this.submitOKLoading = false;
    this.isVisibleSubmitModel = false;
    this.isVisibleAddModel = false;
    this.clearForm();
  }

  // 确认缴存
  submitForm() {
    return new Promise(resolve => {
      // console.error(this.modelForm);
      this.httpReq.post(
        "consumerRegistration/capturePuts",
        null,
        this.modelForm,
        res => {
          if (res.code === 0) {
            this.message.success("缴存成功！");
            this.getInfo(this.oldid);
          }
          resolve();
        }
      );
    });
  }

  // 获取老人基本信息
  getInfo(id) {
    this.httpReq.post("consumerRegistration/get", null, { id: id }, res => {
      if (res.code === 0) {
        this.olderInfo = res.data;
      }
    });
  }

  // 获取账目列表
  getAccountList() {
    this.httpReq.post("depositAccounts/listAll", null, null, res => {
      if (res.code === 0) {
        if (res.data instanceof Array && res.data.length) {
          this.accountList = res.data;
          this.accountInfo = this.accountList[0];
        }
      }
    });
  }

  // 获取支付类型
  getPayMode() {
    this.httpReq.post(
      "dictMgt/listDataByTypes",
      null,
      { dictTypes: "pay_type" },
      res => {
        if (res.code === 0) {
          if (res.data instanceof Array && res.data.length) {
            this.payMode = res.data[0].ddList;
          }
        }
      }
    );
  }

  // 获取抵扣卷
  getcouponD() {
    this.httpReq.post("Rebate/listAll", null, null, res => {
      if (res.code === 0) {
        if (res.data instanceof Array && res.data.length) {
          this.selCouponD = res.data;
        }
      }
    });
  }

  // 获取补价卷
  getcouponB() {
    this.httpReq.post("supplementCoupons/listAll", null, null, res => {
      if (res.code === 0) {
        if (res.data instanceof Array && res.data.length) {
          this.selCouponB = res.data;
        }
      }
    });
  }
}
