import { Component, OnInit, Input, Output } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, MentionOnSearchTypes } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import { InfollowService } from "../infollow.service";
import * as _ from "underscore";
@Component({
  selector: "app-everyday",
  templateUrl: "./everyday.component.html",
  styleUrls: ["./everyday.component.css"]
})
export class EverydayComponent implements OnInit {
  @Input() id; // 老人id
  status = ""; // 老人状态
  daysTitle = ""; // 新增标题名称
  islocalform: boolean = false; // 是否是新增表单
  loading: boolean = false; // tab加载loading
  tabSelectedIndex: number = 0; // tab选中index
  extend = false; // 是否显示拓展项
  extend2 = false; // 是否显示本地拓展项
  tabs = []; // tab 数组

  // 添加tab弹框
  addTabModelIsVisible = false;

  // 获取表单数据
  dailyObserve = {
    oldmanId: "", // 老人id
    title: "", // 标题
    bloodPressure: "", // 血压
    bodyTemperature: "", // 体温
    pulse: "", // 脉搏
    // 小便
    peeML: "", // 尿量
    dayTimes: "", // 白天次数
    nightTimes: "", // 夜间次数
    peeCheck: [
      // 多选项
      { label: "请选择以下选项多选", value: "请选择以下选项多选" },
      { label: "失禁或需要导尿", value: "失禁或需要导尿" },
      {
        label: "偶尔失禁（<1次/24小时，>1次/周）",
        value: "偶尔失禁（<1次/24小时，>1次/周）"
      },
      {
        label: "能够便后冲洗或整理衣裤或夜间用便桶或尿壶",
        value: "能够便后冲洗或整理衣裤或夜间用便桶或尿壶"
      },
      {
        label: "能够排泄后能自洁及整理衣裤",
        value: "能够排泄后能自洁及整理衣裤"
      },
      { label: "需借助辅助器进出厕所", value: "需借助辅助器进出厕所" },
      { label: "需定时如厕或指示", value: "需定时如厕或指示" }
    ],
    // 大便
    shitTimes: "", // 大便次数
    shitCheck: [
      // 多选项
      { label: "失禁", value: "失禁" },
      {
        label: "偶尔失禁（<1次/24小时，>1次/周）",
        value: "偶尔失禁（<1次/24小时，>1次/周）"
      },
      { label: "便秘", value: "便秘" }
    ],
    shitday: "", // 便秘天数
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
    mainfood: "",
    // 菜
    foodlist: "",
    // 口味
    flavor: [
      { label: "偏咸", value: "偏咸" },
      { label: "偏淡", value: "偏淡" },
      { label: "偏甜", value: "偏甜" },
      { label: "偏软", value: "偏软" },
      { label: "偏辣", value: "偏辣" }
    ],
    // 治疗饮食
    treatfood: [
      { label: "低盐", value: "低盐" },
      { label: "低蛋白", value: "低蛋白" },
      { label: "低脂", value: "低脂" },
      { label: "高热量", value: "高热量" },
      { label: "糖尿病", value: "糖尿病" }
    ],
    // 喜欢食物
    likefood: "",
    // 不喜欢食物
    dislikefood: "",
    // 过敏食物
    allergyfood: "",
    // 禁忌食物
    prohibitfood: "",
    // 喜欢吃零食
    likesnack: "",
    // 其他
    otherfood: "",
    // 饮水
    cups: "", // 每天几杯
    beverage: [
      // 饮品种类
      { label: "白开水", value: "白开水" },
      { label: "绿茶", value: "绿茶" },
      { label: "红茶", value: "红茶" },
      { label: "咖啡", value: "咖啡" },
      { label: "其他", value: "其他" }
    ],
    othertea: "", // 其他茶水
    // 睡眠
    sleepState: [
      { label: "正常", value: "正常" },
      { label: "需要服药", value: "需要服药" },
      { label: "床档辅助", value: "床档辅助" },
      { label: "安全带辅助", value: "安全带辅助" }
    ],
    // 起床时间
    getupTimeHour: "", // 时
    getupTimeMinute: "", // 分
    // 午睡
    nap: "", // 有无午睡
    snaph: "", // 开始午睡时
    enaph: "", // 结束午睡时
    snapm: "", // 开始午睡分
    enapm: "", // 结束午睡分
    napstate: "", // 午睡质量
    sleepTimeh: "", // 就寝时
    sleepTimem: "", // 就寝分
    nightSleep: [
      // 晚上睡觉
      { label: "熄灯", value: "熄灯" },
      { label: "锁门", value: "锁门" }
    ],
    sleepBehavior: "", // 睡前有无特殊习惯
    nightmare: "", // 睡眠质量
    issleepless: "", // 是否失眠时长
    sleepless: "", // 失眠时长
    iswakeuptimes: "", // 是否夜醒次数
    wakeuptimes: "", // 夜醒次数
    wakeuplong: "", // 夜醒时长
    earlywakeup: "", // 早醒
    other: "", // 其他
    follower: "", // 跟进人

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
      {
        label: "需帮助换衣服，清洗内、外衣",
        value: "需帮助换衣服，清洗内、外衣"
      },
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
      {
        label: "自理（系开纽扣、开关拉链和穿鞋子）",
        value: "自理（系开纽扣、开关拉链和穿鞋子）"
      }
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
      {
        label: "依靠他人整理床铺、床头柜、更衣橱",
        value: "依靠他人整理床铺、床头柜、更衣橱"
      }
    ],
    // 吸烟
    smokeTimes: "", // 多少支每日
    smoke: [
      { label: "吸烟时打瞌睡", value: "吸烟时打瞌睡" },
      { label: "躺床上吸烟", value: "躺床上吸烟" }
    ],
    // 饮酒
    alcoholTimes: "", // 每天几次
    alcoholML: "", // 每天几两
    alcohols: [
      // 种类
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
    habit: ""
  };

