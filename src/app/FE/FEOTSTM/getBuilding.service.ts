import { Injectable } from "@angular/core";
import { HttpReqService } from "../../common/service/HttpUtils.Service";

@Injectable({providedIn: 'root'})
export class getBuildingService {
  constructor(private httpReq: HttpReqService) {}

  /**
   * 获取建筑
   * @param {*} fuc 回调涵数
   * @returns
   * @memberof EntrustMedicineService
   */
  public getBuild(fuc: Function) {
    return this.httpReq.get("building/list", null, fuc);
  }

  /**
   * 获取楼层
   * @param {*} buildId 建筑ID
   * @param {*} fuc 回调涵数
   * @returns
   * @memberof EntrustMedicineService
   */
  public getFloor(buildId: string, fuc: Function) {
    return this.httpReq.post("floor/list", null, { buildingId: buildId }, fuc);
  }

  /**
   * 获取房间
   * @param {*} floorId 楼层ID
   * @param {*} fuc 回调涵数
   * @returns
   * @memberof EntrustMedicineService
   */
  public getRoom(floorId: string, fuc: Function) {
    return this.httpReq.post("room/list", null, { floorId: floorId }, fuc);
  }
}
