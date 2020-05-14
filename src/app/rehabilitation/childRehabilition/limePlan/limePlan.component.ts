import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import { ElectronicSignComponent } from "src/app/common/electronicSign/electronicSign.component";
@Component({
  selector: "app-limePlan",
  templateUrl: "./limePlan.component.html",
  styleUrls: ["./limePlan.component.css"]
})
export class LimePlanComponent implements OnInit {
  @Input() name: any;
  @ViewChild("receiverSign")
  receiverSign: any;

  @ViewChild("operatorSign")
  operatorSign: any;

  @ViewChild("uploadImg")
  public uploadImg: ElectronicSignComponent;
  athleticAbility = [
    {
      label: "头部控制",
      value: "头部控制",
      checked: false
    },
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
      label: "转移",
      value: "转移",
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
      label: "伸手抓物",
      value: "伸手抓物",
      checked: false
    },
    {
      label: "捏取物体",
      value: "捏取物体",
      checked: false
    },
    {
      label: "进食",
      value: "进食",
      checked: false
    },
    {
      label: "穿脱衣物",
      value: "穿脱衣物",
      checked: false
    },
    {
      label: "洗漱",
      value: "洗漱",
      checked: false
    },
    {
      label: "入厕",
      value: "入厕",
      checked: false
    }
  ];

  methods = [
    {
      label: "运动疗法",
      value: "运动疗法",
      checked: false
    },
    {
      label: "作业疗法",
      value: "作业疗法",
      checked: false
    },
    {
      label: "语言疗法",
      value: "语言疗法",
      checked: false
    },
    {
      label: "理疗辅助",
      value: "理疗辅助",
      checked: false
    },
    {
      label: "使用辅助器具",
      value: "使用辅助器具",
      checked: false
    },
    {
      label: "参与社会生活或集体活动",
      value: "参与社会生活或集体活动",
      checked: false
    }
  ];

  trainingObj = {
    childrenId: "", // (string, optional): 儿童id ,
    childrenName: "", // (string, optional): 康复人员签名 ,
    directMaterials1: "", // (string, optional): 训练指导材料 ,
    directMaterials2: "", // (string, optional): 训练指导材料 ,
    directMaterials3: "", //:"",// (string, optional): 训练指导材料 ,
    directMaterials4: "", // (string, optional): 训练指导材料 ,
    id: "", //(string, optional): id ,
    parentName: "", // (string, optional): 家长签名 ,
    rehabilitationMethod: "", // (string, optional): 康复方法 ,
    target: "", // (string, optional): 目标 ,
    time: "", // (string, optional): 制定计划日期 ,
    trainningPlace: "", // (string, optional): 训练地点 ,
    trainningProject: "" // (string, optional): 训练项目
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
    const isTraining2 = this.name.isTraining2;
    if (this.name.check == "check") {
      this.isVisabled = true;
    } else {
      this.isVisabled = false;
    }
    if (isTraining2 == true) {
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
      this.httpReq.get("/children/listBodyTraining", obj, data => {
        if (data["code"] == 0) {
          this.trainingObj = data["data"];

          this.athleticAbility = JSON.parse(this.trainingObj.trainningProject);
          this.methods = JSON.parse(this.trainingObj.rehabilitationMethod);
        } else {
          this.message.error(data["message"]);
        }
      });
    }
  }

  // 保存训练计划
  saveDetails() {
    this.trainingObj.trainningProject = JSON.stringify(this.athleticAbility);
    this.trainingObj.rehabilitationMethod = JSON.stringify(this.methods);
    this.trainingObj.time = this.jsUtil.dateFormat(this.trainingObj.time);

    this.modalService.confirm({
      nzTitle: `确定保存训练计划？保存成功后请去康复档案中查看。`,
      nzOnOk: () => {
        this.isLoadingOne = true;
        this.httpReq.post(
          "/children/saveBodyTraining",
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
