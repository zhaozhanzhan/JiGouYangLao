import { Component, OnInit } from '@angular/core';
import { GetRelativeInfoService } from '../get-relative-info.service';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { pureFunctionV } from '@angular/core/src/render3/pure_function';
import { EntrustMedicineService } from '../entrust-medicine.service';
@Component({
  selector: 'app-display-and-send-medicien',
  templateUrl: './display-and-send-medicien.component.html',
  styleUrls: ['./display-and-send-medicien.component.css']
})
export class DisplayAndSendMedicienComponent implements OnInit {
  userInfo; //用户信息
  public buildArr = []; // 建筑列表
  public floorArr = []; // 楼层列表
  public roomArr = []; // 房间列表

  sendData = {
    name: '', //病人（老人姓名）
    buildingId: '', //建筑Id
    floorId: '', //楼层Id
    roomId: '', //房间Id
    sendMedStatus: '0', //发药状态（0:未发 1：已发）
    prescriptionType: '', //处方类型 1：精一处方 2：精二处方 3：普通处方"
    sendMedDateStart: '', //查询发药开始日期
    sendMedDateEnd: '', //查询发药结束日期
    page: 0, //页码
    size: 100 //每页数量
  };

  sendData2 = {
    cpDescList: [], //药品列表
    medRoomId: '', //药房Id
    accountId: '' //登录账户Id
  };

  totalElements; // 总条数
  listOfData = []; // 列表数据
  isLoading = false; //
  medRoomList; // 药房列表
  selDate;  //查询日期范围
  allChecked = false; // 是否全选
  isPartSel = false; // 是否半选中
  cpDescListIds = [];

  constructor(
    public getInfo: GetRelativeInfoService,
    public httpReq: HttpReqService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private entrSer: EntrustMedicineService, // 获层建筑、楼层、房间
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('UserInfo')).data;
    console.log(this.userInfo);

    var that = this;
    document.getElementsByClassName('ant-tabs-bar')[0]['style']['display'] = 'none';
    if (sessionStorage.getItem(this.router.url)) {
      // console.log(JSON.parse(sessionStorage.getItem(this.router.url)));
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      this.sendData.page = 0;
    }

    this.getInfo.getMedRoomList(data => {
      this.medRoomList = data.data instanceof Array ? data.data : [{ medRoomName: '暂无药房', id: '' }];
      if (!this.sendData2.medRoomId) this.sendData2.medRoomId = this.medRoomList[0].id;
    });

