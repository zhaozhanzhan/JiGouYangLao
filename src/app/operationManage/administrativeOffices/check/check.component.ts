
import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { ActivatedRoute } from "@angular/router";
import { NzTreeNode } from "ng-zorro-antd";
@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.scss"]
})
export class CheckComponent implements OnInit {
  goodsClassificationNodes;
  departmentId;
  reqObjGoodName;
  result
  constructor(
    private httpReq: HttpReqService,//数据请求
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
     // 当是修改时
     let data = this.route.snapshot.paramMap.get("data");
     if (data) {
       this.result =JSON.parse(data)
       console.log("----------------"+  this.result.name)
       this.departmentId = this.result.department.id;
       this. getDepartmentNode();
       
     }
  }



  // 获得所有的部门节点
  getDepartmentNode() {
    //  获得部门的数据
    this.goodsClassificationNodes = [];
    this.httpReq.post("/department/listTreeAll", null, {}, data => {
      if (data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        result.forEach(element => {
          this.goodsClassificationNodes.push(new NzTreeNode(element));
          if (this.departmentId != "") {
            this.getReqObjGoodName(this.goodsClassificationNodes,this.departmentId);
          }
        });
      }
    });
  }

   // 递归循环树形结构获得所属部门
   getReqObjGoodName(arr , departmentID:string){
    if(arr.length>0){
      arr.forEach(e => {
        if(e.key==departmentID){
          this.reqObjGoodName = e.title;
          return;
        }else{
          this.getReqObjGoodName(e.children,departmentID);
        }
      });
    }
  }
 
  // 返回按钮
  back() {
    history.back();
  }

  
}
