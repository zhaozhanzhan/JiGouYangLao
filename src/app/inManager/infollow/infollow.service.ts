import { Injectable } from '@angular/core';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
@Injectable()
export class InfollowService {

  constructor(private httpReq: HttpReqService) { }

  // 获取建筑
  getBuild(fuc){
    return this.httpReq.get('building/list',null,fuc)
  }

  // 获取楼层
  getFloor(buildId,fuc){
    return this.httpReq.post('floor/list', null, {buildingId:buildId}, fuc);
  }

  // 获取房间
  getRoom(floorId,fuc){
    return this.httpReq.post('room/list', null, {floorId:floorId}, fuc);
  }

  // 获取用药频次
  getMedFrequency(fuc){
    return this.httpReq.post('dictionaryMedicationData/dataListAllTwo', null, {dictTypes: "delegationFrequency"}, fuc);
  }

  // 药品名查找
  getMedName(name,fuc){
    return this.httpReq.post('drugs/AllList', null, {search: name}, fuc);
  }


}
