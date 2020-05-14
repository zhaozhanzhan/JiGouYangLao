import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegexpConfig } from "../../../../common/service/GlobalConfig"; //
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../../../common/service/GlobalMethod";
import { NzTreeNode, NzModalRef } from "ng-zorro-antd";
import { LocalStorage } from "../../../../common/service/local.storage";
import { Utils } from "../../../../common/utils/utils";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { ImageUploadComponent } from "../../../../common/imageupload/imageupload.component";
@Component({
  selector: "app-employees-add",
  templateUrl: "./employees-add.component.html",
  styleUrls: ["./employees-add.component.scss"]
})

export class EmployeesAddComponent implements OnInit {
	addContractDialog: NzModalRef;
	editContractDialog: NzModalRef;
	addCertificateDialog: NzModalRef;
	editCertificateDialog: NzModalRef;
	//添加合同对话框确认按钮loading状态
	addContractLoading = false;
	@ViewChild("contractInfoImg")
	contractInfoImg: ImageUploadComponent;
	@ViewChild("certificateInfoImg")
	certificateInfoImg: ImageUploadComponent;
  
	public basicInfoFormData: FormGroup; // 基本信息定义表单对象
	public personalInfoormData: FormGroup; // 个人信息定义表单对象
	public jobInfoFormData: FormGroup; // 工作信息定义表单对象
	employeeIdIndex = true; //基本信息的id判断后面是否显示
	tabIndex = 0; //tab页切换
	user; //用户名的id获取
	id; //需要修改人员档案是所用的id
	// 基本信息的数据变量申请
	sexList; //性别列表
	reqObjGoodName = "请选择所属部门"; //获得部门的placehold
	goodsClassificationNodes; //部门的节点
	saveBasicInformationLoading = false; //保存基本信息的保存按钮
	departmentId = "";
	logoImgsStr;
	leaveDate;
	status = "";
	basicInfoIdIndex=false;
	// 获得个人信息的数据变量
  
	folkList = [];
	politicsList = [];
	educationtList = [];
	personalInfoIsVisible = false;
	idCardPicImgUrl;
	savePersonalInfoLoading = false;
	personalInfoList = [];
	// 紧急联系人
	personalInfoObj = {
	  name: "",
	  phone: "",
	  domesticCelation: "",
	  comment: ""
	};
	personalInfoState;
	personalInfoIndex;
  
	//  工作信息的数据变量
  
	jobInfoIsVisible = false;
	emergencyContactList = [];
	emergencyContactObj = {
	  etime: "",
	  resignationTime: "",
	  unit: "",
	  operatingPost: "",
	  commit: ""
	};
	jobsInfoState;
	saveJobInfoLoading = false;
	jobInfoIndex;
	jobInfoDate = [];
  
	// 合同信息
	contractInfoIsVisible = false;
	dialogStyle = {
	  marginBottom: "100px"
	};
	ContractInfoList;
	contractInfoState = "";
	contractInfoImgUrl;
	contractInfoDate = [];
  
	contractInfoObj;
	CertificateInfoList = [];
  
	baseinfoIdO = "";
  
	// 取消证书参数
	certificateInfoVisible = false;
	certificateInfoIsVisible = false;
	cancelObj = {
	  certId: "", // "证书信息id",
	  cancelReason: "", // "证书取消注册原因",
	  accountId: "" //"账户id"
	};
	cancelDisabled = false;
	certificateInfoObj;
	certificateInfoImgUrl;
	cancelReason;
	emergencyContactObjk;
	certStatus;
	// 培训信息
	trainingInfoIsVisible = false;
	trainingInfoList = [];
	trainingInfoObj;
	trainingInfoDate = [];
  
	// 获奖信息
	winningInfoIsVisible = false;
	winningInfoList = [];
	winningInfoObj = {
	  awardId: "", // "主键id",
	  employeeId: "", // "基本信息id",
	  awardingUnits: "", // "发奖单位",
	  awardingTime: "", // "发奖时间",
	  awardName: "", // "奖项名称",
	  awardLevel: "", // "奖项类别",
	  comment: "", // "备注",
	  accountId: "" // "账户id"
	};
	winningInfoDate = [];
  
	constructor(
	  private httpReq: HttpReqService,
	  private msg: NzMessageService, // 消息提醒
	  private fb: FormBuilder, // 响应式表单
	  private jsUtil: JsUtilsService, // 自定义JS工具类
	  private localStorage: LocalStorage,
	  private route: ActivatedRoute,
	  private router: Router,
	  private modalService: NzModalService
	) {}
  
