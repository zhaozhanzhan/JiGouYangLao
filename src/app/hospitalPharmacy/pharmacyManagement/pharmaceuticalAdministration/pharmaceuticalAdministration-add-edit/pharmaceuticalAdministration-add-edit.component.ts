import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { ActivatedRoute } from "@angular/router";
import { GlobalMethod } from "../../../../common/service/GlobalMethod";

@Component({
  selector: "app-pharmaceuticalAdministration-add-edit",
  templateUrl: "./pharmaceuticalAdministration-add-edit.component.html",
  styleUrls: ["./pharmaceuticalAdministration-add-edit.component.css"]
})
export class PharmaceuticalAdministrationAddEditComponent implements OnInit {
  public validateForm: FormGroup; // 基本信息定义表单对象
  user; //用户的详情信息
  goodsClassificationNodes; //部门的节点
  departmentId;
  isBtnLoading;

  isShowDialog = false; //选择剂型显示弹出框
  showlimitLevel = true; //当时otc时判断限制等级显示
  drugList = []; //药品列表
  // 剂型类型数据
  dosageList = [
    {
      name: "片剂",
      dosageNameList: [
        {
          name: "肠溶片"
        },
        {
          name: "包衣片"
        },
        {
          name: "薄膜衣片"
        },
        {
          name: "糖衣片"
        },
        {
          name: "浸膏片"
        },
        {
          name: "分散片"
        },
        {
          name: "划痕片"
        },
        {
          name: "缓释片"
        },
        {
          name: "缓释包衣片"
        },
        {
          name: "控释片"
        }
      ]
    },
    {
      name: "胶囊剂",
      dosageNameList: [
        {
          name: "硬胶囊"
        },
        {
          name: "软胶囊（胶丸）"
        },
        {
          name: "肠溶胶囊"
        },
        {
          name: "缓释胶囊"
        },
        {
          name: "控释胶囊"
        }
      ]
    },
    {
      name: "口服酊膏剂",
      dosageNameList: [
        {
          name: "口服溶液剂"
        },
        {
          name: "口服混悬剂"
        },
        {
          name: "口服乳剂"
        },
        {
          name: "胶浆剂"
        },
        {
          name: "口服液"
        },
        {
          name: "乳液"
        },
        {
          name: "乳剂"
        },
        {
          name: "胶体溶液"
        },
        {
          name: "合剂"
        },
        {
          name: "酊剂"
        },
        {
          name: "滴剂"
        },
        {
          name: "混悬滴剂"
        }
      ]
    },
    {
      name: "口服丸剂",
      dosageNameList: [
        {
          name: "丸剂"
        },
        {
          name: "大丸剂"
        },
        {
          name: "滴丸"
        },
        {
          name: "蜜丸"
        }
      ]
    },
    {
      name: "口服颗粒、粉、散剂",
      dosageNameList: [
        {
          name: "颗粒剂"
        },
        {
          name: "肠溶颗粒剂"
        },
        {
          name: "干混悬剂"
        },
        {
          name: "吸入性粉剂"
        },
        {
          name: "干粉剂"
        },
        {
          name: "干粉吸入剂"
        },
        {
          name: "粉末吸入剂"
        },
        {
          name: "干粉吸剂"
        },
        {
          name: "散剂"
        },
        {
          name: "药粉"
        },
        {
          name: "粉剂"
        }
      ]
    },
    {
      name: "外用酊、膏、贴、粉剂",
      dosageNameList: [
        {
          name: "软膏剂"
        },
        {
          name: "乳膏剂"
        },
        {
          name: "霜剂"
        },
        {
          name: "糊剂"
        },
        {
          name: "油膏剂"
        },
        {
          name: "硬膏剂"
        },
        {
          name: "亲水硬膏剂"
        },
        {
          name: "乳胶剂"
        },
        {
          name: "凝胶剂"
        },
        {
          name: "贴剂"
        },
        {
          name: "贴膏剂"
        },
        {
          name: "膜剂"
        },
        {
          name: "透皮贴剂"
        },
        {
          name: "滴眼剂"
        },
        {
          name: "滴眼液"
        },
        {
          name: "滴耳剂"
        },
        {
          name: "滴耳液"
        },
        {
          name: "滴鼻剂"
        },
        {
          name: "滴鼻液"
        },
        {
          name: "散剂"
        },
        {
          name: "粉剂"
        },
        {
          name: "撒布剂"
        },
        {
          name: "撒粉"
        }
      ]
    },
    {
      name: "外用涂剂、栓剂",
      dosageNameList: [
        {
          name: "栓剂"
        },
        {
          name: "肛门栓"
        },
        {
          name: "阴道栓"
        },
        {
          name: "涂剂"
        },
        {
          name: "涂膜剂"
        },
        {
          name: "涂布剂"
        }
      ]
    },
    {
      name: "注射剂",
      dosageNameList: [
        {
          name: "注射剂"
        },
        {
          name: "注射液"
        },
        {
          name: "注射用溶液剂"
        },
        {
          name: "静脉滴注用注射液"
        },
        {
          name: "注射用混悬液"
        },
        {
          name: "注射用无菌粉末"
        },
        {
          name: "静脉注射针剂"
        },
        {
          name: "水针"
        },
        {
          name: "注射用乳剂"
        },
        {
          name: "粉针剂"
        },
        {
          name: "针剂"
        },
        {
          name: "无菌粉针"
        },
        {
          name: "冻干粉针"
        }
      ]
    },
    {
      name: "兴奋剂",
      dosageNameList: [
        {
          name:
            "含罂粟、麝香、麻黄类药品及激素类药品、国家下发的兴奋剂药品、蛋白同化制剂药品"
        }
      ]
    },
    {
      name: "麻黄碱制剂",
      dosageNameList: [
        {
          name: "含复方麻黄碱制剂类药品"
        }
      ]
    }
  ];
  constructor(
    private httpReq: HttpReqService, //数据请求
    private fb: FormBuilder, // 响应式表单,
    private localStorage: LocalStorage, //存储
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private msg: NzMessageService, // 消息提醒
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [""], //"药品id",
      drugName: ["", [Validators.required]], //"药品名称",
      commonName: ["", [Validators.required]], //"通用名",
      manufacturers: [""], //"生产厂商",
      specification: [""], //"药品规格",
      minPackingUnit: ["", [Validators.required]], //"最小包装单位",
      minPackingQuantity: ["", [Validators.required]], //"最小包装数量",
      salePrice: [""], //"售价",
      largePackingUnit: ["", [Validators.required]], //"大包装单位",
      drugType: ["", [Validators.required]], //"药品类型 0:西药 1:中成药 2:自制剂 3:其他",
      dosageForm: ["", [Validators.required]], //"剂型",
      isOtc: ["", [Validators.required]], //"是否OTC",
      drugUsage: [""], //"用法",
      limitLevel: ["", [Validators.required]], //"限制等级",
      comment: [""], //"备注",
      accountId: [""] //"账户Id"
    });

    // 当是修改时
    let data = this.route.snapshot.paramMap.get("data");
    if (data) {
      GlobalMethod.setForm(this.validateForm, JSON.parse(data)); // 表单赋值
    }

    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.validateForm.patchValue({
      accountId: this.user.data.id
    });
    this.getAllDataDictionary();
  }
  // 返回
  back() {
    history.back();
  }
  unitList = []; //单位
  dosageFormList = []; //剂型
  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "dictionaryMedicationData/dataListAllTwo",
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

  saveForm() {
    const that = this;
    const formDataCtrl = this.validateForm.controls;
    const formData = this.jsUtil.deepClone(this.validateForm.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid) {
      // 表单较验未通过
      return;
    }
    that.isBtnLoading = true;
    this.httpReq.post("/med_drug/saveOrUpdate", null, formData, data => {
      that.isBtnLoading = false;
      if (data["code"] == 0) {
        that.msg.success("保存成功！");
        this.back();
      } else {
        that.msg.error(data["message"]);
      }
    });
  }

  // 点击剂型时弹出选择剂型
  chooseDosageForm() {
    this.isShowDialog = true;
  }

  //点击剂型名称时
  chooseName(name: string) {
    // 选择剂型
    this.validateForm.patchValue({
      dosageForm: name
    });
    this.isShowDialog = false;
  }
  // 关闭剂型弹出框
  close() {
    this.isShowDialog = false;
  }

  // 当选择是否otc变化时
  chooseIsOtc() {
    if (this.validateForm.get("isOtc").value == "1") {
      this.showlimitLevel = false;
    } else {
      this.showlimitLevel = true;
    }
  }

  isDrug = false; //显示药品名称的弹出框
  drugObj = {
    search: "", //搜索
    page: 0, //"页码",
    size: 10 // "每页数量","search": "搜索"
  };
  page = {
    total: 0,
    size: 10,
    index: 1
  };
  // 选择药品时
  chooseDrug() {
    this.isDrug = true;
    this.getDrug();
  }

  // 获得所有的药品名称
  getDrug(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.drugObj.page = this.page.index - 1;
    this.drugObj.size = this.page.size;

    // 药品名称
    this.httpReq.post("/drugs/list", null, this.drugObj, data => {
      if (data["code"] == 0) {
        this.drugList = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      } else {
        this.msg.error(data["message"]);
      }
    });
  }

  //选择药品名称时
  drugDetails(data) {
    this.validateForm.patchValue({ drugName: data.name });
    this.validateForm.patchValue({ commonName: data.name });
    this.isDrug = false;
  }
}
