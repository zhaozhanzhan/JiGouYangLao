/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-28 16:04:02
 * @Description: 可自定义的表单控件
 */
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { ServeConfigService } from "../config/serve-config.service";
import { JsUtilsService } from "../service/JsUtils.Service";
import { Utils } from "../utils/utils";
import { ENgxPrintComponent } from "e-ngx-print";
@Component({
  selector: "mirr-customform",
  templateUrl: "customForm.component.html",
  styleUrls: ["customForm.component.css"]
})
export class CustomFormComponent implements OnInit {
  //编辑器配置
  ckeditorConfig = {
    bodyClass: "document-editor",
    entities: true,
    toolbarGroups: [
      { name: 'document', groups: ['mode', 'document', 'doctools'] },
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
      { name: 'insert', groups: ['insert'] },
      { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      { name: 'forms', groups: ['forms'] },
      { name: 'styles', groups: ['styles'] },
      { name: 'colors', groups: ['colors'] },
      '/',
      '/',
      '/',
      '/',
      '/',
      '/',
      '/',
      '/',
      { name: 'tools', groups: ['tools'] },
      { name: 'links', groups: ['links'] },
      { name: 'others', groups: ['others'] },
      { name: 'about', groups: ['about'] }
    ],
    removeButtons: 'Iframe,Smiley,Flash,Image,Link,Unlink,Anchor,Language,Blockquote,CreateDiv,About,Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,HorizontalRule,PageBreak,Outdent,Indent,BidiLtr,RemoveFormat,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,TextColor,BGColor,Styles,Format,ShowBlocks'
  };
  //当进入打印模式时，需要记录当前模式，当打印完毕后，回到该模式下；
  lastFormMode = "";
  //打印状态控制
  isPrintNow: boolean = false; // 是否正在打印
  printCSS: Array<string> = [
  ]; // 打印内容css文件路径
  printStyle: string = ``;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件

  //实体控件选择菜单
  isCollapsed;
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // 标签类型
  data = [
    {
      type: 'bound',
      title: '属性绑定'
    },
    {
      type: 'title',
      title: '标题'
    },
    {
      type: 'input',
      title: '文本框'
    },
    {
      type: 'text',
      title: '文本内容'
    },
    {
      type: 'textarea',
      title: '多行文本框'
    },
    {
      type: 'select',
      title: '选择器'
    },
    {
      type: 'checkbox',
      title: '多选框'
    },
    {
      type: 'date',
      title: '日期'
    },
    {
      type: 'blank',
      title: '占位标签'
    },
    {
      type: 'sign',
      title: '扫码签名'
    }
  ];



  // 表单的标签列表
  items = [];
  // 当前选中标签
  selectedItemIndex = 0;

  // 保存按钮加载状态
  isSaveBtnLoading = false;

  // 表单内容
  @Input()
  formName: any = "";

  //键值绑定标签接收的数据项
  @Input()
  boundParams: any = {};

  //表单模式design:设计模式；edit:编辑模式；view:展示模式；print:打印模式；
  @Input()
  formMode: any = "design"
  //是否显示模式切换控制器
  @Input()
  isShowModeController: any = 'true';
  //是否显示打印按钮
  @Input()
  isShowPrintController: any = 'true';

  //双向绑定自定义表单的配置内容；
  @Output()
  formContentChange = new EventEmitter();

  @Input()
  get formContent(): any {
    return this.items;
  }
  set formContent(val) {
    if (!Utils.isArray(val)) {
      this.items = [];
    } else {
      this.items = val;
    }
    this.formContentChange.emit(this.items);
  }

  constructor(
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private msg: NzMessageService, // 消息提醒
    private cd: ChangeDetectorRef
  ) {

  }
  ngAfterViewChecked() {
    //解决ExpressionChangedAfterItHasBeenCheckedError：https://www.jianshu.com/p/6d761c31c5ee
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.printCSS = [
      "assets/css/ng-zorro-antd.min.css",
      "assets/css/customForm-print.css"
    ];
  }

  /**
   * 返回
   */
  back() {
    history.back();
  }

  /**
   * 添加表单
   * @param itemType 表单添加标签
   */
  addItem(itemType) {
    let item: any;
    // 根据标签类型构建标签参数
    switch (itemType) {
      case 'title':
        item = {
          type: 'title',
          label: '标题',
          labelMode: 'title', // title为大标题; label为小标题
          span: '24',
          labelBold: false,
          labelSize: 1,
          textAlign: 'left',
        };
        break;
      case 'text':
        item = {
          type: 'text',
          label: '文本内容',
          value: '文本内容',
          span: '24',
          required: false,
          requiredMsg: '必填项',
          placeholderText: '',
        };
        break;
      case 'input':
        item = {
          type: 'input',
          label: '文本框',
          value: null,
          span: '24',
          required: false,
          requiredMsg: '必填项',
          placeholderText: '',
        };
        break;
      case 'textarea':
        item = {
          type: 'textarea',
          label: '多行文本框',
          value: null,
          span: '24',
          required: false,
          requiredMsg: '必填项',
          placeholderText: '',
        };
        break;
      case 'select':
        item = {
          type: 'select',
          label: '选择器',
          value: null,
          mode: 'default',
          options: [
            { label: '选项一', value: '选项一' },
          ],
          span: '24',
          required: false,
          requiredMsg: '必填项',
          placeholderText: '请选择'
        };
        break;
      case 'checkbox':
        item = {
          type: 'checkbox',
          label: '多选框',
          value: null,
          checkOptions: [
            { label: '选项一', value: '选项一', checked: false },
          ],
          span: '24',
          required: false,
          requiredMsg: '必填项',
          placeholderText: '请选择'
        };
        break;
      case 'date':
        item = {
          type: 'date',
          label: '日期',
          value: null,
          format: 'yyyy-MM-dd',
          span: '24',
          required: false,
          requiredMsg: '必填项',
          placeholderText: '请选择日期',
        };
        break;
      case 'blank':
        item = {
          type: 'blank',
          label: '占位标签',
          span: '24',
          labelBold: false,
          labelSize: 1,
          textAlign: 'center'
        };
        break;
      case 'sign':
        item = {
          type: 'sign',
          label: '扫码签名',
          span: '24',
          imgsTagged: "",
          value: ""
        };
        break;
      case 'bound':
        item = {
          type: 'bound',
          label: '属性绑定',
          span: '24',
          boundKey: "",//存放需要绑定的键值代码
        };
        break;
      default:
        break;
    }

    // 添加标签
    if (this.items.length === 0) {
      this.items.push(item);
    } else {
      this.items.splice(this.selectedItemIndex + 1, 0, item);
    }
  }

  /**
   * 删除标签
   * @param i
   */
  delItem(i) {
    if (this.selectedItemIndex > 0 && this.selectedItemIndex >= i) {
      this.selectedItemIndex--;
    }
    this.items.splice(i, 1);
  }

  /**
   * 选中标签
   */
  selectItem(itemIndex) {
    this.selectedItemIndex = itemIndex;
  }

  /**
   * 添加select标签选项
   */
  addOpt() {
    this.items[this.selectedItemIndex].options.push({ label: '', value: '' });
  }

  /**
   * 删除select标签选项
   * @param optIndex
   */
  delOpt(optIndex) {
    // 如果是单选select标签删除已选择的选项，则清空select值
    if (this.items[this.selectedItemIndex].options[optIndex].label === this.items[this.selectedItemIndex].value) {
      this.items[this.selectedItemIndex].value = null;
    }

    // 如果是多选select标签删除已选择的选项，则去掉select值中的选项值
    if (Utils.isArray(this.items[this.selectedItemIndex].value)) {
      const index = this.items[this.selectedItemIndex].value.indexOf(this.items[this.selectedItemIndex].options[optIndex].label);
      if (index !== -1) {
        this.items[this.selectedItemIndex].value.splice(index, 1);
      }
    }

    // 删除标签
    this.items[this.selectedItemIndex].options.splice(optIndex, 1);
  }

  /**
   * 输入选项值时，构想option中label和value，默认一致
   * @param optIndex
   */
  optModelChange(optIndex) {
    this.items[this.selectedItemIndex].options[optIndex].value = this.items[this.selectedItemIndex].options[optIndex].label;
  }

  /**
   * 添加checkbox标签选项
   */
  addCheckOption() {
    this.items[this.selectedItemIndex].checkOptions.push({ label: '', value: '', checked: false });
  }

  /**
   * 删除checkbox标签选项
   * @param optIndex
   */
  delCheckOption(optIndex) {
    // 删除标签
    this.items[this.selectedItemIndex].checkOptions.splice(optIndex, 1);
  }

  /**
   * checkbox标签输入选项值时，构建option中label和value，默认一致
   * @param optIndex
   */
  checkOptModelChange(optIndex) {
    this.items[this.selectedItemIndex].checkOptions[optIndex].value = this.items[this.selectedItemIndex].checkOptions[optIndex].label;
  }

  // 格式化标题大小
  formatterPercent = (value: number) => `${value} 倍`;
  parserPercent = (value: string) => value.replace(' 倍', '');

  /**
 * 单击打印按钮调用打印方法
 * @param {MouseEvent} [ev]
 * @memberof MedicalRecordComponent
 */
  public clickPrint() {
    this.lastFormMode = this.formMode;
    this.formMode = 'print';
    this.isPrintNow = true; // 正在打印
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isPrintNow = false;
    this.formMode = this.lastFormMode;
  }
}
