import { Injectable } from "@angular/core";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { Pipe, PipeTransform } from "@angular/core";
@Injectable({ providedIn: "root" })
export class GetRelativeInfoService {
  constructor(private httpReq: HttpReqService) {}

  // 获取科室列表
  getOfficeList(fuc: Function) {
    return this.httpReq.post("section_office/listAllNoMedRoom", null, {}, fuc);
  }

  // 获取病区列表
  getsickWardList(fuc: Function) {
    return this.httpReq.post("sickWard/listAll", null, {}, fuc);
  }

  // 根据科室获取对应病区
  getOfficeListForSickWard(officeId, fuc: Function) {
    return this.httpReq.post(
      "sickWard/listSickWard",
      null,
      { sectionOfficeId: officeId },
      fuc
    );
  }

  // 获取医生列表
  getDoctorList(fuc: Function) {
    return this.httpReq.post("doctorNew/listAll", null, {}, fuc);
  }

  // 获取药房列表
  getMedRoomList(fuc: Function) {
    return this.httpReq.post("med_room/listAll", null, {}, fuc);
  }
}