    // 获取建筑、楼层、房间 备选
    this.entrSer.getBuild(data => {
      return new Promise((resolv, reject) => {
        if (data.code == 0) {
          this.buildArr = data["data"];
          this.buildArr.unshift({buildingName:'全部',id:''});
          if (!this.sendData.buildingId) this.sendData.buildingId = data["data"][0].id;
          resolv(this.sendData.buildingId);
        }
      }).then(buildId => {
        if(!buildId) {
          this.floorArr = [{floorName:'全部',id:''}];
          this.roomArr = [{roomName:'全部',id:''}];
          this.sendData.floorId = '';
          this.sendData.roomId = '';
          this.getList();
        }else{
          this.reFreshBuild(buildId, false);
        } 
        
      });
    });

  }

  /** 修改建筑更新
   * @param {*} buildId
   * @param {Boolean} [changeFloor=true] 是否将楼层置新
   * @memberof EntrustMedicineComponent
   */
  reFreshBuild(buildId, changeFloor: Boolean = true) {
    if(buildId){
      this.entrSer.getFloor(buildId, (data2) => {
        return new Promise((resolv, reject) => {
          if (data2.code == 0) {
            this.floorArr = data2['data'];
            this.floorArr.unshift({floorName:'全部',id:''});
            if (changeFloor || !this.sendData.floorId) this.sendData.floorId = data2['data'][0].id;
            resolv(this.sendData.floorId);
          }
        }).then((floorId) => {
          this.reFreshFloor(floorId, changeFloor);
        })
      })
    }else{
      this.floorArr = [{floorName:'全部',id:''}];
      this.roomArr = [{roomName:'全部',id:''}];
      this.sendData.floorId = '';
      this.sendData.roomId = '';
      this.getList(true);
    } 
  }
  /** 修改建筑更新
   * @param {*} floorId
   * @param {Boolean} [changeRoom=true] 是否将房间置新
   * @memberof EntrustMedicineComponent
   */
  reFreshFloor(floorId, changeRoom: Boolean = true) {
    if(floorId){
      this.entrSer.getRoom(floorId, (data3) => {
        if (data3.code == 0) {
          this.roomArr = data3['data'];
          this.roomArr.unshift({ roomName: '全部', id: '' });
          if (changeRoom || !this.sendData.roomId) this.sendData.roomId = data3['data'][0].id;
          this.getList(true);
        }
      })
    }else{
      this.roomArr = [{roomName:'全部',id:''}];
      this.sendData.roomId = '';
      this.getList(true);
    }
    
  }


  // 获取医嘱列表
  getList(reset: boolean = false): void {
    if (reset) {
      this.sendData.page = 0;
    }
    // this.sendData.page = this.sendData.page - 1;
    // this.sendData.size = this.sendData.size;
    if (this.sendData.page < 0) {
      this.sendData.page = 0;
    }

    this.isLoading = true;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
    this.httpReq.post('clinicSendMed/listPage', null, this.sendData, data => {
      this.isLoading = false;
      if (data.code == 0) {
        const result = JSON.parse(data.data);
        console.log(result);
        this.listOfData = result.cpList;
        this.totalElements = result.totalElements;
        this.listOfData.forEach((cp) => {
          cp.cpDescList.forEach(cpDesc => {
            cpDesc["checked"] = false;  
          });
        });
      }
    });
  }

  // 选中
  checkBoxChange(data) {
    console.log(data);
    // 点中后改变checked值
    data.checked = !data.checked;
    if (data.checked) {
      if (this.cpDescListIds.indexOf(data.cpDescId) == -1)
        this.cpDescListIds.push(data.cpDescId);
    } else {
      let index = this.cpDescListIds.indexOf(data.cpDescId);
      if (index !== -1) this.cpDescListIds.splice(index, 1);
    }
    // 全选
    if (this.cpDescListIds.length == this.listOfData.length) {
      this.isPartSel = false;
      this.allChecked = true;
    } else {
      if (this.cpDescListIds.length == 0) {
        this.isPartSel = false;
        this.allChecked = false;
      } else this.isPartSel = true;
    }

    console.log(this.cpDescListIds); 
  }

  // 页码变更
  PageIndexChange(PageIndexNum) {
    this.sendData.page = PageIndexNum - 1;
    this.getList();
  }

  // 每页条数变更
  PageSizeChange(PageSize) {
    this.sendData.size = PageSize;
    this.getList();
  }

  // 发药
  givingMedicine() {
    if (this.cpDescListIds.length == 0) {
      this.message.error('无选中条目!');
      return;
    }

    this.sendData2.accountId = this.userInfo.id;
    this.sendData2.cpDescList = [];
    this.cpDescListIds.forEach(element => {
      this.sendData2.cpDescList.push({cpDescId: element})
    });

    this.modalService.confirm({
      nzTitle: '确认发药？',
      nzContent: '',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.httpReq.post('clinicSendMed/sendMedDrug', null, this.sendData2, data => {
          if (data.code == 0) {
            this.cpDescListIds = [];
            this.allChecked = false;
            this.isPartSel = false;
            this.message.success('发药成功！');
            this.getList();
          } else {
            // this.message.error(data.data.message);
          }
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => {}
    });
  }

  // 是否全选
  checkBoxAllChange() {
    this.allChecked = !this.allChecked;
    console.log(this.allChecked);
    this.isPartSel = false;
    if (this.allChecked) {
      this.listOfData.forEach((cp) => {
        cp.cpDescList.forEach(cpDesc => {
          cpDesc["checked"] = false;
          this.checkBoxChange(cpDesc);
        });
      });
      console.log(this.cpDescListIds);
    } else {
      this.listOfData.forEach((cp) => {
        cp.cpDescList.forEach(cpDesc => {
          cpDesc["checked"] = false;
        });
      });
      this.cpDescListIds = [];
    }
  }

  // 选择日期格式化
  dateChange(data) {
    console.log(this.selDate);
    if (!data.length) {
      this.sendData.sendMedDateStart = "";
      this.sendData.sendMedDateEnd = "";
      return;
    }
    this.sendData.sendMedDateStart =
      data[0].getFullYear() +
      "-" +
      (data[0].getMonth() + 1 < 10
        ? "0" + (data[0].getMonth() + 1)
        : data[0].getMonth() + 1) +
      "-" +
      (data[0].getDate() < 10 ? "0" + data[0].getDate() : data[0].getDate());
    this.sendData.sendMedDateEnd =
      data[1].getFullYear() +
      "-" +
      (data[1].getMonth() + 1 < 10
        ? "0" + (data[1].getMonth() + 1)
        : data[1].getMonth() + 1) +
      "-" +
      (data[1].getDate() < 10 ? "0" + data[1].getDate() : data[1].getDate());
    console.log(this.sendData.sendMedDateStart, this.sendData.sendMedDateEnd);
    // console.log(this.selDate);
  }
}
