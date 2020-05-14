import { Injectable } from '@angular/core';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
import { Pipe, PipeTransform } from "@angular/core";
@Injectable({providedIn:'root'})
export class GetRelativeInfoService {

  constructor(private httpReq: HttpReqService) { }

  // 获取科室列表
  getOfficeList(fuc:Function){
    return this.httpReq.post('section_office/listAllNoMedRoom', null, {}, fuc);
  }

  // 获取病区列表
  getsickWardList(fuc:Function){
    return this.httpReq.post('sickWard/listAll', null, {}, fuc);
  }

  // 根据科室获取对应病区
  getOfficeListForSickWard(officeId,fuc:Function){
    return this.httpReq.post('sickWard/listSickWard', null, {sectionOfficeId:officeId}, fuc);
  }

  // 获取医生列表
  getDoctorList(fuc:Function){
    return this.httpReq.post('doctorNew/listAll', null, {}, fuc);
  }

  // 获取药房列表
  getMedRoomList(fuc:Function){
    return this.httpReq.post('med_room/listAll', null, {}, fuc);
  }

}

/**
 * 
 * 
 * @export 药剂类型转换管道
 * @class DosageFormPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: "dosageFormPipe"
})
export class DosageFormPipe implements PipeTransform {
  constructor() {}
  transform(value: any) {
    let state: string = "";
    if (value == "0") {
      state = "片剂";
    } else if (value == "1") {
      state = "胶囊剂";
    } else if (value == "2") {
      state = "口服酊膏剂";
    } else if (value == "3") {
      state = "口服丸剂";
    } else if (value == "4") {
      state = "口服颗粒、粉、散剂";
    } else if (value == "5") {
      state = "外用酊、膏、贴、粉剂";
    } else if (value == "6") {
      state = "外用涂剂、栓剂";
    } else if (value == "7") {
      state = "注射剂";
    } else if (value == "8") {
      state = "兴奋剂";
    } else if (value == "9") {
      state = "麻黄碱制剂";
    }
    return state;
  }
}
