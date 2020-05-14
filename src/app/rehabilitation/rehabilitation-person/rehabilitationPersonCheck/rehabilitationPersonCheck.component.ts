import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: "app-rehabilitationPersonCheck",
  templateUrl: "./rehabilitationPersonCheck.component.html",
  styleUrls: ["./rehabilitationPersonCheck.component.css"]
})
export class RehabilitationPersonCheckComponent implements OnInit {
  // 获得用户信息变量
  validateForm;

  // 点击老人时绑定页面的信息
  interview = {
    name: ""
  };
  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      name: ["", [Validators.required]],
      recureName: ["", [Validators.required]],
      applyDate: [""]
    });
  }

  savePersonalBtnLoading = false;
  ShowDisabled = true;

  recureObj = {
    recureName: "",
    applyDate: "",
    accountId: ""
  };
  ngOnInit() {
    // 编辑时获得的信息
    const rehabilitationPersonStr = this.route.snapshot.paramMap.get("info");
    if (rehabilitationPersonStr) {
      this.ShowDisabled = false;
      const rehabilitationPerson = JSON.parse(rehabilitationPersonStr);
      this.interview.name = rehabilitationPerson.name;
      this.recureObj.recureName = rehabilitationPerson.recureName;
      this.recureObj.applyDate = rehabilitationPerson.applyDate;
    }
  }

  // 返回
  back() {
    history.back();
  }
}
