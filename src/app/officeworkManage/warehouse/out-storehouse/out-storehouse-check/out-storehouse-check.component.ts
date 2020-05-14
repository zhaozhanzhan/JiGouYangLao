import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-out-storehouse-check',
  templateUrl: './out-storehouse-check.component.html',
  styleUrls: ['./out-storehouse-check.component.css']
})
export class OutStorehouseCheckComponent implements OnInit {
  outStorehouse;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    let outStorehouseStr = this.route.snapshot.paramMap.get('outStorehouse');
    this.outStorehouse = JSON.parse(outStorehouseStr);
    if(this.outStorehouse.toSche==false){
      this.outStorehouse.toSche="false"
    }else{
      this.outStorehouse.toSche="true"
    }
    console.log('tag', this.outStorehouse)
  }
  back() {
    history.back();
  }
}