  // 本地表单数据
  dailyObserve2 = {
    oldmanId: "", // 老人id
    userName: JSON.parse(localStorage.getItem("UserInfo")).data.name,
    title: "", // tab名
    bloodPressure: "", // 血压
    bodyTemperature: "", // 体温
    pulse: "", // 脉搏
    // 小便
    peeML: "", // 尿量
    dayTimes: "", // 白天次数
    nightTimes: "", // 夜间次数
    peeCheck: [
      // 多选项
      { label: "失禁或需要导尿", value: "失禁或需要导尿" },
      {
        label: "偶尔失禁（<1次/24小时，>1次/周）",
        value: "偶尔失禁（<1次/24小时，>1次/周）"
      },
      {
        label: "能够便后冲洗或整理衣裤或夜间用便桶或尿壶",
        value: "能够便后冲洗或整理衣裤或夜间用便桶或尿壶"
      },
      {
        label: "能够排泄后能自洁及整理衣裤",
        value: "能够排泄后能自洁及整理衣裤"
      },
      { label: "需借助辅助器进出厕所", value: "需借助辅助器进出厕所" },
      { label: "需定时如厕或指示", value: "需定时如厕或指示" }
    ],
    // 大便
    shitTimes: "", // 大便次数
    shitday: "", // 便秘天数
    shitCheck: [
      // 多选项
      { label: "失禁", value: "失禁" },
      {
        label: "偶尔失禁（<1次/24小时，>1次/周）",
        value: "偶尔失禁（<1次/24小时，>1次/周）"
      },
      { label: "便秘", value: "便秘" }
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
    mainfood: "",
    // 菜
    foodlist: "",
    // 口味
    flavor: [
      { label: "偏咸", value: "偏咸" },
      { label: "偏淡", value: "偏淡" },
      { label: "偏甜", value: "偏甜" },
      { label: "偏软", value: "偏软" },
      { label: "偏辣", value: "偏辣" }
    ],
    // 治疗饮食
    treatfood: [
      { label: "低盐", value: "低盐" },
      { label: "低蛋白", value: "低蛋白" },
      { label: "低脂", value: "低脂" },
      { label: "高热量", value: "高热量" },
      { label: "糖尿病", value: "糖尿病" }
    ],
    // 喜欢食物
    likefood: "",
    // 不喜欢食物
    dislikefood: "",
    // 过敏食物
    allergyfood: "",
    // 禁忌食物
    prohibitfood: "",
    // 喜欢吃零食
    likesnack: "",
    // 其他
    otherfood: "",
    // 饮水
    cups: "", // 每天几杯
    beverage: [
      // 饮品种类
      { label: "白开水", value: "白开水" },
      { label: "绿茶", value: "绿茶" },
      { label: "红茶", value: "红茶" },
      { label: "咖啡", value: "咖啡" },
      { label: "其他", value: "其他" }
    ],
    othertea: "", // 其他茶水
    // 睡眠
    sleepState: [
      { label: "正常", value: "正常" },
      { label: "需要服药", value: "需要服药" },
      { label: "床档辅助", value: "床档辅助" },
      { label: "安全带辅助", value: "安全带辅助" }
    ],
    // 起床时间
    getupTimeHour: "", // 时
    getupTimeMinute: "", // 分
    // 午睡
    nap: "", // 有无午睡
    snaph: "", // 开始午睡时
    enaph: "", // 结束午睡时
    snapm: "", // 开始午睡分
    enapm: "", // 结束午睡分
    napstate: "", // 午睡质量
    sleepTimeh: "", // 就寝时
    sleepTimem: "", // 就寝分
    nightSleep: [
      // 晚上睡觉
      { label: "熄灯", value: "熄灯" },
      { label: "锁门", value: "锁门" }
    ],
    sleepBehavior: "", // 睡前有无特殊习惯
    nightmare: "", // 睡眠质量
    issleepless: "", // 是否失眠时长
    sleepless: "", // 失眠时长
    iswakeuptimes: "", // 是否夜醒次数
    wakeuptimes: "", // 夜醒次数
    wakeuplong: "", // 夜醒时长
    earlywakeup: "", // 早醒
    other: "", // 其他
    follower: "", // 跟进人

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
      {
        label: "需帮助换衣服，清洗内、外衣",
        value: "需帮助换衣服，清洗内、外衣"
      },
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
      {
        label: "自理（系开纽扣、开关拉链和穿鞋子）",
        value: "自理（系开纽扣、开关拉链和穿鞋子）"
      }
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
      {
        label: "依靠他人整理床铺、床头柜、更衣橱",
        value: "依靠他人整理床铺、床头柜、更衣橱"
      }
    ],
    // 吸烟
    smokeTimes: "", // 多少支每日
    smoke: [
      { label: "吸烟时打瞌睡", value: "吸烟时打瞌睡" },
      { label: "躺床上吸烟", value: "躺床上吸烟" }
    ],
    // 饮酒
    alcoholTimes: "", // 每天几次
    alcoholML: "", // 每天几两
    alcohols: [
      // 种类
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
    habit: ""
  };
  replaceForm = JSON.parse(JSON.stringify(this.dailyObserve2)); // 替换表

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private entrustService: InfollowService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.getTabsInfoPromise().then(tabs => {
      if (_.isObject(tabs[0]) && tabs[0]["id"]) {
        // 首次进来默认第0个tab及内容
        this.getTabContent(tabs[0]["id"]);
      }
    });
  }

