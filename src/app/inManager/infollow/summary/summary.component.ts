import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzModalService } from "ng-zorro-antd";
import * as _ from 'underscore';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() id; // 老人id
  @Input() everydayComponent; // 每日跟进
  @Input() registerComponent; // 跟进登记
  status; // 跟进状态
  loading: boolean = false; //loading

  // 情况评估
  conditionAssessment = {
    // 老人id
    id:'',
    userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
    // 跟进状态
    status: '', // 0：未开始 1：进行中 2：已完成 3：未完成
    // 步行
    walk: [
      { label: "自理", value: "自理" },
      { label: "使用助行器", value: "使用助行器" },
      { label: "使用轮椅", value: "使用轮椅" },
      { label: "不能行走", value: "不能行走" }
    ],
    // 用餐
    meal: [
      { label: "自理", value: "自理" },
      { label: "部分帮助", value: "部分帮助" },
      { label: "完全帮助", value: "完全帮助" }
    ],
    // 穿脱衣
    coat: [
      { label: "自理", value: "自理" },
      { label: "部分帮助", value: "部分帮助" },
      { label: "完全帮助", value: "完全帮助" }
    ],
    // 排便
    shit: [
      { label: "自理", value: "自理" },
      { label: "部分帮助", value: "部分帮助" },
      { label: "完全帮助", value: "完全帮助" },
      { label: "失禁", value: "失禁" }
    ],
    // 思维能力
    think: [
      { label: "正常", value: "正常" },
      { label: "轻度障碍", value: "轻度障碍" },
      { label: "中度障碍", value: "中度障碍" },
      { label: "重度障碍", value: "重度障碍" },
      { label: "失能", value: "失能" }
    ],
    // 语言表达能力
    speak: [
      { label: "正常", value: "正常" },
      { label: "轻度障碍", value: "轻度障碍" },
      { label: "中度障碍", value: "中度障碍" },
      { label: "重度障碍", value: "重度障碍" },
      { label: "失能", value: "失能" }
    ],
    // 语言表达能力
    limbActive: [
      { label: "正常", value: "正常" },
      { label: "轻度障碍", value: "轻度障碍" },
      { label: "中度障碍", value: "中度障碍" },
      { label: "重度障碍", value: "重度障碍" },
      { label: "失能", value: "失能" }
    ],
    // 视力
    visual: [
      { label: "正常", value: "正常" },
      { label: "近视", value: "近视" },
      { label: "白内障", value: "白内障" },
      { label: "失明", value: "失明" }
    ],
    // 听力
    hear: [
      { label: "正常", value: "正常" },
      { label: "弱听", value: "弱听" },
      { label: "失聪", value: "失聪" }
    ],
    // 饮食
    diet: [
      { label: "普食", value: "普食" },
      { label: "半流质", value: "半流质" },
      { label: "流质", value: "流质" }
    ],
    // 备注
    remark:'',
    // 最终护理等级
    endCareLevel:'',
    // 措施
    proFood: "",
    activity: "",
    trait: "",
    measure:'',
    // 总结人
    operator:''
  }

  constructor(private message: NzMessageService,public httpReq: HttpReqService,private modalService: NzModalService) { }

  ngOnInit() {
    this.getSummary();
  }

  // 获取
  getSummary(){
    this.loading = true;
    this.httpReq.post('rtDwell/getSummarize',null,{id:this.id},data=>{
      if(data.code == 0){
        this.status = data["data"]["status"];
        this.conditionAssessment.endCareLevel = data["data"]["levelName"];
        let summarize = data["data"]["summarize"];
        if(_.isObject(summarize) && !_.isEmpty(summarize)){
          summarize["walk"] = JSON.parse(summarize["walk"]);
          summarize["meal"] = JSON.parse(summarize["meal"]);
          summarize["coat"] = JSON.parse(summarize["coat"]);
          summarize["shit"] = JSON.parse(summarize["shit"]);
          summarize["think"] = JSON.parse(summarize["think"]);
          summarize["speak"] = JSON.parse(summarize["speak"]);
          summarize["limbActive"] = JSON.parse(summarize["limbActive"]);
          summarize["visual"] = JSON.parse(summarize["visual"]);
          summarize["hear"] = JSON.parse(summarize["hear"]);
          summarize["diet"] = JSON.parse(summarize["diet"]);
          _.extend(this.conditionAssessment,summarize);
        }
      }
      this.loading = false;
    })
  }

  // 确认保存
  confirm(){
    let title:string;
    if(this.everydayComponent.tabs.every((item)=>{if(!item['id']) title = item['title']; return item['id'].length > 0})){
      this.saveForm();
    }else{
      this.modalService.confirm({
        nzTitle: `每日跟进中存在标签页“${title}”数据未保存，确认完成跟进将会丢失标签页“${title}”内容！`,
        nzOnOk: () => {
          this.saveForm();
          this.everydayComponent.tabs.pop(); // 删除没保存的tab
        }
      });
    }
  }

  // 保存
  saveForm(){
    this.conditionAssessment.id = this.id;
    this.loading = true;
    this.httpReq.post('rtDwell/saveSummarize',null,this.conditionAssessment,data=>{
      if(data.code == 0){
        this.message.success("保存成功！");
        this.getSummary();                       // 刷新跟进总结页
        this.everydayComponent.ngOnInit();       // 刷新每日跟进页
        this.registerComponent.ngOnInit();       // 刷新跟进登记页
      }
      this.loading = false;
    })
  }
}
