/*
 * name:表格斜线指令
 * describe:用来显示表格单元格对角线
 * author:赵展展
 * QQ:799316652
 * Email:zhanzhan.zhao@mirrortech.cn
 *
 * Directive: 指令模块
 * ElementRef: 获取节点
 * Input: 获取输入内容
 * Renderer: 渲染新节点
 * HostListener: 这是监听事件的, 绑定时间
 *
 * 注意:
 * 1. 指令的名称要使用中括号括起来
 * 2. html中使用的时候, 不需要中括号
 * 3. 构造模板中传递参数的时候, 如果是字符串, 那么要单引号: [obliqueLineOption]='{"top":0,"left":-4,"pos":"left|top","rotate":345}'
 */
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer
} from "@angular/core";
import * as _ from "underscore";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

// 使用案例： <div obliqueLine obliqueLineOption='{"pos":"left|top"}'></div>
export class ObliqueLineOption {
  width?: number; // 直角宽度 例 "width":4
  height?: number; // 直角高度 例 "height":5
  top?: number; // 相对父级顶部定位 例 "top":0
  bottom?: number; // 相对父级底部定位 例 "bottom":0
  left?: number; // 相对父级左侧定位 例 "left":-5
  pos?: string; // 旋转圆心位置 例 "pos":"left|top"
  borColor?: string; // 线的颜色值 例 "borColor":"black" or "#F00"
  rotate?: number; // 旋转角度 例 "rotate":345
  lineSeg?: number; // 斜线长度 例 "lineSeg":5
}

@Directive({
  selector: "[obliqueLine]"
})
export class ObliqueLineDirective {
  @Input() public obliqueLineOption: ObliqueLineOption;

  @HostListener("click") onClick() {}
  constructor(private el: ElementRef, private renderer: Renderer) {}

