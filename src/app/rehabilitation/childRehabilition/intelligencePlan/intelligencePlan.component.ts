import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzModalService } from "ng-zorro-antd";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";
import { ImageUploadComponent } from "../../../common/imageupload/imageupload.component";
import { ElectronicSignComponent } from "src/app/common/electronicSign/electronicSign.component";
@Component({
  selector: "app-intelligencePlan",
  templateUrl: "./intelligencePlan.component.html",
  styleUrls: ["./intelligencePlan.component.css"]
})
export class IntelligencePlanComponent implements OnInit {
  @Input() name: any;
  @ViewChild("receiverSign")
  receiverSign: any;

  @ViewChild("operatorSign")
  operatorSign: any;

  @ViewChild("uploadImg")
  public uploadImg: ElectronicSignComponent;
  // 运动能力
  athleticAbility = [
    {
      label: "翻身",
      value: "翻身",
      checked: false
    },
    {
      label: "坐",
      value: "坐",
      checked: false
    },
    {
      label: "爬",
      value: "爬",
      checked: false
    },
    {
      label: "站",
      value: "站",
      checked: false
    },
    {
      label: "步行",
      value: "步行",
      checked: false
    },
    {
      label: "上下台阶",
      value: "上下台阶",
      checked: false
    },
    {
      label: "跑",
      value: "跑",
      checked: false
    },
    {
      label: "伸手取物",
      value: "伸手取物",
      checked: false
    },
    {
      label: "捏取",
      value: "捏取",
      checked: false
    },
    {
      label: "拧盖",
      value: "拧盖",
      checked: false
    },
    {
      label: "系扣子",
      value: "系扣子",
      checked: false
    },
    {
      label: "穿珠子",
      value: "穿珠子",
      checked: false
    },
    {
      label: "折纸",
      value: "折纸",
      checked: false
    }
  ];
  // 感知能力
  perception = [
    {
      label: "注视物体",
      value: "注视物体",
      checked: false
    },
    {
      label: "追视移动物体",
      value: "追视移动物体",
      checked: false
    },
    {
      label: "分辨味道",
      value: "分辨味道",
      checked: false
    },
    {
      label: "分辨气味",
      value: "分辨气味",
      checked: false
    },
    {
      label: "分辨常见生活环境声音",
      value: "分辨常见生活环境声音",
      checked: false
    },
    {
      label: "触觉分辨",
      value: "触觉分辨",
      checked: false
    }
  ];

  // 认知能力
  ability = [
    {
      label: "认识物体的存在",
      value: "认识物体的存在",
      checked: false
    },
    {
      label: "物品配对",
      value: "物品配对",
      checked: false
    },
    {
      label: "认识物体常见的关系",
      value: "认识物体常见的关系",
      checked: false
    },
    {
      label: "认识颜色",
      value: "认识颜色",
      checked: false
    },
    {
      label: "认识形状",
      value: "认识形状",
      checked: false
    },
    {
      label: "分辨有无",
      value: "分辨有无",
      checked: false
    },
    {
      label: "认识蔬菜、水果等食品",
      value: "认识蔬菜、水果等食品",
      checked: false
    },
    {
      label: "知道天气情况",
      value: "知道天气情况",
      checked: false
    },
    {
      label: "知道因果关系",
      value: "知道因果关系",
      checked: false
    },
    {
      label: "点数",
      value: "点数",
      checked: false
    },
    {
      label: "认识时间",
      value: "认识时间",
      checked: false
    },
    {
      label: "认识钱币",
      value: "认识钱币",
      checked: false
    }
  ];

  //语言交往能力
  language = [
    {
      label: "知道自己的名字",
      value: "知道自己的名字",
      checked: false
    },
    {
      label: "服从简单指令",
      value: "服从简单指令",
      checked: false
    },
    {
      label: "表达需求",
      value: "表达需求",
      checked: false
    },
    {
      label: "说简单的短句",
      value: "说简单的短句",
      checked: false
    },
    {
      label: "语言交流",
      value: "语言交流",
      checked: false
    },
    {
      label: "书写基本能力",
      value: "书写基本能力",
      checked: false
    }
  ];
  //生活自理能力：
  selfHelp = [
    {
      label: "拿着东西吃 □用餐具吃饭",
      value: "拿着东西吃 □用餐具吃饭",
      checked: false
    },
    {
      label: "用杯、碗喝水",
      value: "用杯、碗喝水",
      checked: false
    },
    {
      label: "小便自理",
      value: "小便自理",
      checked: false
    },
    {
      label: "大便自理",
      value: "大便自理",
      checked: false
    },
    {
      label: "脱衣物",
      value: "脱衣物",
      checked: false
    },
    {
      label: "穿衣物",
      value: "穿衣物"
    },
    {
      label: "穿鞋袜",
      value: "穿鞋袜",
      checked: false
    },
    {
      label: "刷牙",
      value: "刷牙",
      checked: false
    },
    {
      label: "洗脸",
      value: "洗脸",
      checked: false
    },
    {
      label: "洗手",
      value: "洗手",
      checked: false
    },
    {
      label: "洗脚",
      value: "洗脚",
      checked: false
    },
    {
      label: "盖被子",
      value: "盖被子",
      checked: false
    },
    {
      label: "叠被子",
      value: "叠被子",
      checked: false
    },
    {
      label: "认识家居环境",
      value: "认识家居环境",
      checked: false
    }
  ];

