import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { ImageUploadComponent } from "../../../common/imageupload/imageupload.component";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { Utils } from "../../../common/utils/utils";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, Input, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
@Component({
  selector: "app-limeDetails",
  templateUrl: "./limeDetails.component.html",
  styleUrls: ["./limeDetails.component.css"]
})
export class LimeDetailsComponent implements OnInit {
  // 训练计划
  planList = [
    {
      name: "训练计划"
    }
  ];
  // 训练计划
  disabled = true;
  // 训练评估的数组
  assessArr = [
    {
      id: "",
      name: "第一季度",
      assessAthleticList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "51" // (integer, optional): 分数
        }
      ],
      // 坐位
      perceptionList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "仰卧位：检查者握孩子双手，拉自己到坐位，头部控制好（头与脊柱成直线或稍向前倾）", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位：向右侧翻身，坐起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位：向左侧翻身，坐起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：检查者支撑孩子胸部，头部竖直保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：检查者支撑孩子胸部，头正中位保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "用上肢支撑坐于垫子上，保持5秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：没有上肢支撑保持坐位3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "坐于垫子上：前面放置小玩具，身体前倾触摸玩具，没有上肢支持返回直立坐位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：触摸右后方45度放置的玩具，返回开始姿势", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：触摸左后方45度放置的玩具，返回开始姿势", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "右侧横坐：没有上肢支持保持5秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "左侧横坐：没有上肢支持保持5秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },

        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：有控制地降低身体成俯卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "足向前坐于垫子上：身体向右侧旋转成四点支撑位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "足向前坐于垫子上：身体向左侧旋转成四点支撑位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：不使用上肢帮助旋转90度", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于凳上：上肢及双足不支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：落坐小凳子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "从地面：坐落小凳子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "从地面：落坐大椅子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "60" // (integer, optional): 分数
        }
      ],
      // 爬与跪
      perceiveList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "俯卧位：向前方腹爬1.8米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点支持位：用手与膝支撑身体10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：不用上肢支撑成坐位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "俯卧位：成四点位，手和膝承重", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：右上肢向前伸出，手的位置高于肩部", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：左上肢向前伸出，手的位置高于肩部", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：向前四点爬或蛙跳1.8米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：向前交替性四点爬1.8米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：用手和膝/脚爬上四级台阶", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：用手和膝/脚退着爬下四级台阶", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "坐垫子上：先使用上肢帮助孩子成高跪位，然后不用上肢支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "高跪位：先使用上肢帮助成右膝半跪位，然后不用上肢支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            " 跪立位：先使用上肢帮助成左膝半跪位，然后不用上肢支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "高跪位：不用上肢支撑向前跪走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "42" // (integer, optional): 分数
        }
      ],
      // 站立位
      languageList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "地面：抓着大凳子拉自己站起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：不用上肢支持保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：单手抓住大凳子，抬起右脚，保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：单手抓住椅子，抬起左脚，保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：不用上肢支持保持20秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：抬起左脚，不用上肢支持保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：抬起右脚，不用上肢支持保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐在小凳子上：不用上肢帮助站起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "高跪位：通过右侧半跪位站起，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "高跪位：通过左侧半跪位站起，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：有控制地降低身体坐到地面，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：成蹲位，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：不用上肢帮助，从地面拾物再返回成站立位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "39" // (integer, optional): 分数
        }
      ],
      // 行走、跑、跳
      oneselfList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两手扶大长凳，向右侧横走5步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两手扶大长凳，向右侧横走5步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：牵两手向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：牵单手向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：向前走10步，停止，转180度，返回", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：后退10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两手提大物向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：在20厘米间隔的平行线之间连续向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：在2厘米宽的直线上连续向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：右脚领先跨越膝盖高度的木棒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：左脚领先跨越膝盖高度的木棒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：跑4。5米，停止，返回", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：右脚踢球", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：左脚踢球", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两脚同时跳高30厘米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两脚同时跳高30厘米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两脚同时跳远30厘米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "右脚单立：60厘米直径的圆内，右脚跳10次", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "左脚单立：60厘米直径的圆内，左脚跳10次", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，抓着扶手：上四级台阶，抓一侧扶手，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，抓着扶手：下四级台阶，抓一侧扶手，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，上四级台阶，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，下四级台阶，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站在15厘米高的台阶上：两足同时跳下", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "75" // (integer, optional): 分数
        }
      ],
      societyList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "进食", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗澡", // (string, optional): 项目名 ,
          score: "5" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "修饰", // (string, optional): 项目名 ,
          score: "5" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿衣", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "控制大便", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "控制小便", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "如厕", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "床椅转移", // (string, optional): 项目名 ,
          score: "15" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "平地行走", // (string, optional): 项目名 ,
          score: "15" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "上下楼梯", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "100" // (integer, optional): 分数
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
          level: "", //等级，
          name: "" //名字
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
    type: "", //(string, optional): 康复类型
    name: "" //(string, optional): 评估名称
  };

  tab; //第几个评估表
  capacityTab; //评估表里面的哪个能力表
  sumScore; //总分数

  // 给智力训练计划传参
  traningInfo = {
    id: "",
    isTraining2: "",
    check: "",
    childrenId: ""
  };
  isVisabled = false; //如果是康复档案点击进来的  全部显示不能点击
  // 给评估与总结传参
  evaluationObj;
  isLoadingOne = false;
  dataDetails;

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
    const isAssessment2 = this.route.snapshot.paramMap.get("isAssessment2"); //获得传递过来的初期评估是否保存 true表示保存
    const check = this.route.snapshot.paramMap.get("check"); //获得从康复档案中传递过来的查看字段
    if (check == "check") {
      this.traningInfo.check = check;
      this.isVisabled = true;
    } else {
      this.isVisabled = false;
    }

    const data = JSON.parse(this.route.snapshot.paramMap.get("data"));
    this.dataDetails = data;
    this.evaluationObj = data;
    this.evaluationObj.type = "2";
    this.evaluationObj.check = check;
    this.traningInfo.id = data.id;
    this.traningInfo.isTraining2 = data.isTraining2;
    this.traningInfo.childrenId = data.childrenId;

    if (isAssessment2 == "true") {
      this.disabled = false;
      const obj = {
        childrenId: "", //儿童id
        type: "2", //康复类型
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
      name: "中期评估",
      assessAthleticList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "51" // (integer, optional): 分数
        }
      ],
      // 坐位
      perceptionList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "仰卧位：检查者握孩子双手，拉自己到坐位，头部控制好（头与脊柱成直线或稍向前倾）", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位：向右侧翻身，坐起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "仰卧位：向左侧翻身，坐起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：检查者支撑孩子胸部，头部竖直保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：检查者支撑孩子胸部，头正中位保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "用上肢支撑坐于垫子上，保持5秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：没有上肢支撑保持坐位3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "坐于垫子上：前面放置小玩具，身体前倾触摸玩具，没有上肢支持返回直立坐位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：触摸右后方45度放置的玩具，返回开始姿势", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：触摸左后方45度放置的玩具，返回开始姿势", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "右侧横坐：没有上肢支持保持5秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "左侧横坐：没有上肢支持保持5秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },

        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：有控制地降低身体成俯卧位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "足向前坐于垫子上：身体向右侧旋转成四点支撑位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "足向前坐于垫子上：身体向左侧旋转成四点支撑位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于垫子上：不使用上肢帮助旋转90度", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐于凳上：上肢及双足不支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：落坐小凳子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "从地面：坐落小凳子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "从地面：落坐大椅子", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "60" // (integer, optional): 分数
        }
      ],
      // 爬与跪
      perceiveList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "俯卧位：向前方腹爬1.8米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点支持位：用手与膝支撑身体10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：不用上肢支撑成坐位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "俯卧位：成四点位，手和膝承重", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：右上肢向前伸出，手的位置高于肩部", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：左上肢向前伸出，手的位置高于肩部", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：向前四点爬或蛙跳1.8米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：向前交替性四点爬1.8米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：用手和膝/脚爬上四级台阶", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "四点位：用手和膝/脚退着爬下四级台阶", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "坐垫子上：先使用上肢帮助孩子成高跪位，然后不用上肢支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            "高跪位：先使用上肢帮助成右膝半跪位，然后不用上肢支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName:
            " 跪立位：先使用上肢帮助成左膝半跪位，然后不用上肢支撑保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "高跪位：不用上肢支撑向前跪走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "42" // (integer, optional): 分数
        }
      ],
      // 站立位
      languageList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "地面：抓着大凳子拉自己站起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：不用上肢支持保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：单手抓住大凳子，抬起右脚，保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：单手抓住椅子，抬起左脚，保持3秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：不用上肢支持保持20秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：抬起左脚，不用上肢支持保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：抬起右脚，不用上肢支持保持10秒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "坐在小凳子上：不用上肢帮助站起", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "高跪位：通过右侧半跪位站起，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "高跪位：通过左侧半跪位站起，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：有控制地降低身体坐到地面，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：成蹲位，不用上肢帮助", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立位：不用上肢帮助，从地面拾物再返回成站立位", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "39" // (integer, optional): 分数
        }
      ],
      // 行走、跑、跳
      oneselfList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两手扶大长凳，向右侧横走5步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两手扶大长凳，向右侧横走5步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：牵两手向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：牵单手向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：向前走10步，停止，转180度，返回", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：后退10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两手提大物向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：在20厘米间隔的平行线之间连续向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：在2厘米宽的直线上连续向前走10步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：右脚领先跨越膝盖高度的木棒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：左脚领先跨越膝盖高度的木棒", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：跑4。5米，停止，返回", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：右脚踢球", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：左脚踢球", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两脚同时跳高30厘米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两脚同时跳高30厘米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立：两脚同时跳远30厘米", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "右脚单立：60厘米直径的圆内，右脚跳10次", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "左脚单立：60厘米直径的圆内，左脚跳10次", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，抓着扶手：上四级台阶，抓一侧扶手，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，抓着扶手：下四级台阶，抓一侧扶手，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，上四级台阶，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站立，下四级台阶，交替出步", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "站在15厘米高的台阶上：两足同时跳下", // (string, optional): 项目名 ,
          score: "3" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "75" // (integer, optional): 分数
        }
      ],
      societyList: [
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "进食", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "洗澡", // (string, optional): 项目名 ,
          score: "5" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "修饰", // (string, optional): 项目名 ,
          score: "5" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "穿衣", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "控制大便", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "控制小便", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "如厕", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "床椅转移", // (string, optional): 项目名 ,
          score: "15" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "平地行走", // (string, optional): 项目名 ,
          score: "15" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "上下楼梯", // (string, optional): 项目名 ,
          score: "10" // (integer, optional): 分数
        },
        {
          assessmentId: "", //评估id ,
          id: "", // (string, optional): id ,
          projectName: "总分", // (string, optional): 项目名 ,
          score: "100" // (integer, optional): 分数
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
          level: "", //等级，
          name: "" //名字
        }
      }
    };

    obj.name = this.assessName;
    this.assessArr.push(obj);
    // 训练计划
    this.planList = [
      {
        name: "训练计划"
      }
    ];
  }

  // 保存表单
  saveTabDetails(i) {
    const that = this;
    this.saveTabObj.childrenId = this.id;
    this.saveTabObj.type = "2";

    this.saveTabObj.level = this.tab + "";
    this.saveTabObj.name = this.assessArr[i].name;
    this.saveTabObj.id = this.assessArr[i].id;
    if (this.capacityTab == 0) {
      this.saveTabObj.assessType = "卧位与翻身";
      this.saveTabObj.childrenAssessmentList = this.assessArr[
        i
      ].assessAthleticList;
    } else if (this.capacityTab == 1) {
      this.saveTabObj.assessType = "坐位";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].perceptionList;
    } else if (this.capacityTab == 2) {
      this.saveTabObj.assessType = "爬与跪";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].perceiveList;
    } else if (this.capacityTab == 3) {
      this.saveTabObj.assessType = "站立位";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].languageList;
    } else if (this.capacityTab == 4) {
      this.saveTabObj.assessType = "行走、跑、跳";
      this.saveTabObj.childrenAssessmentList = this.assessArr[i].oneselfList;
    } else if (this.capacityTab == 5) {
      this.saveTabObj.assessType = "Barthel指数";
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
          this.index++;
          window.scrollTo(0, 0); // 回到顶部
          that.message.success("保存成功");
          this.disabled = false;
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
    console.log(this.assessArr[i]);
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
