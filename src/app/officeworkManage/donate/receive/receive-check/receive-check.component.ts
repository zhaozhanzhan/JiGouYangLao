import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-receive-check",
  templateUrl: "./receive-check.component.html",
  styleUrls: ["./receive-check.component.css"]
})
export class ReceiveCheckComponent implements OnInit {
  outStorehouse;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    let outStorehouseStr = this.route.snapshot.paramMap.get("outStorehouse");
    this.outStorehouse = JSON.parse(outStorehouseStr);
    console.log("tag", this.outStorehouse);
  }
  back() {
    history.back();
  }
}
