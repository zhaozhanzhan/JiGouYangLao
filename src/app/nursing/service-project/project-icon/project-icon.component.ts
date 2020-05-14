import { Component, OnInit } from '@angular/core';
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as $ from "jquery";
@Component({
  selector: 'app-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.css']
})
export class ProjectIconComponent implements OnInit {
  data:any; // 修改图标对象信息
  loading = false; // loading
  iocnloading = false; // loading
  iconMode:String;
  diyIconisVisible = false; // 自定义弹框
  sysIconisVisible = false; // 系统图标弹框
  sysIconList = []; // 系统图标
  sysIndex:number; // 选中系统图标
  picUrl:any; // 暂时显示本地图片
  diyIconInfo = {
    mode: "", // 图标模式
    word: "",
    fontColor: "",
    bacColor: "#ffffff",
    picUrl: {}
  }
  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.data = JSON.parse(this.route.snapshot.paramMap.get('info'));
    if(this.data["diyIconInfo"]){
      this.diyIconInfo = this.data.diyIconInfo;
      if(this.data["diyIconInfo"]["picUrl"]){
        this.picUrl = this.data["diyIconInfo"]["picUrl"];
      }
    }
  }

  // 返回
  goback(){
    window.history.back();
  }

  // 自定义图标
  diyIcon(){
    this.diyIconisVisible = true;
    this.diyIconInfo.picUrl = null;
  }
  diyIconModelOk(){
    if(!this.diyIconInfo.word){
      this.message.error("请输入图标字符（至少1位数字）");
      return
    }
    this.diyIconInfo.mode = "diy";
    this.diyIconisVisible = false;
  }
  diyIconModelCancel(){
    this.diyIconisVisible = false;
  }

  // 本地上传
  localUpImg(el:HTMLElement){
    el.click();
  }

  // 变更图片
  changepic(el:HTMLInputElement) {
    let that = this;
    var reader= new FileReader();
    that.diyIconInfo.picUrl = null;
    let imgFile = el.files[0];
    if(imgFile && imgFile.type){
      if (imgFile.type.indexOf('image') == 0) {
        reader.readAsDataURL(imgFile);
      } else {
        alert('文件类型仅为图片');
        return;
      }
    }
    reader.onload = function () {
      console.log("读取图片成功");
      that.picUrl = reader.result;
      that.diyIconInfo.mode = "local";
      that.compress(reader.result,200,200).then(data=>{
        that.diyIconInfo.picUrl = data[0];
      });
    };
  }

  // 对图片进行压缩
  compress(base64,wid,hgt) {
    let img = new Image();
    img.src = base64;
    var imgP = new Promise((resolve, reject) => {
      img.onload = function(){  // 这句很重要 如果立即调用未加载完成时，会画不出来图片
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        // 瓦片化canvas
        var tCanvas = document.createElement("canvas");
        var tctx = tCanvas.getContext("2d");
        var width = wid;
        var height = hgt;
        //图片像素大于400万像素，计算压缩到400万以下
        var ratio;
        if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio);
          width /= ratio;
          height /= ratio;
        } else {
          ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //如果图片太大则使用瓦片绘制
        var count;
        if ((count = width * height / 1000000 > 1)) {
          count = ~~(Math.sqrt(count) + 1);//计算分成的瓦片数
          var nw = ~~(width / count);
          var nh = ~~(height / count);
          tCanvas.width = nw;
          tCanvas.height = nh;
          for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }
        //进行最小压缩
        var ndata = canvas.toDataURL('image/jpeg', 0.3);
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        resolve(ndata)
      }
    });
    return Promise.all([imgP])
  }

  


  // 系统图标
  sysIcon(){
    setTimeout(()=>{this.iocnloading = true;},200);
    this.httpReq.get("service_item/getSysPic",null,data=>{
      setTimeout(()=>{this.iocnloading = false;},1000);
      if (data.code === 0) {
        this.sysIconList = data["data"];
        this.sysIconList.forEach(item=>{
          item["check"] = false;
        });
      }
    })
    this.sysIconisVisible = true;
  }
  // 选中
  selIcon(index){
    this.sysIndex = index;
    this.sysIconList.forEach(item=>{
      item["check"] = false;
    });
    this.sysIconList[index]["check"] = true;
  }

  sysIconModelOk(){
    this.picUrl = this.sysIconList[this.sysIndex].phtotUrl;
    this.diyIconInfo.picUrl = this.sysIconList[this.sysIndex].phtotUrl;
    this.diyIconInfo.mode = "sysIcon";
    this.sysIconisVisible = false;
  }
  sysIconModelCancel(){
    this.sysIconisVisible = false;
  }



  // 保存
  saveForm(){
    this.loading = true;
    // {"id": "服务项目Id","newPicEl": "新图标地址","accountId": "账户id"}
    let sendData = {
      id: this.data.id,
      newPicEl: JSON.stringify(this.diyIconInfo),
      accountId: JSON.parse(localStorage.getItem("UserInfo")).data.id
    };
    this.httpReq.post('service_item/editPicEl',null,sendData,data=>{
      this.loading = false;
      if(data.code === 0){
        this.message.success("保存成功！")
        window.history.back();
      }
    })
  }














}
