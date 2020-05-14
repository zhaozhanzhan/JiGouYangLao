import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "../../../../../node_modules/ng-zorro-antd";
@Component({
  selector: "mirr-image",
  templateUrl: "ocrimage.component.html"
})
export class OcrImageComponent implements OnInit, OnChanges {
  @Input()
  public ocrData;
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ocrImg(url: string) {
    const that = this;
  }
}
