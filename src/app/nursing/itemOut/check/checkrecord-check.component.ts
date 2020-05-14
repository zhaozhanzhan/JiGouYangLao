import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-checkrecord-check",
  templateUrl: "./checkrecord-check.component.html",
  styleUrls: ["./checkrecord-check.component.scss"]
})
export class CheckRecordCheckComponent implements OnInit {
  obj;
   schedulingProgramName
   oldmanUrlList;
   logoImgsStr
  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {}

  ngOnInit() {
    const storehouseStr = this.route.snapshot.paramMap.get("data");
    this.obj=JSON.parse(storehouseStr);
    this.schedulingProgramName=this.obj.schedulingProgram.name
    this.logoImgsStr = this.obj.oldmanUrl;
    // if( this.obj.oldmanUrl !=""){
    //   this.oldmanUrlList=this.obj.oldmanUrl.split(",")
    // }else{
    //   this.oldmanUrlList=[];
    // }
 
  }

  back() {
    history.back();
  }
}