  // 获取Tab数组
  getTabsInfoPromise() {
    return new Promise(resolv => {
      this.loading = true;
      this.httpReq.post("rtDwell/getTitleList", null, { id: this.id }, data => {
        if (data.code == 0) {
          if (data["data"]["list"] instanceof Array) {
            this.tabs = data["data"]["list"];
          }
          this.status = data["data"]["status"];
          this.daysTitle = data["data"]["days"] ? data["data"]["days"] : "";
          resolv(this.tabs);
        } else {
          console.log("获取数据失败！");
        }
        this.loading = false;
      });
    });
  }

  // 获取某tab对应内容
  getTabContent(id) {
    this.loading = true;
    this.httpReq.post("rtDwell/getTitleMessage", null, { id: id }, data => {
      if (data.code == 0) {
        if (_.isObject(data["data"]) && !_.isEmpty(data["data"])) {
          let info = data["data"];
          // 多选项数据转换
          info["peeCheck"] = JSON.parse(info["peeCheck"]);
          info["shitCheck"] = JSON.parse(info["shitCheck"]);
          info["action"] = JSON.parse(info["action"]);
          info["eatfood"] = JSON.parse(info["eatfood"]);
          info["flavor"] = JSON.parse(info["flavor"]);
          info["treatfood"] = JSON.parse(info["treatfood"]);
          info["beverage"] = JSON.parse(info["beverage"]);
          info["sleepState"] = JSON.parse(info["sleepState"]);
          info["nightSleep"] = JSON.parse(info["nightSleep"]);
          info["face"] = JSON.parse(info["face"]);
          info["handfoot"] = JSON.parse(info["handfoot"]);
          info["mouse"] = JSON.parse(info["mouse"]);
          info["teeth"] = JSON.parse(info["teeth"]);
          info["teethstate"] = JSON.parse(info["teethstate"]);
          info["bit"] = JSON.parse(info["bit"]);
          info["egg"] = JSON.parse(info["egg"]);
          info["shower"] = JSON.parse(info["shower"]);
          info["close"] = JSON.parse(info["close"]);
          info["upstairs"] = JSON.parse(info["upstairs"]);
          info["outdoor"] = JSON.parse(info["outdoor"]);
          info["outdoorarea"] = JSON.parse(info["outdoorarea"]);
          info["wear"] = JSON.parse(info["wear"]);
          info["appearance"] = JSON.parse(info["appearance"]);
          info["bed"] = JSON.parse(info["bed"]);
          info["smoke"] = JSON.parse(info["smoke"]);
          info["alcohols"] = JSON.parse(info["alcohols"]);
          info["tell"] = JSON.parse(info["tell"]);
          info["money"] = JSON.parse(info["money"]);
          info["shopping"] = JSON.parse(info["shopping"]);
          info["friend"] = JSON.parse(info["friend"]);
          info["emotion"] = JSON.parse(info["emotion"]);
          // console.log(info);
          _.extend(this.dailyObserve, info);
        } else {
          console.log("获取数据失败！");
        }
      }
      this.loading = false;
    });
  }

