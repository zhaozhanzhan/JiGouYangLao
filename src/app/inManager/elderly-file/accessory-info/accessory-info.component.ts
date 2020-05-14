import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-accessory-info",
  templateUrl: "./accessory-info.component.html",
  styleUrls: ["./accessory-info.component.css"]
})
export class AccessoryInfoComponent implements OnInit {
  //加载数据时的状态
  loadingDataState = false;
  //保存数据时的状态
  saveLoadingState = false;
  //选中分页下标
  selectedAccessoryId = "";

  accessoryList = [];

  //老人id
  oldmanId: string = "";

  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {
    this.oldmanId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.listAccessoryItems();
  }

  listAccessoryItems() {
    let reqObj = { dictType: "apply_in_attachment" };
    let that = this;
    this.httpReq.post("dictMgt/listDataByType", null, reqObj, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        that.accessoryList = data["data"];
        if (that.accessoryList && Utils.isArray(that.accessoryList)) {
          that.accessoryList.forEach(element => {
            element.imageUrls = "";
          });
        }
      }
    });
  }

  /**
   * 保存附件材料上传的图片
   * @param type
   */
  saveAccessory(accessoryId: string, saveImgUrlsArray: Array<string>) {
    let imgUrls = saveImgUrlsArray.toString();
    let that = this;
    let queryParam = {
      oldmanId: this.oldmanId,
      dictId: accessoryId,
      url: imgUrls
    };
    that.saveLoadingState = true;
    this.httpReq.post(
      "applyInAttachment/saveOrUpdate",
      null,
      queryParam,
      data => {
        that.saveLoadingState = false;
        if (data["status"] == 200) {
          console.log("tag", data);
        }
      }
    );
  }

  /**
   * 当前选择的附件材料项目在字典表中的id
   */
  selectTabListener(accessoryId: string, item, mirrImage) {
    //重置显示的图片
    let that = this;
    // item.imageUrls = "";

    let queryParam = { oldmanId: this.oldmanId, dictId: accessoryId };
    // that.loadingDataState = true;
    this.httpReq.post(
      "applyInAttachment/listByOldman",
      null,
      queryParam,
      data => {
        if (data["status"] == 200) {
          that.loadingDataState = false;
          if (!Utils.isObject(data["data"]) && !Utils.isEmpty(data["data"])) {
            item.imageUrls = data["data"];
          } else {
            item.imageUrls = "";
          }
          mirrImage.refreshImgList();
        }
      }
    );
  }
}