	ngOnInit() {
	  // 基本信息参数
	  this.basicInfoFormData = this.fb.group({
		employeeId: [""], // "主键id",
		photoUrl: [""], // "照片",
		name: ["", [Validators.required]], // "姓名",
		idCard: ["", [Validators.required]], // "身份证号",
		sex: ["", [Validators.required]], //"性别",
		birthday: [""], //"出生日期",
		phone: ["", [Validators.required]], // "联系方式（手机号）",
		fixTel: [""], // "固定电话",
		departmentId: [""], //"部门id",
		jobs: [""], // "岗位",
		position: [""], // "现在职务",
		personType: ["", [Validators.required]], // "人员类型",
		comeDate: [""], // "入职时间",
		accountId: [""], // "账户id"
		leaveDate: [""],
		isMonitor: ["false"] //是否为班长
	  });
	  // 个人信息参数
	  this.personalInfoormData = this.fb.group({
		identityId: [""], // "主键id",
		employeeId: [""], //  "基本信息id",
		folk: [""], // "民族",
		married: [""], // "婚姻状况",
		education: [""], // "文化程度",
		politics: [""], // "政治面貌",
		nativePlace: [""], // "籍贯",
		populace: [""], // "户籍地址",
		adds: [""], // "家庭地址",
		emergencyContact: [""], // "紧急联系人",
		idCardPic: [""], // "身份证扫描件",
		houseHoldPic: [""], // "户口本",
		comment: [""], // "备注",
		accountId: [""] // "账户id"
	  });
	  // 工作信息参数
	  this.jobInfoFormData = this.fb.group({
		workId: [""], // "主键id"
		employeeId: [""], // "基本信息id",
		professionalCategory: [""], // "专业类别",
		profession: [""], // "专业",
		title: [""], // "职称",
		workTime: [""], // "参加工作时间",
		workExperienceYears: [""], // "相关工作年限",
		salaryRange: [""], // "薪金范围",
		otherTreatment: [""], // "其他待遇",
		workExperiences: [""], // "工作经验",
		comment: [""], // "备注",
		accountId: [""] // "账户id"
	  });
	  this.emergencyContactObjk = {
		etime: "",
		resignationTime: "",
		unit: "",
		operatingPost: "",
		commit: ""
	  };
	  // 合同参数
	  this.contractInfoObj = {
		contractId: "", // "主键id",
		employeeId: "", // "基本信息id",
		startDate: "", //"合同开始时间",
		endDate: "", //"合同结束时间",
		contractUrl: "", //"合同扫描件",
		comment: "", //"备注",
		accountId: "" //"账户id"
	  };
  
	  // 证书参数
	  this.certificateInfoObj = {
		certId: "", // "主键id",
		employeeId: "", // "基本信息id",
		certType: "", //"证书类别",
		certName: "", //"证书名称",
		certNumber: "", //"证书编号",
		issuingTime: "", //"发证时间",
		validity: "", //" 有效期",
		certOrganName: "", //"发证单位",
		certUrl: "", //"证书扫描件上传",
		comment: "", //"备注",
		accountId: "" //"账户id"
	  };
	  // 培训信息接口
	  this.trainingInfoObj = {
		trainId: "", // "主键id",
		employeeId: "", //  "基本信息id",
		trainCertName: "", // "培训证书名称",
		certNumber: "", // "培训证书编号",
		trainCertComp: "", // "专业培训单位",
		startDate: "", // "专业培训开始时间",
		endDate: "", // "专业培训结束时间",
		credits: "", // "专业培训累计学分",
		comment: "", // "备注",
		accountId: "" // "账户id"
	  };
	  // 当保存之后用id取得所有的数据
	  let data = this.route.snapshot.paramMap.get("data");
	  if (data) {
		this.basicInfoIdIndex=true
		// 获得基本信息id
		this.id = JSON.parse(data).id;
		this.status = JSON.parse(data).status;
		this.basicInfoFormData.patchValue({
		  employeeId: this.id
		});
		this.personalInfoormData.patchValue({
		  employeeId: this.id
		});
		this.jobInfoFormData.patchValue({
		  employeeId: this.id
		});
	
		this.certificateInfoObj.employeeId = this.id;
		this.baseinfoIdO = this.id;
		this.trainingInfoObj.employeeId = this.id;
		this.contractInfoObj.employeeId = this.id;
		this.winningInfoObj.employeeId = this.id;
		// 通过获得的人员ID 给表单赋值
		this.getBasicInformation();
		this.getPersonalInformation();
		this.getJobInfomation();
		this.employeeIdIndex = false;
		this.getContractInfoListAll();
		this.getCertificateInfoList();
		this.getTrainingInfoList();
		this.getWinningInfoList();
	  }
  
	  // 获得当前登录着的账户ID
	  this.user = this.localStorage.getUser();
	  this.basicInfoFormData.patchValue({
		accountId: this.user.data.id
	  });
	  this.personalInfoormData.patchValue({
		accountId: this.user.data.id
	  });
	  this.jobInfoFormData.patchValue({
		accountId: this.user.data.id
	  });
	  this.contractInfoObj.accountId = this.user.data.id;
	  this.cancelObj.accountId = this.user.data.id;
	  this.trainingInfoObj.accountId = this.user.data.id;
	  this.winningInfoObj.accountId = this.user.data.id;
	  this.certificateInfoObj.accountId = this.user.data.id;
	  // 获得所有的数据字典里面的数据
	  this.getAllDataDictionary();
	  // 获得所有的部门节点
	  this.getDepartmentNode();
	}
  
	// 获得所有的部门节点
	getDepartmentNode() {
	  //  获得部门的数据
	  this.goodsClassificationNodes = [];
	  this.httpReq.post("/department/listTreeAll", null, {}, data => {
		if (data["code"] == 0) {
		  const result = JSON.parse(data["data"]);
		  result.forEach(element => {
			this.goodsClassificationNodes.push(new NzTreeNode(element));
			console.log("------------------"+this.departmentId)
			if (this.departmentId != "") {
				this.getReqObjGoodName(this.goodsClassificationNodes,this.departmentId);
			}
		  });
		}
	  });
	}


