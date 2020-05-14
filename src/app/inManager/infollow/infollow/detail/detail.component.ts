import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  
  olderId;
  constructor(private route: ActivatedRoute,private modalService: NzModalService) { }

  ngOnInit() {
    // console.log(this.route.snapshot.paramMap.get('id')) 
    this.olderId = this.route.snapshot.paramMap.get('id');
  }

  back(everyComponent){
    let title:string;
    if(everyComponent.tabs.every((item)=>{if(!item['id']) title = item['title']; return item['id'].length > 0})){
      window.history.back();
    }else{
      this.modalService.confirm({
        nzTitle: `每日跟进中存在标签页“${title}”数据未保存，确认退出？`,
        nzOnOk: () => {
          window.history.back();
        }
      });
    }
  }
}
