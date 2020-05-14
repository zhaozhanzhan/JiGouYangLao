import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-take-medicine-record',
  templateUrl: './take-medicine-record.component.html',
  styleUrls: ['./take-medicine-record.component.css']
})
export class TakeMedicineRecordComponent implements OnInit {

  constructor() { }


  // 情况评估
  conditionAssessment = {
    // 老人id
    id:'',
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
    measure:'',
    // 总结人
    operator:''
  }















  // 每日观察对象
  dailyObserve = {
    bloodPressure: '', // 血压
    bodyTemperature: '', // 体温
    pulse: '', // 脉搏
    // 小便
    peeML: '', // 尿量
    dayTimes: '', // 白天次数
    nightTimes: '', // 夜间次数
    peeCheck: [ // 多选项
      { label: "失禁或需要导尿", value: "失禁或需要导尿" },
      { label: "偶尔失禁（<1次/24小时，>1次/周）", value: "偶尔失禁（<1次/24小时，>1次/周）" },
      { label: "能够便后冲洗或整理衣裤或夜间用便桶或尿壶", value: "能够便后冲洗或整理衣裤或夜间用便桶或尿壶" },
      { label: "能够排泄后能自洁及整理衣裤", value: "能够排泄后能自洁及整理衣裤" },
      { label: "需借助辅助器进出厕所", value: "需借助辅助器进出厕所" },
      { label: "需定时如厕或指示", value: "需定时如厕或指示" }
    ],
    // 大便
    shitTimes: '', // 大便次数
    shitCheck:[ // 多选项
      { label: "失禁", value: "失禁" },
      { label: "偶尔失禁（<1次/24小时，>1次/周）", value: "偶尔失禁（<1次/24小时，>1次/周）" },
      { label: "便秘有", value: "便秘有" }
    ],
    // 行动
    action: [
      { label: "自如", value: "自如" },
      { label: "搀扶", value: "搀扶" },
      { label: "依靠拐杖助行器", value: "依靠拐杖助行器" },
      { label: "轮椅", value: "轮椅" },
      { label: "完全卧床", value: "完全卧床" },
      { label: "大多时间卧床", value: "大多时间卧床" },
      { label: "2小时翻身", value: "2小时翻身" }
    ],
    // 饮食
      // 进食能力
    eatfood: [
      { label: "独自完成", value: "独自完成" },
      { label: "协助", value: "协助" },
      { label: "送床前", value: "送床前" },
      { label: "喂饭", value: "喂饭" },
      { label: "鼻饲", value: "鼻饲" }
    ],
      // 主食
    mainfood: '',
      // 菜
    foodlist: '',
      // 口味
    flavor: [
      { label: "偏咸", value: "偏咸" },
      { label: "偏淡", value: "偏淡" },
      { label: "偏甜", value: "偏甜" },
      { label: "偏软", value: "偏软" },
      { label: "偏辣", value: "偏辣" }
    ],
      // 治疗饮食
    treatfood:[
      { label: "低盐", value: "低盐" },
      { label: "低蛋白", value: "低蛋白" },
      { label: "低脂", value: "低脂" },
      { label: "高热量", value: "高热量" },
      { label: "糖尿病", value: "糖尿病" }
    ],
      // 喜欢食物
    likefood: '',
      // 不喜欢食物
    dislikefood: '',
      // 过敏食物
    allergyfood: '',
      // 禁忌食物
    prohibitfood: '',
      // 喜欢吃零食
    likesnack: '',
      // 其他
    otherfood: '',
    // 饮水
    cups: '', // 每天几杯
    beverage: [ // 饮品种类
      { label: "白开水", value: "白开水" },
      { label: "绿茶", value: "绿茶" },
      { label: "红茶", value: "红茶" },
      { label: "咖啡", value: "咖啡" },
      { label: "其他", value: "其他" }
    ],
    othertea: '', // 其他茶水
    // 睡眠
    sleepState: [
      { label: "正常", value: "正常" },
      { label: "需要服药", value: "需要服药" },
      { label: "床档辅助", value: "床档辅助" },
      { label: "安全带辅助", value: "安全带辅助" }
    ],
    // 起床时间
    getupTimeHour: '', // 时
    getupTimeMinute: '', // 分
    // 午睡
    nap: '', // 有无午睡
    snaph: '', // 开始午睡时
    enaph: '', // 结束午睡时
    snapm: '', // 开始午睡分
    enapm: '', // 结束午睡分
    napstate: '', // 午睡质量
    sleepTimeh: '', // 就寝时
    sleepTimem: '', // 就寝分
    nightSleep:[ // 晚上睡觉
      { label: "熄灯", value: "熄灯" },
      { label: "锁门", value: "锁门" }
    ],
    sleepBehavior: '', // 睡前有无特殊习惯
    nightmare: '', // 睡眠质量
    issleepless: '', // 是否失眠时长
    sleepless: '', // 失眠时长
    iswakeuptimes: '', // 是否夜醒次数
    wakeuptimes: '', // 夜醒次数
    wakeuplong: '', // 夜醒时长
    earlywakeup: '', // 早醒
    other: '', // 其他
    follower: '', // 跟进人

    // 展开部分
    // 面部清洁
    face: [
      { label: "独自完成", value: "独自完成" },
      { label: "部分协调", value: "部分协调" },
      { label: "帮助", value: "帮助" },
      { label: "餐后擦嘴", value: "餐后擦嘴" }
    ],
    // 手脚清洁
    handfoot: [
      { label: "独自完成", value: "独自完成" },
      { label: "部分协调", value: "部分协调" },
      { label: "帮助", value: "帮助" },
      { label: "餐后擦嘴", value: "餐后洗手" }
    ],
    // 口腔清洁
    mouse: [
      { label: "自理", value: "自理" },
      { label: "部分协调", value: "部分协调" },
      { label: "依赖", value: "依赖" }
    ],
    // 刷牙
    teeth: [
      { label: "晨起", value: "晨起" },
      { label: "睡前", value: "睡前" },
      { label: "餐后漱口", value: "餐后漱口" }
    ],
    // 牙齿状态
    teethstate: [
      { label: "部分假牙", value: "部分假牙" },
      { label: "没有牙齿", value: "没有牙齿" },
      { label: "全上托", value: "全上托" },
      { label: "全下托", value: "全下托" },
      { label: "假牙损坏", value: "假牙损坏" }
    ],
    // 咀嚼能力
    bit: [
      { label: "完全", value: "完全" },
      { label: "不完全", value: "不完全" },
      { label: "困难", value: "困难" }
    ],
    // 会阴清洁
    egg: [
      { label: "独自完成", value: "独自完成" },
      { label: "部分协调", value: "部分协调" },
      { label: "帮助", value: "帮助" }
    ],
    // 洗发洗澡
    shower: [
      { label: "依赖", value: "依赖" },
      { label: "自理", value: "自理" }
    ],
    // 换洗衣服
    close: [
      { label: "独自完成", value: "独自完成" },
      { label: "需要提醒或指示协调", value: "需要提醒或指示协调" },
      { label: "需帮助换衣服，清洗内、外衣", value: "需帮助换衣服，清洗内、外衣" },
      { label: "抗拒", value: "抗拒" }
    ],
    // 上下楼
    upstairs: [
      { label: "自如", value: "自如" },
      { label: "协调", value: "协调" },
      { label: "不能上下楼", value: "不能上下楼" },
      { label: "必要时用担架", value: "必要时用担架" }
    ],
    // 户外活动
    outdoor: [
      { label: "自如", value: "自如" },
      { label: "协调", value: "协调" },
      { label: "不能进行户外活动", value: "不能进行户外活动" },
      { label: "必要时用轮椅", value: "必要时用轮椅" }
    ],
    // 活动范围
    outdoorarea: [
      { label: "院内外", value: "院内外" },
      { label: "院内", value: "院内" },
      { label: "房间内", value: "房间内" }
    ],
    // 穿衣
    wear: [
      { label: "依赖", value: "依赖" },
      { label: "需一半帮助", value: "需一半帮助" },
      { label: "自理（系开纽扣、开关拉链和穿鞋子）", value: "自理（系开纽扣、开关拉链和穿鞋子）" }
    ],
    // 仪表
    appearance: [
      { label: "整齐清洁", value: "整齐清洁" },
      { label: "衣衫不整，仪容不洁", value: "衣衫不整，仪容不洁" },
      { label: "肮脏", value: "肮脏" }
    ],
    // 床铺卫生
    bed: [
      { label: "独自完成", value: "独自完成" },
      { label: "协调", value: "协调" },
      { label: "依靠他人整理床铺、床头柜、更衣橱", value: "依靠他人整理床铺、床头柜、更衣橱" }
    ],
    // 吸烟
    smokeTimes: '', // 多少支每日
    smoke: [
      { label: "吸烟时打瞌睡", value: "吸烟时打瞌睡" },
      { label: "躺床上吸烟", value: "躺床上吸烟" }
    ],
    // 饮酒
    alcoholTimes: '', // 每天几次
    alcoholML: '', // 每天几两
    alcohols: [ // 种类
      { label: "葡萄酒", value: "葡萄酒" },
      { label: "白酒", value: "白酒" },
      { label: "啤酒", value: "啤酒" },
      { label: "黄酒", value: "黄酒" },
      { label: "其他", value: "其他" }
    ],
    // 电话
    tell: [
      { label: "独自完成", value: "独自完成" },
      { label: "只能接听电话", value: "只能接听电话" },
      { label: "协调", value: "协调" }
    ],
    // 理财
    money: [
      { label: "独自管理", value: "独自管理" },
      { label: "需提醒或协助", value: "需提醒或协助" },
      { label: "需委托保管", value: "需委托保管" }
    ],
    // 购物
    shopping: [
      { label: "独立", value: "独立" },
      { label: "协助", value: "协助" }
    ],
    // 亲友交往
    friend: [
      { label: "善于沟通交流", value: "善于沟通交流" },
      { label: "偶尔", value: "偶尔" },
      { label: "孤僻不愿与人交流", value: "孤僻不愿与人交流" },
      { label: "失语", value: "失语" }
    ],
    // 情绪行为
    emotion: [
      { label: "正常", value: "正常" },
      { label: "游荡", value: "游荡" },
      { label: "夜间昏乱", value: "夜间昏乱" },
      { label: "退缩", value: "退缩" },
      { label: "不安宁", value: "不安宁" },
      { label: "私自逃走", value: "私自逃走" },
      { label: "自我伤害", value: "自我伤害" },
      { label: "语言上暴力倾向", value: "语言上暴力倾向" },
      { label: "行为上暴力倾向", value: "行为上暴力倾向" }
    ],
    // 爱好
    habit: ''

  }





  ngOnInit() {
  }

}
