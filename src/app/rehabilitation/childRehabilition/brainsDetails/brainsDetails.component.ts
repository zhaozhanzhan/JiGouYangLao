import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { Utils } from "../../../common/utils/utils";
import { ImageUploadComponent } from "../../../common/imageupload/imageupload.component";
@Component({
  selector: "app-brainsDetails",
  templateUrl: "./brainsDetails.component.html",
  styleUrls: ["./brainsDetails.component.css"]
})
export class BrainsDetailsComponent implements OnInit {
  // 训练计划
  planList = [
    {
      name: "训练计划"
    }
  ];
  isLoadingOne = false;
  // 训练评估的数组
  assessArr = [
    {
      id: "",
      name: "第一季度",
      assessAthleticList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "翻身", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "爬", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "步行", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "上下台阶", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "跑", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "跳", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "推", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "端", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "抛", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "接", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "踢", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拍", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "伸手取物", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "捏取", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拧盖", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "叠积木", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿鞋带", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "系扣子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿珠子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "折纸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "连线", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仿画", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "涂色", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "剪纸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "贴纸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "81" // (integer, optional): 分数
        }
      ],
      perceptionList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "注视物体", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "追视移动物体", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨味道", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨气味", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨常见生活环境声音", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "触觉分辨", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "18" // (integer, optional): 分数
        }
      ],
      perceiveList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识物体的存在", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识自己的身体部位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识蔬菜、水果等食品", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识常见的动物", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识常见的物品", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "明白常见物品的用途", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "物品配对", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识物体常见的关系", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识基本颜色", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识多种颜色", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识方位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识基本形状", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识多种形状", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨有无", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨是不是", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道天气情况", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道季节", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道因果关系", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "点数", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识数字", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "回答加减法问题", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识时间", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识钱币", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "69" // (integer, optional): 分数
        }
      ],
      languageList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "模仿单音（韵母、声母）", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "模仿叠音词", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道自己的名字", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "服从简单指令", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出动作的名称", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出反义词", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出程度副词“最”", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出形容词短语", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出描述情绪的形容词", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出由数词、量词名词组成的短语", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表达需求", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说简单的短句", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "语言交流", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "书写基本能力", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "复述", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "45" // (integer, optional): 分数
        }
      ],
      oneselfList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拿着东西吃", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "用餐具吃饭", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "用杯、碗、喝水", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "小便自理", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "大便自理", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拉拉链", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "脱衣服", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "脱鞋袜", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿衣服", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿鞋袜", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "刷牙", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗脸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗手", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗脚", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "盖被子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "叠被子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识家居环境", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "51" // (integer, optional): 分数
        }
      ],
      societyList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道自己", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识熟悉的人", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分享", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "打招呼", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表示感谢", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表示抱歉", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表示称赞", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识家庭环境", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道居家安全", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识公共设施", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "参加集体活动", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "懂得安全常识", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "36" // (integer, optional): 分数
        }
      ],
      assessmentSummary: {
        athleticAbility: [
          {
            label: "继续训练",
            value: "继续训练"
          },
          {
            label: "接收教育",
            value: "接收教育"
          },
          {
            label: "家长培训",
            value: "家长培训"
          },
          {
            label: "心里辅导",
            value: "心里辅导"
          },
          {
            label: "知识普及",
            value: "知识普及"
          },
          {
            label: "改变环境，提供辅助",
            value: "改变环境，提供辅助"
          },
          {
            label: "参与社会生活或集体生活",
            value: "参与社会生活或集体生活"
          },
          {
            label: "其他",
            value: "其他"
          }
        ],
        obj: {
          adaptSoAby: "", // (string, optional): 社会适应能力 ,
          childrenId: "", //(string, optional): 儿童id ,
          cognitiveAby: "", //(string, optional): 认知能力 ,
          id: "", //(string, optional): id ,
          languageAby: "", //(string, optional): 语言交往能力 ,
          lifeAby: "", //(string, optional): 生活自理能力 ,
          moveAby: "", //(string, optional): 运动能力 ,
          perceptionAby: "", // (string, optional): 感知能力 ,
          rehabilitation: "", // (string, optional): 康复意见 ,
          type: "", // (string, optional): 智力残疾/肢体障碍
          referral: "", // (string, optional): 转介 ,
          time: "", // (string, optional): 时间 ,
          trainingName: "", //  (string, optional): 康复训练师签名 ,
          level: "", //等级
          name: ""
        }
      }
    }
  ];
  bigIndex: 0;
  index: 0; //初期评估中当前激活tab面板的序列号
  id; //给子组建传递ID

  // 保存表单参数
  saveTabObj = {
    assessType: "", //(string, optional): 评估类型 ,
    childrenAssessmentList: [], // (Array[ChildrenAssessmentData], optional),
    childrenId: "", // (string, optional): 儿童id ,
    id: "", //(string, optional): id ,
    level: "", //(string, optional): 1初级2中级往后推 ,
    type: "", //(string, optional): 康复类型,
    name: "" //评估名称
  };

  tab; //第几个评估表
  capacityTab; //评估表里面的哪个能力表
  sumScore; //总分数

  // 给智力训练计划传参
  traningInfo = {
    id: "",
    isTraining1: "",
    check: "",
    childrenId: ""
  };

  disabled = true;
  // 给评估与总结传参
  evaluationObj;
  isVisabled = false; //如果是康复档案点击进来的  全部显示不能点击

  brainsTableObj = {
    data: "",
    id: "",
    isAssessment1: "",
    check: ""
  };

  dataDetails; //传递的详细信息

  nameIsVisible = false; //是否显示让用户填写评估名称
  assessName; //评估名称
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private message: NzMessageService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id"); //获得传递过来的记录ID
    const isAssessment1 = this.route.snapshot.paramMap.get("isAssessment1"); //获得传递过来的初期评估是否保存 true表示保存
    const check = this.route.snapshot.paramMap.get("check"); //获得从康复档案中传递过来的查看字段

    if (check == "check") {
      this.traningInfo.check = check;

      this.isVisabled = true;
    } else {
      this.isVisabled = false;
    }
    const data = JSON.parse(this.route.snapshot.paramMap.get("data"));
    this.dataDetails = data;

    this.brainsTableObj.data = this.route.snapshot.paramMap.get("data");
    this.brainsTableObj.id = this.id;
    this.brainsTableObj.isAssessment1 = isAssessment1;
    this.brainsTableObj.check = check;

    this.evaluationObj = data;
    this.evaluationObj.type = "1";
    this.evaluationObj.check = check;

    this.traningInfo.id = data.id;
    this.traningInfo.isTraining1 = data.isTraining1;
    this.traningInfo.childrenId = data.id;
    if (isAssessment1 == "true") {
      this.disabled = false;
      const obj = {
        childrenId: "", //儿童id
        type: "1", //康复类型,
        menuType: "" //是康复档案还是儿童档案，1是康复档案，2是儿童档案
      };
      obj.childrenId = data.id;
      if (check == "check") {
        obj.menuType = "2";
      } else {
        obj.menuType = "1";
      }
      //如果评估保存过，调用初期评估详情
      this.httpReq.get("/children/listTab", obj, data => {
        if (data["code"] == 0) {
          this.assessArr = data["data"];

          this.assessArr.forEach(e => {
            if (e.assessmentSummary.obj.rehabilitation != "") {
              e.assessmentSummary.athleticAbility = JSON.parse(
                e.assessmentSummary.obj.rehabilitation
              );
            }
          });

          // 训练计划
          this.planList = [
            {
              name: "训练计划"
            }
          ];
        } else {
          this.message.error(data["message"]);
        }
      });
    }

    this.clickBigTab(1);
  }

  add() {
    this.nameIsVisible = true;
  }
  // 添加中期评估
  handleOk() {
    this.nameIsVisible = false;
    if (this.assessName == "") {
      this.message.error("名称不能为空！");
      return;
    }
    const obj = {
      id: "",
      name: "中期评估1",
      assessAthleticList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "翻身", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "爬", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "步行", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "上下台阶", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "跑", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "跳", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "推", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "端", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "抛", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "接", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "踢", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拍", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "伸手取物", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "捏取", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拧盖", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "叠积木", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿鞋带", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "系扣子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿珠子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "折纸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "连线", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仿画", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "涂色", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "剪纸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "贴纸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "81" // (integer, optional): 分数
        }
      ],
      perceptionList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "注视物体", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "追视移动物体", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨味道", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨气味", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨常见生活环境声音", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "触觉分辨", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "18" // (integer, optional): 分数
        }
      ],
      perceiveList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识物体的存在", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识自己的身体部位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识蔬菜、水果等食品", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识常见的动物", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识常见的物品", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "明白常见物品的用途", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "物品配对", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识物体常见的关系", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识基本颜色", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识多种颜色", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识方位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识基本形状", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识多种形状", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨有无", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分辨是不是", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道天气情况", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道季节", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道因果关系", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "点数", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识数字", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "回答加减法问题", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识时间", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识钱币", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "69" // (integer, optional): 分数
        }
      ],
      languageList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "模仿单音（韵母、声母）", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "模仿叠音词", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道自己的名字", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "服从简单指令", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出动作的名称", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出反义词", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出程度副词“最”", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出形容词短语", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出描述情绪的形容词", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说出由数词、量词名词组成的短语", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表达需求", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "说简单的短句", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "语言交流", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "书写基本能力", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "复述", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "45" // (integer, optional): 分数
        }
      ],
      oneselfList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拿着东西吃", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "用餐具吃饭", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "用杯、碗、喝水", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "小便自理", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "大便自理", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "拉拉链", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "脱衣服", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "脱鞋袜", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿衣服", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿鞋袜", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "刷牙", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗脸", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗手", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗脚", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "盖被子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "叠被子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识家居环境", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "51" // (integer, optional): 分数
        }
      ],
      societyList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道自己", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识熟悉的人", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "分享", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "打招呼", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表示感谢", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表示抱歉", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "表示称赞", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识家庭环境", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "知道居家安全", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "认识公共设施", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "参加集体活动", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "懂得安全常识", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "36" // (integer, optional): 分数
        }
      ],
      assessmentSummary: {
        athleticAbility: [
          {
            label: "继续训练",
            value: "继续训练"
          },
          {
            label: "接收教育",
            value: "接收教育"
          },
          {
            label: "家长培训",
            value: "家长培训"
          },
          {
            label: "心里辅导",
            value: "心里辅导"
          },
          {
            label: "知识普及",
            value: "知识普及"
          },
          {
            label: "改变环境，提供辅助",
            value: "改变环境，提供辅助"
          },
          {
            label: "参与社会生活或集体生活",
            value: "参与社会生活或集体生活"
          },
          {
            label: "其他",
            value: "其他"
          }
        ],
        obj: {
          adaptSoAby: "", // (string, optional): 社会适应能力 ,
          childrenId: "", //(string, optional): 儿童id ,
          cognitiveAby: "", //(string, optional): 认知能力 ,
          id: "", //(string, optional): id ,
          languageAby: "", //(string, optional): 语言交往能力 ,
          lifeAby: "", //(string, optional): 生活自理能力 ,
          moveAby: "", //(string, optional): 运动能力 ,
          perceptionAby: "", // (string, optional): 感知能力 ,
          rehabilitation: "", // (string, optional): 康复意见 ,
          type: "", // (string, optional): 智力残疾/肢体障碍
          referral: "", // (string, optional): 转介 ,
          time: "", // (string, optional): 时间 ,
          trainingName: "", //  (string, optional): 康复训练师签名 ,
          level: "", //等级
          name: ""
        }
      }
    };

    obj.name = this.assessName;
    this.assessArr.push(obj);
    this.planList = [
      {
        name: "训练计划"
      }
    ];
  }

  // 保存表单
  saveTabDetails(i) {
    this.saveTabObj.childrenId = this.id;
    this.saveTabObj.type = "1";
    this.saveTabObj.level = this.tab + "";
    this.saveTabObj.name = this.assessArr[i].name;
    this.saveTabObj.id = this.assessArr[i].id;
    if (this.capacityTab == 0) {
      this.saveTabObj.assessType = "运动能力";
      this.saveTabObj.childrenAssessmentList = this.assessArr[
        i
      ].assessAthleticList;
    } else if (this.capacityTab == 1) {
      this.saveTabObj.assessType = "感知能力";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].perceptionList;
    } else if (this.capacityTab == 2) {
      this.saveTabObj.assessType = "认知能力";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].perceiveList;
    } else if (this.capacityTab == 3) {
      this.saveTabObj.assessType = "语言交往能力";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].languageList;
    } else if (this.capacityTab == 4) {
      this.saveTabObj.assessType = "生活自理能力";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].oneselfList;
    } else if (this.capacityTab == 5) {
      this.saveTabObj.assessType = "社会适应能力";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].societyList;
    }

    this.isLoadingOne = true;
    this.httpReq.post(
      "/children/saveAssessment",
      null,
      this.saveTabObj,
      data => {
        this.isLoadingOne = false;
        if (data["code"] == 0) {
          this.message.success("保存成功");
          this.disabled = false;
          // this.index++;
          // window.scrollTo(0, 0); // 回到顶部
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }
  isLoading = false;
  // 保存评估和总结
  saveDetails(i) {
    this.assessArr[i].assessmentSummary.obj.level = this.tab + "";
    this.assessArr[i].assessmentSummary.obj.childrenId = this.dataDetails.id;
    this.assessArr[i].assessmentSummary.obj.type = this.dataDetails.type;
    this.assessArr[i].assessmentSummary.obj.rehabilitation = JSON.stringify(
      this.assessArr[i].assessmentSummary.athleticAbility
    );
    this.assessArr[i].assessmentSummary.obj.name = this.assessArr[i].name;
    this.assessArr[i].assessmentSummary.obj.time = this.jsUtil.dateFormat(
      this.assessArr[i].assessmentSummary.obj.time
    );
    if (this.assessArr[i].assessmentSummary.obj.time == "") {
      this.message.error("评估日期不能为空");
      return;
    }

    this.isLoading = true;
    this.httpReq.post(
      "/children/saveAssessmentSummary",
      null,
      this.assessArr[i].assessmentSummary.obj,
      data => {
        this.isLoading = false;
        if (data["code"] == 0) {
          this.message.success("保存成功");
          this.assessArr[i].assessmentSummary.obj.id = data["data"];
          this.disabled = false;
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 获得tab序列

  //index代表第几个评估表，e代表评估表里面的哪个能力表
  clickTab(e) {
    this.capacityTab = e;
  }

  clickBigTab(e) {
    this.tab = e;
    this.clickTab(0);
    this.getScore(0, 0);
  }

  // 获得分数
  getScore(index, i) {
    if (index == 0) {
      this.getSumScore(this.assessArr[i].assessAthleticList);
    } else if (index == 1) {
      this.getSumScore(this.assessArr[i].perceptionList);
    } else if (index == 2) {
      this.getSumScore(this.assessArr[i].perceiveList);
    } else if (index == 3) {
      this.getSumScore(this.assessArr[i].languageList);
    } else if (index == 4) {
      this.getSumScore(this.assessArr[i].oneselfList);
    } else if (index == 5) {
      this.getSumScore(this.assessArr[i].societyList);
    }
  }

  // 获得分数的公共方法
  getSumScore(arr) {
    this.sumScore = 0;
    for (let index = 0; index < arr.length; index++) {
      const e = arr[index];
      if (index < arr.length - 1) {
        this.sumScore = this.sumScore + parseInt(e.score);
      } else {
        this.sumScore = this.sumScore + 0;
      }
    }
    arr[arr.length - 1].score = this.sumScore;
  }
  // 返回
  back() {
    history.back();
  }
}
