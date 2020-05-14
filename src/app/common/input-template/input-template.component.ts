import {
  Component,
  OnInit,
  Input,
  Output,
  AfterViewInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Renderer,
  ViewEncapsulation
} from "@angular/core";

import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { Utils } from "../utils/utils";
import { MentionOnSearchTypes } from "ng-zorro-antd";
@Component({
  selector: "textarea-template",
  templateUrl: "./input-template.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./input-template.component.scss"]
})

/**
 * 病历中的输入框，可根据输入内容查询模板并提示
 */
export class InputTemplateComponent
  implements OnInit, AfterViewInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {}

  //字典标识符
  @Input()
  templateType: string;

  //设置输入框的最小行数和最高行数
  @Input()
  autoSizeSetting: object = { minRows: 2, maxRows: 20 };
  //提供双向绑定输入框的值
  inputValue: string = "";
  @Input()
  get inputModel() {
    return this.inputValue;
  }
  set inputModel(val: string) {
    this.inputValue = val;
    this.inputModelChange.emit(this.inputValue);
  }
  @Output() inputModelChange: EventEmitter<string> = new EventEmitter<string>();

  valueChange($event) {
    this.inputModelChange.emit($event);
  }

  @Input()
  placeholder: string = "";

  @ViewChild("textArea")
  textArea: ElementRef;

  @ViewChild("notifyTable")
  notifyTable: ElementRef;

  public suggestions = [];
  isLoading = false;

  //提及输入框自定义数据项
  valueWith = data => data.comment;
  //提及输入框加载状态
  loading = false;
  constructor(private httpReq: HttpReqService) {}

  ngAfterViewInit(): void {}

  ngOnInit() {}

  onSearchChange({ value, prefix }: MentionOnSearchTypes): void {
    this.loading = true;

    let that = this;
    let queryParam = {
      page: "0",
      size: "20",
      dictMgtId: "",
      dictTag: this.templateType,
      dictValue: "",
      status: "1",
      comment: value
    };
    this.httpReq.post(
      "careAssessment/listCareMeasureData",
      null,
      queryParam,
      data => {
        that.loading = false;
        if (data["status"] == 200) {
          that.suggestions = data["data"]["content"];
        }
      }
    );
  }

  onSelect(value) {}
}
