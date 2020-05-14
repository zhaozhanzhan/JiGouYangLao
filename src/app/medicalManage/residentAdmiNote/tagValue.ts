export class TagValue {
  static TagValueTemp = {
    name: "",
    sex: "",
    phone: "",
    address: "",
    cardno: "",
    medicalPayment: "",
    medicalCard: "",
    inDate: "",
    signDate: ""
  };
  static SupportTag = [
    { value: "姓名", tag: "{{name}}" },
    { value: "性别", tag: "{{sex}}" },
    { value: "电话", tag: "{{phone}}" },
    { value: "居住地址", tag: "{{address}}" },
    { value: "身份证号", tag: "{{cardno}}" },
    { value: "医疗费支付方式", tag: "{{medicalPayment}}" },
    { value: "医保卡号", tag: "{{medicalCard}}" },
    { value: "入院日期", tag: "{{inDate}}" },
    {
      value: "签订日期",
      tag: "&signDate&"
    },
    {
      value: "生效日期",
      tag: "&effectDate&"
    },
    {
      value: "失效日期",
      tag: "&invalidDate&"
    },
    {
      value: "院方签名1",
      tag: "&院方签名1&"
    },
    {
      value: "院方签名2",
      tag: "&院方签名2&"
    },
    {
      value: "院方签名3",
      tag: "&院方签名3&"
    },
    {
      value: "家属签名1",
      tag: "&家属签名1&"
    },
    {
      value: "家属签名2",
      tag: "&家属签名2&"
    },
    {
      value: "文本输入1",
      tag: "&文本输入1&"
    },
    {
      value: "文本输入2",
      tag: "&文本输入2&"
    },
    {
      value: "文本输入3",
      tag: "&文本输入3&"
    }
  ];
}
