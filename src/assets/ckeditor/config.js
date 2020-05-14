/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function(config) {
  // Define changes to default configuration here. For example:
  // config.language = 'fr';
  // config.uiColor = '#AADC6E';
  /**
   * 插件语言
   * @type {string}
   */
  config.language = "zh-cn";

  /**
   * 插件字体
   * @type {string}
   */
  config.font_names =
    "宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;微软雅黑/微软雅黑;宋体/SimSun;" +
    "新宋体/NSimSun;仿宋_GB2312/FangSong_GB2312;楷体_GB2312/KaiTi_GB2312;黑体/SimHei;微软雅黑/Microsoft YaHei;幼圆/YouYuan;华文彩云/STCaiyun;华文行楷/STXingkai;" +
    "方正舒体/FZShuTi;方正姚体/FZYaoti;Arial;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana;";
  /**
   * 插件默认字体
   * @type {string}
   */
  config.font_defaultLabel = "宋体";
  config.toolbarGroups = [
    { name: "document", groups: ["mode", "document", "doctools"] },
    { name: "clipboard", groups: ["clipboard", "undo"] },
    {
      name: "editing",
      groups: ["find", "selection", "spellchecker", "editing"]
    },
    { name: "insert", groups: ["insert"] },
    {
      name: "paragraph",
      groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"]
    },
    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
    { name: "forms", groups: ["forms"] },
    { name: "styles", groups: ["styles"] },
    { name: "colors", groups: ["colors"] },
    { name: "tools", groups: ["tools"] },
    { name: "links", groups: ["links"] },
    { name: "others", groups: ["others"] },
    { name: "about", groups: ["about"] }
  ];

  config.removeButtons =
    "EqnEditor,Iframe,Smiley,Flash,Image,Link,Unlink,Anchor,Language,Blockquote,CreateDiv,About";

  /**
   * 字符统计插件
   * @type {{showParagraphs: boolean, showWordCount: boolean, showCharCount: boolean, countSpacesAsChars: boolean, countHTML: boolean, maxWordCount: number, maxCharCount: number, filter: *}}
   */
  config.wordcount = {
    // 段落统计
    showParagraphs: true,
    // 词数统计
    showWordCount: true,
    // 字数统计
    showCharCount: true,
    // 将空格计入字符
    countSpacesAsChars: true,
    // 统计html
    countHTML: false,
    // 最大词数 -1代表无上限
    maxWordCount: -1,
    // 最大字数 -1代表无上限
    maxCharCount: -1,
    // 移除关键词统计 类似mediaembed 节点之类，可以设置不统计
    filter: new CKEDITOR.htmlParser.filter({
      elements: {
        div: function(element) {
          if (element.attributes.class == "mediaembed") {
            return false;
          }
        }
      }
    })
  };
};