  // 选中Tab
  selTab(index, tabId) {
    setTimeout(() => {
      this.extend = false; // 切换tab时，关闭 更多模板
      this.extend2 = false; // 切换tab时，关闭 更多模板
    }, 100);
    if (tabId) {
      setTimeout(() => {
        this.islocalform = false; // 请求表
        this.tabSelectedIndex = index; // 切换tab
        this.getTabContent(tabId); // 请求数据
      }, 100);
    } else {
      setTimeout(() => {
        this.islocalform = true; // 本地表
        this.tabSelectedIndex = index; // 切换tab
      }, 100);
    }
  }

  // 新增Tab弹框 相关
  addtab(el: Element) {
    el["value"] = this.daysTitle;
    let num: number;
    if (
      this.tabs.every((item, index) => {
        if (!item["id"]) num = index;
        return item["id"].length > 0;
      })
    ) {
      this.addTabModelIsVisible = true;
    } else {
      this.message.warning(`请先保存标题“${this.tabs[num].title}”页内容！`);
    }
  }
  // 弹框确认
  addTabModelOk(value) {
    if (value) {
      this.tabs.push({ title: value, id: "", icon: "close" }); // 添加
      this.dailyObserve2.title = value; // tab名
      this.tabSelectedIndex = this.tabs.length - 1; // 切换到最新
    }
    this.addTabModelIsVisible = false;
  }
  // 弹框取消
  addTabModelCancel() {
    this.addTabModelIsVisible = false;
  }

  // 删除新建tab页
  deleteTab(tabIndex) {
    // alert(tabIndex);
    // 清空 本地表
    // 从数组中 删除 tab
    // 改变 tabSelectedIndex -1
    this.tabs.pop();
    --this.tabSelectedIndex;
    this.islocalform = false;
    this.dailyObserve2 = JSON.parse(JSON.stringify(this.replaceForm));
  }

  // 保存
  saveForm(state) {
    let sendData;
    if (state == "add") {
      sendData = this.dailyObserve2;
    } else if (state == "edit") {
      sendData = this.dailyObserve;
    }
    sendData.oldmanId = this.id;
    this.loading = true;
    this.httpReq.post("rtDwell/titleMessageSave", null, sendData, data => {
      this.loading = false;
      if (data.code == 0) {
        this.message.success("操作成功！");
        // 刷新tab 及 content
        // ...
        this.islocalform = false;
        this.dailyObserve2 = JSON.parse(JSON.stringify(this.replaceForm));
        this.getTabsInfoPromise().then(tabs => {
          console.log(tabs);
          if (tabs[this.tabSelectedIndex]["id"]) {
            this.getTabContent(tabs[this.tabSelectedIndex]["id"]);
          }
        });
      }
    });
  }
}
