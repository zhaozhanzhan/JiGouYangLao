import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { JsUtilsService } from '../../../common/service/JsUtils.Service';
@Component({
  selector: 'app-print-all',
  templateUrl: './print-all.component.html',
  styleUrls: ['./print-all.component.css']
})
export class PrintAllComponent implements OnInit {
  @ViewChild('firstCare') firstCare; // 首次护理评估
  @ViewChild('medicalRecord') medicalRecord; // 病案首页
  @ViewChild('temperatureChart') temperatureChart; // 体温单
  @ViewChild('diabetesOrder') diabetesOrder; // 糖尿病记录单
  @ViewChild('bloodPressureRecord') bloodPressureRecord; // 血压记录单
  @ViewChild('standingOrder') standingOrder; // 长期医嘱
  @ViewChild('temporaryOrder') temporaryOrder; // 临时医嘱
  @ViewChild('nursingOrder') nursingOrder; // 一般护理记录单
  @ViewChild('medicalScore') medicalScore; // 病案质量评分
  olderInfo; // 老人信息
  // 提供打印目录
  /* 
    title: 列表显示
    mark：检索标识，需打印标签id，要与引入组件相同
    checked: 是否选中
  */
  line = [
    {
      title: '病案首页',
      mark: 'medicalRecord',
      checked: false
    },
    {
      title: '体温单',
      mark: 'temperatureChart',
      checked: false
    },
    {
      title: '糖尿病记录单',
      mark: 'diabetesOrder',
      checked: false
    },
    {
      title: '血压记录单',
      mark: 'bloodPressureRecord',
      checked: false
    },
    {
      title: '长期医嘱单',
      mark: 'standingOrder',
      checked: false
    },
    {
      title: '临时医嘱单',
      mark: 'temporaryOrder',
      checked: false
    },
    {
      title: '首次护理记录单',
      mark: 'firstCare',
      checked: false
    },
    {
      title: '一般护理记录单',
      mark: 'nursingOrder',
      checked: false
    },
    {
      title: '病案质量评分',
      mark: 'medicalScore',
      checked: false
    },
    
  ]; 
  systemInfo; //系统信息

  // print list
  checked; // 是否全选
  printState = false; // 打印状态
  someHTML; // 用来打印的html模板
  someStyle; // 打印样式
  someCSS = []; // 打印的css文件


  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService,
    private settingService: SettingsService,
    public http: _HttpClient
  ) { }

  ngOnInit() {
    // console.log( this.route.snapshot.paramMap.get('msg'));
    this.olderInfo = JSON.parse(this.route.snapshot.paramMap.get('msg'));
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    this.line.length = 28;
  }

  back(){
    window.history.back();
  }

  // 创建需打印内容
  createPrint(){
    // 创建打印标签
    let HTMLel = document.createElement('div');
    // 获取需打印组件
    let components = this.isChecked();
    if(components instanceof Array && components.length){
      components.forEach(item => {
        let el = document.getElementById(item.mark);
        if( el instanceof HTMLElement){
          // 添加打印模板
          HTMLel.appendChild(el);
          // 添加样式link
          let elcssList = this[item.mark].printCSS;
            // 去重
          if(elcssList instanceof Array && elcssList.length){
            elcssList.forEach(cssUrl => {
              if(this.someCSS.indexOf(cssUrl) < 0){
                this.someCSS.push(cssUrl);
              }
            })
          }
          // 添加Style
          let elstyle = this[item.mark].printStyle;
          if(typeof elstyle == 'string'){
            this.someStyle += elstyle;
          }
        }
      })
    }
    this.someHTML = HTMLel;
  }

  // 选择打印
  /**
   * @param {*} [item] 仅做html传值
   * @returns 返回选中项
   * @memberof PrintAllComponent
   */
  isChecked(item?){
    if(item && item.title){
      item.checked = !item.checked
    }
    let checkList = this.line.filter(x => x.checked);
   
    return checkList;
  }

  // 是否加载某需打印组件
  render(componentName){
    let state = false;
    this.line.forEach(item => {
      if(this.printState && item.mark == componentName && item.checked){
        state = true;
      }
    })
    return state;
  }

  // 开始打印
  printer(eprit){
    if(!this.isChecked().length){
      this.message.error('无可打印项！');
      return
    }
    this.printState = true;
    // 等待下一轮在生成打印模板
    // 这里本来等一轮就可以， 但是体温单就组件中套组件， 再套组件。 所以要等个三轮。。。
    setTimeout(() => {
      setTimeout(() => {
        setTimeout(() => {
            this.createPrint();
            eprit.print();
        }, 0);
      }, 0);
    }, 0);
  }

  // 打印完成 
  printComplete(){
    this.printState = false;
    this.someCSS = [];
    this.someHTML = null;
    this.someStyle = '';
  }

  //全选
  checkall(state){
    // console.log(state);
    if(state) this.line.forEach(x => x.checked = true);
    else this.line.forEach(x => x.checked = false);
  }
}