  //社会适应能力
  social = [
    {
      label: "知道自己",
      value: "知道自己",
      checked: false
    },
    {
      label: "认识熟悉的人",
      value: "认识熟悉的人",
      checked: false
    },
    {
      label: "认识家庭环境",
      value: "认识家庭环境",
      checked: false
    },
    {
      label: "知道居家安全",
      value: "知道居家安全",
      checked: false
    },
    {
      label: "认识公共设施",
      value: "认识公共设施",
      checked: false
    },
    {
      label: "参加集体活动",
      value: "参加集体活动",
      checked: false
    },
    {
      label: "懂得安全常识",
      value: "懂得安全常识",
      checked: false
    }
  ];

  // 训练场所
  trainingPlace = [
    {
      label: "区（县）级以上机构",
      value: "区（县）级以上机构",
      checked: false
    },
    {
      label: "社区康复站（点）",
      value: "社区康复站（点）",
      checked: false
    },
    {
      label: "家庭",
      value: "家庭",
      checked: false
    }
  ];

  trainingObj = {
    adaptSoAby: "", // (string, optional): 社会适应能力 ,
    childrenId: "", // (string, optional): 儿童id ,
    cognitiveAby: "", // (string, optional): 认知能力 ,
    id: "", // (string, optional): id ,
    languageAby: "", // (string, optional): 语言交往能力 ,
    lifeAby: "", // (string, optional): 生活自理能力 ,
    moveAby: "", // (string, optional): 运动能力 ,
    perceptionAby: "", // (string, optional): 感知能力 ,
    target1: "", // (string, optional): 运动能力改善 ,
    target2: "", // (string, optional): 感知能力 ,
    target3: "", // (string, optional): 认知能力 ,
    target4: "", // (string, optional): 语言交往能力 ,
    target5: "", // (string, optional): 生活自理能力 ,
    target6: "", // (string, optional): 社会适应能力 ,
    trainningPlace: "", // (string, optional): 训练地点

    childrenName: "", // (string, optional): 康复人员签名 ,
    parentName: "", // (string, optional): 家长签名
    time: "", // (string, optional): 制定计划日期 ,
    directMaterials1: "", // (string, optional): 训练指导材料 ,
    directMaterials2: "", // (string, optional): 训练指导材料 ,
    directMaterials3: "", // (string, optional): 训练指导材料 ,
    directMaterials4: "" // (string, optional): 训练指导材料 ,
  };

  isVisabled = false; //如果是康复档案点击进来的  全部显示不能点击
  isLoadingOne = false; //保存加载框
  operatorUrl; //签名
  receiverUrl; //签名
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.trainingObj.childrenId = this.name.id;
    const isTraining1 = this.name.isTraining1;
    if (this.name.check == "check") {
      this.isVisabled = true;
    } else {
      this.isVisabled = false;
    }

    if (isTraining1 == true) {
      const obj = {
        childrenId: "",
        menuType: "" //是康复档案还是儿童档案，1是康复档案，2是儿童档案
      };
      if (this.name.check == "check") {
        obj.menuType = "2";
      } else {
        obj.menuType = "1";
      }
      obj.childrenId = this.name.id;
      this.httpReq.get("/children/listIntelligenceTraining", obj, data => {
        if (data["code"] == 0) {
          this.trainingObj = data["data"];
          this.athleticAbility = JSON.parse(this.trainingObj.moveAby);
          this.perception = JSON.parse(this.trainingObj.perceptionAby);
          console.log(this.perception);
          this.ability = JSON.parse(this.trainingObj.cognitiveAby);
          this.language = JSON.parse(this.trainingObj.languageAby);
          this.selfHelp = JSON.parse(this.trainingObj.lifeAby);
          this.social = JSON.parse(this.trainingObj.adaptSoAby);
          this.trainingPlace = JSON.parse(this.trainingObj.trainningPlace);
        } else {
          this.message.error(data["message"]);
        }
      });
    }
  }

  // 保存训练计划
  saveDetails(operatorUrl, receiverUrl) {
    this.trainingObj.moveAby = JSON.stringify(this.athleticAbility);
    this.trainingObj.perceptionAby = JSON.stringify(this.perception);
    this.trainingObj.cognitiveAby = JSON.stringify(this.ability);
    this.trainingObj.languageAby = JSON.stringify(this.language);
    this.trainingObj.lifeAby = JSON.stringify(this.selfHelp);
    this.trainingObj.adaptSoAby = JSON.stringify(this.social);
    this.trainingObj.trainningPlace = JSON.stringify(this.trainingPlace);

    this.trainingObj.time = this.jsUtil.dateFormat(this.trainingObj.time);

    this.modalService.confirm({
      nzTitle: `确定保存训练计划？保存成功后请去康复档案中查看。`,
      nzOnOk: () => {
        this.isLoadingOne = true;
        this.httpReq.post(
          "/children/saveIntelligenceTraining",
          null,
          this.trainingObj,
          data => {
            this.isLoadingOne = false;
            if (data["code"] == 0) {
              this.message.success("保存成功");
              this.trainingObj.id = data["data"];
              history.back();
            } else {
              this.message.error(data["message"]);
            }
          }
        );
      }
    });
  }
}
