// 体温单数据模型
export type ChartDataInfo = {
  titleInfo: titleInfo;
  personInfo: personInfo;
  data: Array<dayData>;
};

//体温单标题信息
export type titleInfo = {
  level1Title: string;
  level2Title: string;
};
//体温单中患者信息
export type personInfo = {
  name: string; //患者姓名
  medicalService: string; //入院科室
  medicalArea: string; //所在病区
  bedNo: string; //床位号
  inNo: string; //住院号
  inDate: Date; //入院日期
};

//体温单中某一天的数据
export type dayData = {
  dayIndex: number; //天的下标
  dateStr: string; //当天日期
  inDays: string; //住院日数
  operationDays: string; //手术后日数
  pointsData: Array<PointData>; //当天测量时间点对应的检测数据
  inTake: string; //入量
  shit: shitModel; //大便
  urine: urineModel; //尿量
  dischargeOther: string; //其他排出量
  bloodPressure: bloodPressureModel; //血压
  weight: string; //体重
  skinTest1: skinTestModel; //皮试1
  skinTest2: skinTestModel; //皮试2
  other: string; //其他
};
//当天测量时间点对应检测的数据
export type PointData = {
  dayIndex: number; //天的下标
  pointIndex: number; //时间点的下标位，起始为0
  temperature: temperatureModel; //体温
  handingTemperature: temperatureModel; //处理后体温
  pulse: string; //脉搏
  heartRate: string; //心率
  breathe: breatheModel; //呼吸
  underLine42: {
    first: string;
    second: string;
  }; //42℃横线下标识
  aboveLine35: string; //35℃横线上标识
  underLine35: string; //35℃横线下标识
};

//体温数据模型
export type temperatureModel = {
  valueStr: string;
  value: string;
  type: temperatureType;
  isUncheck: false;
};
//体温类型
export enum temperatureType {
  OralTemp, //口温
  EarTemp, //耳温
  OxterTemp, //腋温
  AnorectumTemp //肛温
}

//呼吸数据模型
export type breatheModel = {
  valueStr: string;
  value: string;
  isMR: boolean; //是否使用呼吸机
  MRDays: string; //连续使用呼吸机日数
};
//皮试数据模型
export type skinTestModel = {
  testName: string; //皮试名称
  isPositive: boolean; //是否是阳性
};
//大便数据模型
export type shitModel = {
  valueStr: string; //用于体温表内容显示
  value: string; //正常大便次数
  isEnema: boolean; //是否保留灌肠
  enemaValue: string; //保留灌肠后大便次数
  isIncontinence: boolean; //是否失禁或假肛
  cleaningEnemaValue: string; //清洁灌肠后大便次数
};
//尿量数据模型
export type urineModel = {
  valueStr: string; //用于体温表内容显示
  value: string; //尿量数值
  isIncontinence: boolean; //是否失禁
  isCatheterization: boolean; //是否导尿
};

//血压数据模型
export type bloodPressureModel = {
  lowValue: string; //低压
  highValue: string; //高压
};
