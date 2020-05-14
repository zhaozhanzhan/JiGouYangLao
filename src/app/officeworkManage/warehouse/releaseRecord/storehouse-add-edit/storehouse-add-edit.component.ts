import { RoomNamePipe } from './../../../../operationManage/cardPrint/roomCardPrint/roomname.pipe';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { FormBuilder, Validators } from "@angular/forms";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";
import { LocalStorage } from "../../../../common/service/local.storage";
@Component({
  selector: "app-storehouse-add-edit",
  templateUrl: "./storehouse-add-edit.component.html",
  styleUrls: ["./storehouse-add-edit.component.css"]
})
export class ReleaseRecordAddEditComponent implements OnInit {
 obj;
 schedulingProgramName
 oldmanUrlList;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    const storehouseStr = this.route.snapshot.paramMap.get("data");
    this.obj=JSON.parse(storehouseStr);
    this.schedulingProgramName=this.obj.schedulingProgram.name
    if( this.obj.oldmanUrl !=""){
      this.oldmanUrlList=this.obj.oldmanUrl.split(",")
    }else{
      this.oldmanUrlList=[];
    }

  }

  back() {
    history.back();
  }

}
