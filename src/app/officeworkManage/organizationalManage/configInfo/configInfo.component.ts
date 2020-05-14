import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Utils } from "../../../common/utils/utils";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../common/service/GlobalMethod";

declare var BMap: any;
@Component({
  selector: "app-organizationa-configInfo",
  templateUrl: "configInfo.component.html",
  styleUrls: ["./configInfo.component.css"]
})
export class ConfigInfoComponent implements OnInit {
  logoImgsStr = "";
  photoImgsStr = "";
  isSaveLoading = false;
  public formData: FormGroup; // 定义表单对象
  myMap = null;
  myGeo = null;
  placeSearch = null;
  searchAddress = "";
  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private msg: NzMessageService,
    private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService // 自定义JS工具类
  ) {}

  ngOnInit() {
    this.formData = this.fb.group({
      id: [""], //信息id（新增传空值）
      organName: [""], //机构名称
      organLogo: [""], //机构logo
      organIntroduction: [""], //机构介绍
      images: [""], //机构图片资料（多图片）
      longitude: [""], //经度
      latitude: [""] //纬度
    });

    this.getInfo();
  }

  initBMap() {
    const that = this;
    this.myMap = new BMap.Map("container"); // 创建地图实例
    this.myMap.enableScrollWheelZoom(); // 启用滚轮
    this.myMap.centerAndZoom(new BMap.Point(120.381083, 31.486431), 15); // 初始化地图，设置中心点坐标和地图级别
    if (
      !Utils.isEmpty(that.formData.value.longitude) &&
      !Utils.isEmpty(that.formData.value.latitude)
    ) {
      let point = new BMap.Point(
        that.formData.value.longitude,
        that.formData.value.latitude
      );
      that.myMap.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      that.setMarker(point);
    }
    this.myMap.addEventListener("click", e => {
      that.setMarker(e.point);
    });
    // 创建地址解析器实例
    this.myGeo = new BMap.Geocoder();
    this.placeSearch = new BMap.LocalSearch(this.myMap, {
      renderOptions: { map: this.myMap }
    });
  }

  inputChange(event) {
    if (event.keyCode == 13) {
      this.placeSearch.search(this.searchAddress);
    }
  }
  //设置标记
  setMarker(point) {
    this.myMap.clearOverlays();
    this.myMap.addOverlay(new BMap.Marker(point));
    this.formData.value.latitude = point.lat;
    this.formData.value.longitude = point.lng;
  }

  saveInfo(logoImgs: Array<string>, photoImgs: Array<string>) {
    this.formData.value.organLogo = logoImgs.toString();
    this.formData.value.images = photoImgs.toString();

    if (this.formData.value.organLogo.length > 500) {
      this.msg.error("机构logo图片过多！");
      return;
    }

    if (this.formData.value.images.length > 500) {
      this.msg.error("机构图片资料图片过多！");
      return;
    }
    const that = this;
    const formDataCtrl = this.formData.controls;
    const formData = this.jsUtil.deepClone(this.formData.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
    }

    if (this.formData.invalid) {
      // 表单较验未通过
      return;
    }

    this.isSaveLoading = true;
    this.httpReq.post("organSysCfgInfo/saveOrUpdate", null, formData, data => {
      that.isSaveLoading = false;
      if (data["code"] == 0) {
        that.msg.success("保存成功！");
      }
    });
  }

  getInfo() {
    const that = this;
    this.httpReq.post("organSysCfgInfo/list", null, null, data => {
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          let resultData = data["data"];
          GlobalMethod.setForm(this.formData, resultData); // 表单赋值
          if (resultData && resultData.images) {
            that.photoImgsStr = resultData.images;
          }

          if (resultData && resultData.organLogo) {
            that.logoImgsStr = resultData.organLogo;
          }
        } else {
          that.msg.error(data["message"]);
        }
      }
    });
  }
}