  /**
   * 计算线的数据
   * @private
   * @memberof ObliqueLineDirective
   */
  private calLineData() {
    const parEle = this.el.nativeElement.parentElement;
    const obliqueLineStr: any = this.obliqueLineOption.toString();
    let obliqueLineObj: any;
    try {
      obliqueLineObj = JSON.parse(obliqueLineStr);
    } catch (error) {
      obliqueLineObj = {};
    }

    this.renderer.setElementStyle(parEle, "position", "relative");
    if (!_.isObject(obliqueLineObj)) {
      obliqueLineObj = {};
    }
    if (!(obliqueLineObj["width"] && _.isNumber(obliqueLineObj["width"]))) {
      obliqueLineObj["width"] = parEle.clientWidth;
    }
    if (!(obliqueLineObj["height"] && _.isNumber(obliqueLineObj["height"]))) {
      obliqueLineObj["height"] = parEle.clientHeight;
    }
    if (!(obliqueLineObj["top"] && _.isNumber(obliqueLineObj["top"]))) {
      obliqueLineObj["top"] = 0;
    }
    if (!(obliqueLineObj["bottom"] && _.isNumber(obliqueLineObj["bottom"]))) {
      obliqueLineObj["bottom"] = 0;
    }
    if (!(obliqueLineObj["left"] && _.isNumber(obliqueLineObj["left"]))) {
      obliqueLineObj["left"] = 0;
    }
    if (!(obliqueLineObj["pos"] && _.isString(obliqueLineObj["pos"]))) {
      obliqueLineObj["pos"] = "left|top";
    }
    if (
      !(obliqueLineObj["borColor"] && _.isString(obliqueLineObj["borColor"]))
    ) {
      obliqueLineObj["borColor"] = "black";
    }

    if (!(obliqueLineObj["lineSeg"] && _.isNumber(obliqueLineObj["lineSeg"]))) {
      // 计算斜线的长度
      if (obliqueLineObj["width"] == 0) {
        obliqueLineObj["width"] = 1;
      }
      if (obliqueLineObj["height"] == 0) {
        obliqueLineObj["height"] = 1;
      }
      obliqueLineObj["lineSeg"] = Math.sqrt(
        Math.pow(obliqueLineObj["width"], 2) +
          Math.pow(obliqueLineObj["height"], 2)
      );
    }

    const asin: any =
      Math.asin(obliqueLineObj["height"] / obliqueLineObj["lineSeg"]) *
      (180 / Math.PI);

    if (!(obliqueLineObj["rotate"] && _.isNumber(obliqueLineObj["rotate"]))) {
      if (obliqueLineObj["pos"] == "left|top") {
        obliqueLineObj["rotate"] = asin;
      } else if (obliqueLineObj["pos"] == "left|bottom") {
        obliqueLineObj["rotate"] = -asin;
      } else {
        obliqueLineObj["rotate"] = 0;
      }
    }

    const obliqueLineStyle: any = {
      position: "absolute",
      "border-top": `1px solid ${obliqueLineObj["borColor"]}`,
      background: "transparent",
      "z-index": "1000",
      height: `0px`,
      width: `${obliqueLineObj["lineSeg"]}px`,
      "-webkit-transform": `rotate(${obliqueLineObj["rotate"]}deg)`,
      "-ms-transform": `rotate(${obliqueLineObj["rotate"]}deg)`,
      "-moz-transform": `rotate(${obliqueLineObj["rotate"]}deg)`,
      "-o-transform": `rotate(${obliqueLineObj["rotate"]}deg)`,
      transform: `rotate(${obliqueLineObj["rotate"]}deg)`,
      "transform-origin": ``
    };

    if (obliqueLineObj["pos"] == "left|top") {
      obliqueLineStyle["transform-origin"] = "left top";
      obliqueLineStyle["left"] = `${obliqueLineObj["left"]}px`;
      obliqueLineStyle["top"] = `${obliqueLineObj["top"]}px`;
    } else if (obliqueLineObj["pos"] == "left|bottom") {
      obliqueLineStyle["transform-origin"] = "left bottom";
      obliqueLineStyle["left"] = `${obliqueLineObj["left"]}px`;
      obliqueLineStyle["bottom"] = `${obliqueLineObj["bottom"]}px`;
    } else {
      obliqueLineStyle["transform-origin"] = "left top";
      obliqueLineStyle["left"] = `${obliqueLineObj["left"]}px`;
      obliqueLineStyle["top"] = `${obliqueLineObj["top"]}px`;
    }

    for (const key in obliqueLineStyle) {
      if (obliqueLineStyle.hasOwnProperty(key)) {
        this.renderer.setElementStyle(
          this.el.nativeElement,
          key,
          obliqueLineStyle[key]
        );
      }
    }
  }

  ngOnChanges(): void {
    this.calLineData();
  }

  ngAfterViewInit(): void {
    this.calLineData();
  }

  ngAfterViewChecked(): void {
    this.calLineData();
  }

  ngOnInit(): void {
    this.calLineData();
    // 以免频繁处理
    const resizeEvent = fromEvent(window, "resize");
    const result = resizeEvent.pipe(debounceTime(100));
    result.subscribe(event => {
      // 这里处理页面变化时的操作
      this.calLineData();
    });
  }

  // animate: ƒ ()
  // attachViewAfter: ƒ (node, viewRootNodes)
  // createElement: ƒ (parent, namespaceAndName)
  // createTemplateAnchor: ƒ (parentElement)
  // createText: ƒ (parentElement, value)
  // createViewRoot: ƒ (hostElement)
  // destroyView: ƒ (hostElement, viewAllNodes)
  // detachView: ƒ (viewRootNodes)
  // invokeElementMethod: ƒ (renderElement, methodName, args)
  // listen: ƒ (renderElement, name, callback)
  // listenGlobal: ƒ (target, name, callback)
  // projectNodes: ƒ (parentElement, nodes)
  // selectRootElement: ƒ (selectorOrNode)
  // setBindingDebugInfo: ƒ (renderElement, propertyName, propertyValue)
  // setElementAttribute: ƒ (renderElement, namespaceAndName, attributeValue)
  // setElementClass: ƒ (renderElement, className, isAdd)
  // setElementProperty: ƒ (renderElement, propertyName, propertyValue)
  // setElementStyle: ƒ (renderElement, styleName, styleValue)
}
