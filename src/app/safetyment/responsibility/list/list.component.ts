import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  assignedTeamsAdd=false;//添加按钮显示
  appayType='1';
  listName='班组列表'
  isShowOldDialog=false;//显示个人信息弹出框
  isOldTableLoading = false;//老人列表table加载状态
  searchOldName = "";
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };

  oldQueryParams = {
      name: "",
      page: 0,
      size: 10,

  };
  date = "";
// 班组列表参数
  queryParams = {
    page: 0,
    size: 10,
    name: '',
  };
  //每个班组负责的消防区域列表参数
  fireArea={
    page:0,
    size:10,
  }
  isTableLoadingFireArea=false;//加载状态
  FireAreaArray=[];
  resultData1 = {
    totalElements: 0
  };
  fireName="";
  fireName1="";
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };
  selectedGroupId=''
  // 分配责任的参数
  AssignResponsibilityD={
    id:'',
    areaIds:""
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));

    }
    this.loadingDataArray(true);
  }
  assignedTeams(){//选择是给个人还是给班组分配区域
    if(this.appayType=='2'){
      this.assignedTeamsAdd=true;
      this.listName="个人列表"
      this.PersonalList(true);
    }else{
      this.assignedTeamsAdd=false;
      this.listName="班组列表"
      this.loadingDataArray(true)
    }
  }

  addListUser(){//点击添加时弹出用户个人信息
    this.isShowOldDialog=true;
    this.loadingOldList(true)//弹窗显示时就加载用户列表
  }
/**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }
 /**
   *加载未添加的用户列表
   */
  loadingOldList(reset: boolean = false) {
    const that = this;
    if (reset) {
      this.oldQueryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldQueryParams.page = this.oldQueryParams.page - 1;
      if (this.oldQueryParams.page < 0) {
        this.oldQueryParams.page = 0;
      }
    }
    that.oldQueryParams.name = that.searchOldName;
    that.isOldTableLoading = true;
    let param = this.httpReq.post(
      "account/noffdaddlist",
      null,
      this.oldQueryParams,
      data => {
        that.oldQueryParams.page++;
        that.isOldTableLoading = false;
        if (data["status"] == 200) {
          if(data.code=="0"){
            this.oldDataArray = data["data"]["content"]; // 数据列表
            this.oldResultData.totalElements = data["data"]["totalElements"]; // 总条数
          }else{
            this.createMessage('error',data['message']);
          }
        }
      }
    );
  }
   /**
   * 选择了一个用户，添加到个人里面
   */
  chooseUser={
    id:''
  }
  chooseOld(oldInfoId) {
    let that=this;
    that.chooseUser.id=oldInfoId;
    let param = this.httpReq.post(
      "account/ffdaddacco",
      null,
      this.chooseUser,
      data => {
        if (data["status"] == 200) {
          if(data.code=="0"){
            this.createMessage('success',"添加成功");

            this.PersonalList(true)
          }else{
            this.createMessage('error',data['message']);
          }
        }
      }
    );
    this.isShowOldDialog = false;
  }

    /**
   * 从列表中移除
   */
  removePersonalUserID={
    id:''
  }
  removePersonalUser(oldInfoId,e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let that=this;
    that.removePersonalUserID.id=oldInfoId;
    let param = this.httpReq.post(
      "account/ffdrmvacco",
      null,
      this.removePersonalUserID,
      data => {
        if (data["status"] == 200) {
          if(data.code=="0"){
            this.createMessage('success',"移除成功");
            this.PersonalList(true)
          }else{
            this.createMessage('error',data['message']);
          }
        }
      }
    );

    this.isShowOldDialog = false;

  }


  turnToEdit(inApply) {
    this.router.navigate(["info", JSON.stringify(inApply)], {
      relativeTo: this.route
    });
  }
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
      }
  // 班组的请求列表
  loadingDataArray(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }

    that.isTableLoading = true;
    let param = this.httpReq.post(
      "schedulingProgram/list",
      null,
      this.queryParams,
      data => {

        this.queryParams.page++;
        sessionStorage.setItem(
          this.router.url,
          JSON.stringify(this.queryParams)
        );

        that.isTableLoading = false;
        if (data["status"] == 200) {
          this.dataArray=[]
          if(data.code==0){
            data["data"]=JSON.parse( data["data"])
            this.dataArray = data["data"]["memo"]; // 数据列表
            this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
            for(var i=0;i<this.dataArray.length;i++){
              if(i==0){
                this.loadingDataFireArea(this.dataArray[0].id,this.dataArray[0].name,true)
              }
            }

          }else{
            this.createMessage('error',data['message']);
          }
        }
      }
    );
  }
    // 个人请求列表的参数
    personListParameters ={
      page:0,
      size:10
    }
    // 个人的请求列表
    PersonalList(reset: boolean = false) {
      const that = this;

      if (reset) {
        this.personListParameters.page = 0;
      } else {
        //接口page从0下标位开始
        this.personListParameters.page = this.personListParameters.page - 1;
        if (this.personListParameters.page < 0) {
          this.personListParameters.page = 0;
        }
      }

      that.isTableLoading = true;
      let param = this.httpReq.get(
        "account/ffdaddlist",
        this.personListParameters,
        data => {
          this.personListParameters.page++;

          that.isTableLoading = false;
          if (data["status"] == 200) {
            this.dataArray=[];
            if(data.code==0){
              // data["data"]=JSON.parse( data["data"])
              this.dataArray = data["data"]["content"]; // 数据列表
              this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
              for(var i=0;i<this.dataArray.length;i++){
                if(i==0){
                  this.loadingDataFireArea(this.dataArray[0].id,this.dataArray[0].name,true)
                }

              }

            }else{
              this.createMessage('error',data['message']);
            }
          }
        }
      );
    }
