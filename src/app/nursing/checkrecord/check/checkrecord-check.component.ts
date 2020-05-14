import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-checkrecord-check",
  templateUrl: "./checkrecord-check.component.html",
  styleUrls: ["./checkrecord-check.component.scss"]
})
export class CheckRecordCheckComponent implements OnInit {
  checkRecord;
  list;
  data = {
    room: {
      floor: {
        building: {
          buildingName: ""
        },
        floorName: ""
      },
      roomName: ""
    },
    createDate: "",
    abnormal: true,
    employees: {
      name: ""
    },
    checkResult: ""
  };
  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {}

  ngOnInit() {
    let checkRecordStr = this.route.snapshot.paramMap.get("checkRecord");
    this.checkRecord = JSON.parse(checkRecordStr);

    this.httpReq.post(
      "checkRecord/findById",
      null,
      { id: this.checkRecord.id },
      data => {
        if (data["status"] == 200) {
          if (data.code == "0") {
            this.data = data["data"];
          } else {
          }
        }
      }
    );
  }

  back() {
    history.back();
  }
}
