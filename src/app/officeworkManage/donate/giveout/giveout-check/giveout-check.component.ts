import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-giveout-check",
  templateUrl: "./giveout-check.component.html",
  styleUrls: ["./giveout-check.component.css"]
})
export class GiveoutCheckComponent implements OnInit {
  outStorehouse;
  toScheDisplay
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    let outStorehouseStr = this.route.snapshot.paramMap.get("outStorehouse");
    this.outStorehouse = JSON.parse(outStorehouseStr);
    console.log("tag", this.outStorehouse);
    if(this.outStorehouse.toSche==false){
      this.outStorehouse.toSche="false"
      this.toScheDisplay=false
    }else{
      this.outStorehouse.toSche="true"
      this.toScheDisplay=true
    }
  }
  back() {
    history.back();
  }
}