// 每个班组负责的消防区域的请求列表
  fireNameOne=""
  loadingDataFireArea(id,name,reset: boolean = false) {

    if(id=="" && name==""){
      id= this.selectedGroupId;
      name=this.fireNameOne;
    }
    console.log(id+name)
    this.selectedGroupId=id //班组的ID
    this.AssignResponsibilityD.id=id;//班组的ID
    this.fireNameOne=name;
    const that = this;
     // 保存班组名称
     if(name!=""){
      that.fireName1=name+"消防区域"
    }

    if (reset) {
      this.fireArea.page = 0;
    } else {
      //接口page从0下标位开始
      this.fireArea.page = this.fireArea.page - 1;
      if (this.fireArea.page < 0) {
        this.fireArea.page = 0;
      }
    }

    that.isTableLoadingFireArea = true;
    let param = this.httpReq.post(
      "ffdArea/listAll",
      null,
      this.fireArea,
      data => {
        that.isTableLoadingFireArea = false;
        this.fireArea.page = this.fireArea.page + 1;
        console.log(this.fireArea.page);
        if (data["status"] == 200) {
          data["data"]=JSON.parse( data["data"])
          // console.log(" data"+ data["data"])
          if(data.code=="0"){
            this.FireAreaArray = data["data"]['value']; // 数据列表
            this.resultData1.totalElements = data["data"]["totalElements"]; // 总条数
          }else{
            this.createMessage('error',data['message']);
          }
        }
      }
    );
  }
  url=""
// 分配责任接口
  AssignResponsibility(id,e?: MouseEvent){
    if (e) {
      e.preventDefault();
    }
    if(this.appayType=="2"){
       this.url="account/doffd"
    }else{
      this.url="schedulingProgram/doffd"
    }
    this.AssignResponsibilityD.areaIds=id
    let param = this.httpReq.post(
      this.url,
      null,
      this.AssignResponsibilityD,
      data => {
        if (data["status"] == 200) {
          // data["data"]=JSON.parse( data["data"])
          // console.log(" data"+ data["data"])
          if(data.code=='0'){
            this.createMessage('success',"分配成功");
            this.loadingDataFireArea(this.AssignResponsibilityD.id,"",true);
          }else{
            this.createMessage('error',data['message']);
          }
        }
      }
    );
  }
  cancelAssign={
    id:'',
    areaId:''
  }
  cancelUrl="";
  // 取消分配接口
  cancelAssignResponsibility(id,e?: MouseEvent){
    if (e) {
      e.preventDefault();
    }

    if(this.appayType=="2"){
      this.cancelUrl="account/cancelffd";
    }else{
      this.cancelUrl="schedulingProgram/cancelffd";
    }
    this.cancelAssign.areaId=id
    this.cancelAssign.id=this.selectedGroupId;
    let param = this.httpReq.post(
      this.cancelUrl,
      null,
      this.cancelAssign,
      data => {
        if (data["status"] == 200) {
          // data["data"]=JSON.parse( data["data"])
          // console.log(" data"+ data["data"])
          if(data.code=='0'){
            this.createMessage('success',"已取消分配");
            this.selectedGroupId="";
            this.loadingDataFireArea(this.AssignResponsibilityD.id,"",true);
          }else{
            this.createMessage('error',data['message']);
          }
        }
      }
    );
  }

   // 删除信息

   showDeleteConfirm(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

   this.clickDelBtn(id);
  }
    /**
   * 单击删除按钮
   * @param {any} id 要删除的数据对象ID
   */
  public clickDelBtn(id: any): void {
    this.globalService.delModal(() => {
      this.deleteData(id);
    });
  }
  deleteData(id) {
    let param = {
              id: id
            };
    const that = this;
    that.httpReq.post("assessmentFall/del", null, param, data => {
        that.isTableLoading = false;
        if (data["status"] == 200) {
          that.message.success("删除成功");
          that.loadingDataArray(true);
        }
      });
  }

  //跳转详情页面
  showInfo(info, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (info == null) {
      this.router.navigate(["info", "{}"], {
        relativeTo: this.route
      });
    } else {
      this.router.navigate(["info", JSON.stringify(info)], {
        relativeTo: this.route
      });
    }
  }


}