	 // 递归循环树形结构获得所属部门
	 getReqObjGoodName(arr , departmentID:string){
    if(arr.length>0){
      arr.forEach(e => {
        if(e.key==departmentID){
          this.reqObjGoodName = e.title;
          return;
        }else{
          this.getReqObjGoodName(e.children,departmentID);
        }
      });
    }

  }

	// 获得数据词典中的值
	getAllDataDictionary() {
	  const that = this;
	  this.httpReq.post(
		"dictMgt/listDataByTypes",
		null,
		{ dictTypes: "folk,sex,politics,education" },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  const info = data["data"];
			  info.forEach(e => {
				//folk民族
				if (e.dictType == "folk") {
				  this.folkList = e.ddList;
				}
  
				//politics政治面貌
				if (e.dictType == "politics") {
				  this.politicsList = e.ddList;
				}
  
				//education学历
				if (e.dictType == "education") {
				  this.educationtList = e.ddList;
				}
  
				//sex性别
				if (e.dictType == "sex") {
				  this.sexList = e.ddList;
				}
			  });
			} else {
			  that.msg.success(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 返回
	back() {
	  history.back();
	}
  
	// 保存基本信息
	saveBasicInformation(logoImage: Array<string>) {
	  const that = this;
	  const formDataCtrl = this.basicInfoFormData.controls;
	  const formData = this.jsUtil.deepClone(this.basicInfoFormData.value); // 深度拷贝表单数据
	  for (const i in formDataCtrl) {
		// 较验整个表单标记非法字段
		formDataCtrl[i].markAsDirty();
		formDataCtrl[i].updateValueAndValidity();
	  }
  
	  if (this.basicInfoFormData.invalid) {
		// 表单较验未通过
		return;
	  }
	  formData.photoUrl = logoImage.toString();
	  formData.birthday = this.jsUtil.dateFormat(formData.birthday);
	  formData.comeDate = this.jsUtil.dateFormat(formData.comeDate);
	  if (formData.photoUrl.length > 500) {
		this.msg.error("照片上传太多！");
		return;
	  }
  
	  this.httpReq.post("/employees/saveOrUpdate", null, formData, data => {
		that.saveBasicInformationLoading = true;
		if (data["status"] == 200) {
		  if (data["code"] == 0) {
			that.msg.success("保存成功！");
			this.tabIndex++; // 切换Tab页
			window.scrollTo(0, 0); // 回到顶部
			this.employeeIdIndex = false;
			this.basicInfoIdIndex=true
			that.saveBasicInformationLoading = false;
			this.baseinfoIdO = data["data"].id;
			this.personalInfoormData.patchValue({
			  employeeId: data["data"].id
			});
			this.jobInfoFormData.patchValue({
			  employeeId: data["data"].id
			});
			this.contractInfoObj.employeeId = data["data"].id;
			this.certificateInfoObj.employeeId = data["data"].id;
			this.contractInfoObj.employeeId = data["data"].id;
			this.winningInfoObj.employeeId = data["data"].id;
			this.trainingInfoObj.employeeId = data["data"].id;
			this.id = data["data"].id;
		  } else {
			that.msg.success(data["message"]);
			that.saveBasicInformationLoading = false;
		  }
		}
	  });
	}
  
	// 获得基本信息数据
	getBasicInformation() {
	  const that = this;
	  this.httpReq.post(
		"/employees/listDetail",
		null,
		{ employeeId: this.id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  GlobalMethod.setForm(this.basicInfoFormData, data["data"]); // 表单赋值
			  this.basicInfoFormData.patchValue({
				isMonitor: data["data"].isMonitor + ""
			  });
				this.logoImgsStr = this.basicInfoFormData.get("photoUrl").value;
				if ( data["data"].department) {
					this.departmentId =  data["data"].department.id;
				} else {
					this.departmentId = "";
				}
				this.basicInfoFormData.patchValue({
					departmentId: this.departmentId
				});
				
			  // this.formData.get("photoUrl").value
			} else {
			  that.msg.success(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 个人信息的
	// 保存工作经验
	personalInfoOk(): void {
		if(this.personalInfoObj.name=="" || this.personalInfoObj.phone=="" || this.personalInfoObj.domesticCelation==""){
      this.msg.error("请填写完整紧急联系人信息");
      return;
    }
	  if (this.personalInfoState == "add") {
		this.personalInfoList.push(this.personalInfoObj);
	  } else {
		this.personalInfoList.splice(
		  this.personalInfoIndex,
		  1,
		  this.personalInfoObj
		);
	  }
	  this.personalInfoIsVisible = false;
	}
  
	// 关闭弹窗
	personalInfoCancel(): void {
	  this.personalInfoIsVisible = false;
	  if (this.personalInfoState == "edit") {
		this.personalInfoList.splice(
		  this.personalInfoIndex,
		  1,
		  this.personalInfoObjk
		);
	  }
	}
  
	// 添加紧急联系人
	addPersonal(state) {
	  this.personalInfoObj = {
		name: "",
		phone: "",
		domesticCelation: "",
		comment: ""
	  };
	  this.personalInfoState = state;
	  this.personalInfoIsVisible = true;
	}
  
	// 保存个人信息和修改个人信息
	savePersonalInfo(idCardPicImgs: Array<string>) {
	  const that = this;
	  const formDataCtrl = this.personalInfoormData.controls;
	  const formData = this.jsUtil.deepClone(this.personalInfoormData.value); // 深度拷贝表单数据
	  for (const i in formDataCtrl) {
		// 较验整个表单标记非法字段
		formDataCtrl[i].markAsDirty();
		formDataCtrl[i].updateValueAndValidity();
	  }
  
	  if (this.personalInfoormData.invalid) {
		// 表单较验未通过
		return;
	  }
	  formData.idCardPic = idCardPicImgs.toString();
	  formData.emergencyContact = this.personalInfoList;
	  if (formData.idCardPic.length > 500) {
		this.msg.error("照片上传太多！");
		return;
	  }
	  this.httpReq.post("/identityInfo/saveOrUpdate", null, formData, data => {
		that.savePersonalInfoLoading = true;
		if (data["status"] == 200) {
		  if (data["code"] == 0) {
			that.msg.success("保存成功！");
			that.savePersonalInfoLoading = false;
			this.tabIndex++; // 切换Tab页
			window.scrollTo(0, 0); // 回到顶部
		  } else {
			that.msg.success(data["message"]);
			that.savePersonalInfoLoading = false;
		  }
		}
	  });
	}
  
	// 当保存个人信息之后取数据
	getPersonalInformation() {
	  const that = this;
	  this.httpReq.post(
		"/identityInfo/listAll",
		null,
		{ employeeId: this.id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  GlobalMethod.setForm(this.personalInfoormData, data["data"]); // 表单赋值
			  this.idCardPicImgUrl = this.personalInfoormData.get(
				"idCardPic"
			  ).value;
			  this.personalInfoormData.patchValue({
				identityId: data["data"].id
			  });
			  if (data["data"].emergencyContact) {
				const contactList = JSON.parse(data["data"].emergencyContact);
				contactList.forEach(e => {
				  this.personalInfoList.push(e);
				});
			  }
			} else {
			  that.msg.success(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 删除一个数据
	delEmergencyContact(i, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.personalInfoIndex = i;
	  this.personalInfoList.splice(i, 1);
	  this.msg.create("warning", "点击保存后删除操作才能生效！");
	}
	personalInfoObjk = {
	  name: "",
	  phone: "",
	  domesticCelation: "",
	  comment: ""
	};
	// 修改紧急联系人
	modifierEmergencyContact(index, item, state, e) {
	  this.personalInfoIsVisible = true;
	  if (e) {
		e.preventDefault();
	  }
	  this.personalInfoState = state;
	  this.personalInfoObjk.name = item.name;
	  this.personalInfoObjk.phone = item.phone;
	  this.personalInfoObjk.domesticCelation = item.domesticCelation;
	  this.personalInfoObjk.comment = item.comment;
  
	  this.personalInfoObj.name = item.name;
	  this.personalInfoObj.phone = item.phone;
	  this.personalInfoObj.domesticCelation = item.domesticCelation;
	  this.personalInfoObj.comment = item.comment;
	  this.personalInfoIndex = index;
	}
  
	// 工作信息接口
	// 保存和修改个人信息
	saveJobInfomation() {
	  const that = this;
	  const jobInfoFormDataCtrl = this.jobInfoFormData.controls;
	  const jobInfoFormData = this.jsUtil.deepClone(this.jobInfoFormData.value); // 深度拷贝表单数据
	  for (const i in jobInfoFormDataCtrl) {
		// 较验整个表单标记非法字段
		jobInfoFormDataCtrl[i].markAsDirty();
		jobInfoFormDataCtrl[i].updateValueAndValidity();
	  }
  
	  if (this.jobInfoFormData.invalid) {
		// 表单较验未通过
		return;
	  }
	  console.log(this.emergencyContactList);
	  jobInfoFormData.workExperiences = this.emergencyContactList;
	  this.httpReq.post("/workInfo/saveOrUpdate", null, jobInfoFormData, data => {
		that.saveJobInfoLoading = true;
		if (data["status"] == 200) {
		  if (data["code"] == 0) {
			that.msg.success("保存成功！");
			that.saveJobInfoLoading = false;
			this.tabIndex++; // 切换Tab页
			window.scrollTo(0, 0); // 回到顶部
		  } else {
			that.msg.error(data["message"]);
			that.saveJobInfoLoading = false;
		  }
		} else {
		  that.msg.error(data["message"]);
		  that.saveJobInfoLoading = false;
		}
	  });
	}
  
	// 获得工作信息的数据
	getJobInfomation() {
	  const that = this;
	  this.httpReq.post(
		"/workInfo/listAll",
		null,
		{ employeeId: this.id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  GlobalMethod.setForm(this.jobInfoFormData, data["data"]); // 表单赋值
			  // this.idCardPicImgUrl=this.jobInfoFormData.get("idCardPic").value
			  this.jobInfoFormData.patchValue({
				workId: data["data"].id
			  });
  
			  if (data["data"].workExperiences) {
				this.emergencyContactList = JSON.parse(
				  data["data"].workExperiences
				);
			  }
  
			  // this.jobInfoFormData.get("photoUrl").value
			} else {
			  that.msg.success(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 关闭弹窗
	jobInfoCancel(): void {
	  this.jobInfoIsVisible = false;
	  if (this.jobsInfoState == "edit") {
		this.emergencyContactList.splice(
		  this.jobInfoIndex,
		  1,
		  this.emergencyContactObjk
		);
	  }
	}
  
	// 添加紧急联系人
	addJobInfo(state) {
	  this.jobInfoDate = [];
	  this.emergencyContactObj = {
		etime: "",
		resignationTime: "",
		unit: "",
		operatingPost: "",
		commit: ""
	  };
	  this.jobsInfoState = state;
	  this.jobInfoIsVisible = true;
	}
  
	// 修改紧急联系人
	modifierJobInfo(index, item, state, e) {
	  this.jobInfoDate = [];
	  let that = this;
	  that.jobInfoIsVisible = true;
	  if (e) {
		e.preventDefault();
	  }
  
	  if (!Utils.isEmpty(item.etime) && !Utils.isEmpty(item.resignationTime)) {
		that.jobInfoDate.push(new Date(item.etime));
		that.jobInfoDate.push(new Date(item.resignationTime));
	  } else {
		that.jobInfoDate = [];
	  }
	  that.jobsInfoState = state;
	  that.emergencyContactObjk.etime = item.etime;
	  that.emergencyContactObjk.resignationTime = item.resignationTime;
	  that.emergencyContactObjk.unit = item.unit;
	  that.emergencyContactObjk.operatingPost = item.operatingPost;
	  that.emergencyContactObjk.commit = item.commit;
  
	  that.emergencyContactObj.etime = item.etime;
	  that.emergencyContactObj.resignationTime = item.resignationTime;
	  that.emergencyContactObj.unit = item.unit;
	  that.emergencyContactObj.operatingPost = item.operatingPost;
	  that.emergencyContactObj.commit = item.commit;
	  this.jobInfoIndex = index;
	}
	// 删除一个数据
	delJobInfo(i, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.emergencyContactList.splice(i, 1);
	  this.msg.create("warning", "点击保存后删除操作才能生效！");
	}
	// 保存工作经验
	jobInfoOk(): void {
	  this.emergencyContactObj.etime = this.jsUtil.dateFormat(
		this.emergencyContactObj.etime
	  );
	  this.emergencyContactObj.resignationTime = this.jsUtil.dateFormat(
		this.emergencyContactObj.resignationTime
		);
		if(this.emergencyContactObj.etime=="" || this.emergencyContactObj.resignationTime=="" || this.emergencyContactObj.unit=="" || this.emergencyContactObj.operatingPost==""){
      this.msg.error("请完整填写工作经验信息");
      return;
    }
	  if (this.jobsInfoState == "add") {
		this.emergencyContactList.push(this.emergencyContactObj);
	  } else {
		this.emergencyContactList.splice(
		  this.jobInfoIndex,
		  1,
		  this.emergencyContactObj
		);
	  }
	  this.jobInfoIsVisible = false;
	}
  
	onJobInfoChange(dateArr: Date[]) {
	  if (dateArr.length == 2) {
		this.emergencyContactObj.etime = this.jsUtil.dateFormat(dateArr[0]);
		this.emergencyContactObj.resignationTime = this.jsUtil.dateFormat(
		  dateArr[1]
		);
	  } else {
		this.emergencyContactObj.etime = "";
		this.emergencyContactObj.etime = "";
	  }
	}
  
	// 合同信息
	// 添加合同信息
	addContractInfo(tplTitle, tplContent, tplFooter) {
	  this.contractInfoObj.contractId = "";
	  this.contractInfoObj.comment = "";
	  this.contractInfoObj.startDate = "";
	  this.contractInfoObj.endDate = "";
	  this.contractInfoImgUrl = null;
	  this.contractInfoDate = [];
	  let that = this;
	  this.addContractDialog = this.modalService.create({
		nzTitle: tplTitle,
		nzContent: tplContent,
		nzFooter: tplFooter,
		nzWidth: 900,
		nzMaskClosable: false,
		nzClosable: false
	  });
	}
	contractInfoCancel() {
	  if (this.addContractDialog) {
		this.addContractDialog.destroy();
	  }
	  if (this.editContractDialog) {
		this.editContractDialog.destroy();
	  }
	}
  
	// 修改合同信息
	modifierContractInfo(tplTitle, tplContent, tplFooter,id, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.contractInfoIsVisible = true;
	  this.contractInfoDate = [];
	  this.contractInfoImgUrl = null;
	  const that = this;
	  that.contractInfoImgUrl = "";
	  that.httpReq.post(
		"/contractInfo/listDetail",
		null,
		{ contractInfoId: id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  const result = data["data"];
			  //  that.contractInfoObj=result
			  that.contractInfoObj.contractId = result.id;
			  that.contractInfoObj.comment = result.comment;
			  that.contractInfoObj.startDate = result.startDate;
			  that.contractInfoObj.endDate = result.endDate;
			  that.contractInfoImgUrl = result.contractUrl;
			  if (
				!Utils.isEmpty(result.startDate) &&
				!Utils.isEmpty(result.endDate)
			  ) {
				that.contractInfoDate = [result.startDate, result.endDate];
			  } else {
				that.contractInfoDate = [];
			  }
  
			  this.editContractDialog = this.modalService.create({
				nzTitle: tplTitle,
				nzContent: tplContent,
				nzFooter: tplFooter,
				nzWidth: 900,
				nzMaskClosable: false,
				nzClosable: false
			  });
			  
			} else {
			  that.msg.error(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 保存合同
	contractInfoOk() {
		if( this.contractInfoObj.startDate=="" || this.contractInfoObj.endDate==""){
      this.msg.error("请填写合同起止时间");
      return;
    }
	  let contractInfo = this.contractInfoImg.showImageUrls;
	  this.addContractLoading = true;
		this.contractInfoObj.contractUrl = contractInfo.toString();
	
	  this.httpReq.post(
		"contractInfo/saveOrUpdate",
		null,
		this.contractInfoObj,
		data => {
		  this.addContractLoading = false;
		  if (data["code"] == 0) {
			this.msg.success("保存成功！");
			this.contractInfoIsVisible = false;
			this.getContractInfoListAll();
			//关闭使用service的方式创建的对话框
			if (this.addContractDialog) {
			  this.addContractDialog.destroy();
			}
			if (this.editContractDialog) {
			  this.editContractDialog.destroy();
			}
		  } else {
			this.msg.success(data["message"]);
		  }
		}
	  );
	}
	onContractInfoListAllChange(dateArr: Date[]) {
	  if (dateArr.length == 2) {
		this.contractInfoObj.startDate = this.jsUtil.dateFormat(dateArr[0]);
		this.contractInfoObj.endDate = this.jsUtil.dateFormat(dateArr[1]);
	  } else {
		this.contractInfoObj.startDate = "";
		this.contractInfoObj.endDate = "";
	  }
	}
	// 获得所有的合同
	getContractInfoListAll() {
	  this.httpReq.post(
		"/contractInfo/listAll",
		null,
		{ employeeId: this.id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  this.ContractInfoList = data["data"];
			} else {
			}
		  }
		}
	  );
	}
  
	//  添加证书信息
	addCertificateInfo(tplTitle, tplContent, tplFooter) {
	  this.certificateInfoObj.certId = "";
	  this.certificateInfoObj.certType = "";
	  this.certificateInfoObj.certName = "";
	  this.certificateInfoObj.certNumber = "";
	  this.certificateInfoObj.issuingTime = "";
	  this.certificateInfoObj.validity = "";
	  this.certificateInfoObj.certOrganName = "";
	  this.certificateInfoObj.comment = "";
	  this.certificateInfoImgUrl = [];
	  this.certStatus = "0";
	  this.cancelReason = "";
	  let that = this;
	  this.addCertificateDialog = this.modalService.create({
		nzTitle: tplTitle,
		nzContent: tplContent,
		nzFooter: tplFooter,
		nzWidth: 900,
		nzMaskClosable: false,
		nzClosable: false
	  });
	}
	certificateInfoCancel() {
	  this.certificateInfoIsVisible = false;
	  if (this.addCertificateDialog) {
		this.addCertificateDialog.destroy();
	  }
	  if (this.editCertificateDialog) {
		this.editCertificateDialog.destroy();
	  }
	}
  
	certificateInfoOk() {
	  let certificateInfo = this.certificateInfoImg.showImageUrls;
	  this.certificateInfoObj.certUrl = certificateInfo.toString();
	  this.certificateInfoObj.issuingTime = this.jsUtil.dateFormat(
		this.certificateInfoObj.issuingTime
		);
		if(this.certificateInfoObj.certType=="" || this.certificateInfoObj.certName==""){
			this.msg.error("请填写资格证书类别或资格证书名称");
			return;
		}
	  this.httpReq.post(
		"/certInfo/saveOrUpdate",
		null,
		this.certificateInfoObj,
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  this.msg.success("保存成功！");
			  this.certificateInfoIsVisible = false;
			  this.getCertificateInfoList();
			  if (this.addCertificateDialog) {
				this.addCertificateDialog.destroy();
			  }
  
			  if (this.editCertificateDialog) {
				this.editCertificateDialog.destroy();
			  }
			} else {
			  this.msg.success(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 获得所有的证书信息
	getCertificateInfoList() {
	  this.httpReq.post(
		"/certInfo/listAll",
		null,
		{ employeeId: this.id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  this.CertificateInfoList = data["data"];
			} else {
			}
		  }
		}
	  );
	}
  
	// 修改证书信息
	modifierCertificateInfo(tplTitle, tplContent, tplFooter,item, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.certificateInfoIsVisible = true;
	  this.certStatus = item.certStatus;
	  this.cancelReason = item.cancelReason;
	  this.certificateInfoObj.certId = item.id;
	  this.certificateInfoObj.certName = item.certName;
	  this.certificateInfoObj.certType = item.certType;
	  this.certificateInfoObj.certNumber = item.certNumber;
	  this.certificateInfoObj.issuingTime = item.issuingTime;
	  this.certificateInfoObj.validity = item.validity;
	  this.certificateInfoObj.certOrganName = item.certOrganName;
	  this.certificateInfoObj.comment = item.comment;
	  this.certificateInfoImgUrl = item.certUrl;
  
  
	  this.editCertificateDialog = this.modalService.create({
		nzTitle: tplTitle,
		nzContent: tplContent,
		nzFooter: tplFooter,
		nzWidth: 900,
		nzMaskClosable: false,
		nzClosable: false
	  });
  
	}
  
	// 取消证书
	cancelCertificateInfo(id, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.cancelObj.certId = id;
	  this.certificateInfoVisible = true;
	  this.cancelDisabled = false;
	  this.cancelObj.cancelReason = "";
	}
  
	// 修改证书修改
	certificateOk() {
	  this.httpReq.post("/certInfo/cancelCert", null, this.cancelObj, data => {
		if (data["status"] == 200) {
		  if (data["code"] == 0) {
			this.msg.success("修改成功");
			this.certificateInfoVisible = false;
			this.getCertificateInfoList();
		  } else {
			this.msg.success(data["message"]);
			this.certificateInfoVisible = false;
		  }
		}
	  });
	}
  
	// 取消修改证书
	certificateCancel() {
	  this.certificateInfoVisible = false;
	}
  
	checkCertificateInfo(cancelReason, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.cancelObj.cancelReason = cancelReason;
	  this.certificateInfoVisible = true;
	  this.cancelDisabled = true;
	}
  
	// 获得培训信息培训信息
	getTrainingInfoList() {
	  const that = this;
	  this.httpReq.post(
		"/trainInfo/listAll",
		null,
		{ employeeId: this.id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  this.trainingInfoList = data["data"];
			} else {
			  that.msg.success(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 添加培训信息
	addTrainingInfo() {
	  this.trainingInfoDate = [];
	  this.trainingInfoObj.certNumber = "";
	  this.trainingInfoObj.trainCertName = "";
	  this.trainingInfoObj.trainCertComp = "";
	  this.trainingInfoObj.credits = "";
	  this.trainingInfoObj.comment = "";
	  this.trainingInfoObj.trainId = "";
	  this.trainingInfoIsVisible = true;
	}
	// 取消培训信息
	trainingInfoCancel() {
	  this.trainingInfoIsVisible = false;
	}
	// 修改培训信息
	modifierTrainingInfo(trainingInfoItem, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.trainingInfoIsVisible = true;
	  this.trainingInfoObj.trainId = trainingInfoItem.id;
	  this.trainingInfoObj.trainCertName = trainingInfoItem.trainCertName;
	  this.trainingInfoObj.certNumber = trainingInfoItem.certNumber;
	  this.trainingInfoObj.credits = trainingInfoItem.credits;
	  this.trainingInfoObj.comment = trainingInfoItem.comment;
	  this.trainingInfoObj.trainCertComp = trainingInfoItem.trainCertComp;
	  if (
		!Utils.isEmpty(trainingInfoItem.startDate) &&
		!Utils.isEmpty(trainingInfoItem.endDate)
	  ) {
		this.trainingInfoDate = [
		  trainingInfoItem.startDate,
		  trainingInfoItem.endDate
		];
		// this.trainingInfoDate.push(new Date(trainingInfoItem.startDate));
		// this.trainingInfoDate.push(new Date(trainingInfoItem.endDate));
	  } else {
		this.trainingInfoDate = [];
	  }
	}
	// 添加培训信息
	trainingInfoOk() {
	  if (
		this.trainingInfoObj.startDate == "" ||
		this.trainingInfoObj.endDate == ""
	  ) {
		this.trainingInfoObj.startDate = this.trainingInfoDate[0];
		this.trainingInfoObj.endDate = this.trainingInfoDate[1];
		}
		if(this.trainingInfoObj.startDate=="" ||  this.trainingInfoObj.endDate=="" || this.trainingInfoObj.trainCertName=="" || this.trainingInfoObj.trainCertComp==""){
      this.msg.error("请完整填写培训信息");
      return;
    }
	  this.httpReq.post(
		"/trainInfo/saveOrUpdate",
		null,
		this.trainingInfoObj,
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  this.msg.success("保存成功！");
			  this.getTrainingInfoList();
			  this.trainingInfoIsVisible = false;
			} else {
			  this.msg.success(data["message"]);
			  this.trainingInfoIsVisible = false;
			}
		  }
		}
	  );
	}
	// 获得日期
	onTrainingInfoChange(dateArr: Date[]) {
	  if (dateArr.length == 2) {
		this.trainingInfoObj.startDate = this.jsUtil.dateFormat(dateArr[0]);
		this.trainingInfoObj.endDate = this.jsUtil.dateFormat(dateArr[1]);
	  } else {
		this.trainingInfoObj.startDate = "";
		this.trainingInfoObj.endDate = "";
	  }
	}
  
	// 添加获奖信息
	addwinningInfo() {
	  this.winningInfoObj.awardId = "";
	  this.winningInfoIsVisible = true;
	  this.winningInfoObj.awardingUnits = "";
	  this.winningInfoObj.awardingTime = "";
	  this.winningInfoObj.awardName = "";
	  this.winningInfoObj.awardLevel = "";
	  this.winningInfoObj.comment = "";
	}
	winningInfoCancel() {
	  this.winningInfoIsVisible = false;
	}
  
	// 修改获奖信息
	modifierwinningInfo(Item, e) {
	  if (e) {
		e.preventDefault();
	  }
	  this.winningInfoIsVisible = true;
	  this.winningInfoObj.awardId = Item.id;
	  this.winningInfoObj.awardingUnits = Item.awardingUnits;
	  this.winningInfoObj.awardingTime = Item.awardingTime;
	  this.winningInfoObj.awardName = Item.awardName;
	  this.winningInfoObj.awardLevel = Item.awardLevel;
	  this.winningInfoObj.comment = Item.comment;
	  // this.router.navigate(["winningInfoSave",{data:JSON.stringify(trainingInfoItem),employeeId:this.baseinfoIdO}], { relativeTo: this.route });
	}
	// 保存获奖信息
	winningInfoOk() {
		if(this.winningInfoObj.awardingTime=="" || this.winningInfoObj.awardingUnits=="" || this.winningInfoObj.awardName=="" || this.winningInfoObj.awardLevel==""){
			this.msg.error("请完整填写获奖信息");
			return;
		}
	  this.httpReq.post(
		"/awardInfo/saveOrUpdate",
		null,
		this.winningInfoObj,
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  this.msg.success("保存成功！");
			  this.winningInfoIsVisible = false;
			  this.getWinningInfoList();
			} else {
			  this.msg.success(data["message"]);
			  this.winningInfoIsVisible = false;
			}
		  }
		}
	  );
	}
	// 获得获奖信息
	getWinningInfoList() {
	  const that = this;
	  this.httpReq.post(
		"/awardInfo/listAll",
		null,
		{ employeeId: this.id },
		data => {
		  if (data["status"] == 200) {
			if (data["code"] == 0) {
			  this.winningInfoList = data["data"];
			} else {
			  that.msg.error(data["message"]);
			}
		  }
		}
	  );
	}
  
	// 删除获奖信息
	deleteWinningInfo(id, e?: MouseEvent) {
	  if (e) {
		e.preventDefault();
	  }
	  let that = this;
	  this.modalService.confirm({
		nzTitle: "请确认是否删除?",
		nzOkText: "确认",
		nzOkType: "danger",
		nzOnOk: () => {
		  let param = {
			awardInfoId: id,
			accountId: this.user.data.id
		  };
		  that.httpReq.post("/awardInfo/delete", null, param, data => {
			if (data["status"] == 200) {
			  if (data["code"] == 0) {
				that.msg.success("删除成功");
				this.getWinningInfoList();
			  } else {
				that.msg.error(data["message"]);
			  }
			}
		  });
		},
		nzCancelText: "取消",
		nzOnCancel: () => {}
	  });
	}
  
	// 删除培训信息
	deleteTrainingInfo(id, e?: MouseEvent) {
	  if (e) {
		e.preventDefault();
	  }
	  let that = this;
	  this.modalService.confirm({
		nzTitle: "请确认是否删除?",
		nzOkText: "确认",
		nzOkType: "danger",
		nzOnOk: () => {
		  let param = {
			trainInfoId: id,
			accountId: this.user.data.id
		  };
		  that.httpReq.post("/trainInfo/delete", null, param, data => {
			if (data["status"] == 200) {
			  if (data["code"] == 0) {
				that.msg.success("删除成功");
				this.getTrainingInfoList();
			  } else {
				that.msg.error(data["message"]);
			  }
			}
		  });
		},
		nzCancelText: "取消",
		nzOnCancel: () => {}
	  });
	}
  
	// 删除证书信息
	deleteCertificateInfo(id, e?: MouseEvent) {
	  if (e) {
		e.preventDefault();
	  }
	  let that = this;
	  this.modalService.confirm({
		nzTitle: "请确认是否删除?",
		nzOkText: "确认",
		nzOkType: "danger",
		nzOnOk: () => {
		  let param = {
			certInfoId: id,
			accountId: this.user.data.id
		  };
		  that.httpReq.post("/certInfo/delete", null, param, data => {
			if (data["status"] == 200) {
			  if (data["code"] == 0) {
				that.msg.success("删除成功");
				this.getCertificateInfoList();
			  } else {
				that.msg.error(data["message"]);
			  }
			}
		  });
		},
		nzCancelText: "取消",
		nzOnCancel: () => {}
	  });
	}
  
	// 删除合同信息
	deleteContractInfo(id, e?: MouseEvent) {
	  if (e) {
		e.preventDefault();
	  }
	  let that = this;
	  this.modalService.confirm({
		nzTitle: "请确认是否删除?",
		nzOkText: "确认",
		nzOkType: "danger",
		nzOnOk: () => {
		  let param = {
			contractInfoId: id,
			accountId: this.user.data.id
		  };
		  that.httpReq.post("/contractInfo/delete", null, param, data => {
			if (data["status"] == 200) {
			  if (data["code"] == 0) {
				that.msg.success("删除成功");
				this.getContractInfoListAll();
			  } else {
				that.msg.error(data["message"]);
			  }
			}
		  });
		},
		nzCancelText: "取消",
		nzOnCancel: () => {}
	  });
	}
  }