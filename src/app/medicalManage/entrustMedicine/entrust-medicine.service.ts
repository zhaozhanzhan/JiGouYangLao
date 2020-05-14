import { Injectable } from '@angular/core';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
@Injectable()
export class EntrustMedicineService {

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

  // 只保留两位小数过滤
  numberPipe(obj){
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
      obj.value= parseFloat(obj.value);  
    }
  }
  
}

