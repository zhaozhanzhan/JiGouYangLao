import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService, NzTreeNode, NzFormatEmitEvent } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-goods-classification",
  templateUrl: "./goods-classification.component.html",
  styleUrls: ["./goods-classification.component.css"]
})
export class GoodsClassificationComponent implements OnInit {
  validateForm;
  addForm;

  selectKey;

  isEditing = false;
  isAdding = false;

  nodes = [];

  userInfo;

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: ["", [Validators.required]],
      comment: ["", []]
    });

    this.addForm = this.fb.group({
      name: ["", [Validators.required]],
      comment: ["", []]
    });

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    console.log(this.userInfo);

    this.updateTree();
  }

  updateTree() {
    this.nodes = [];
    this.httpReq.post("goodsCategory/listAll", null, {}, data => {
      if (data["status"] == 200) {
        const result = JSON.parse(data["data"]);
        console.log(result);
        result.forEach(element => {
          this.nodes.push(new NzTreeNode(element));
        });
      }
    });
  }

  nzEvent(e: NzFormatEmitEvent): void {
    const nodeOrgin = e.node.origin;
    this.validateForm.patchValue({
      name: nodeOrgin.title,
      comment: nodeOrgin.comment
    });
    this.validateForm.disable();

    this.selectKey = e.selectedKeys[0];
    console.log(this.selectKey);
  }

  turnToAdd() {
    this.addForm.reset();
    this.isAdding = true;
  }

  turnToEdit() {
    this.isEditing = true;
    this.validateForm.enable();
  }

  saveForm() {
    let reqObj = this.validateForm.value;
    reqObj.id = this.selectKey.origin.key;
    reqObj.parentId = this.selectKey.origin.parentId;
    reqObj.accountId = this.userInfo.id;
    this.httpReq.post("goodsCategory/edit", null, reqObj, data => {
      if (data["status"] == 200) {
        if (data.code == 0) {
          this.message.success("保存成功！");
          this.updateTree();
          this.isEditing = false;
          this.validateForm.disable();
        } else {
          this.message.error(data.message);
        }
      }
    });
  }

  cancelForm() {
    this.validateForm.patchValue({ name: this.selectKey.title });
    this.validateForm.disable();
    this.isEditing = false;
  }

  saveAddForm() {
    console.log(this.selectKey);
    let reqObj = this.addForm.value;
    reqObj.accountId = this.userInfo.id;
    if (this.selectKey) {
      reqObj.parentId = this.selectKey.origin.key;
    }
    console.log(reqObj);
    this.httpReq.post("goodsCategory/save", null, reqObj, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateTree();
        this.isAdding = false;
      }
    });
  }

  cancelAddForm() {
    this.addForm.reset();
    this.isAdding = false;
  }

  delete() {
    this.globalService.delModal(() => {
      this.httpReq.post(
        "goodsCategory/delete",
        null,
        { id: this.selectKey.origin.key },
        data => {
          if (data["status"] == 200) {
            if (data["code"] == 0) {
              this.message.success("删除成功！");
              this.updateTree();
              this.selectKey = undefined;
            } else {
              this.message.error(data.message);
            }
          }
        }
      );
    });
  }
}
