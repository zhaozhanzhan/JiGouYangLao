import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
import { GlobalService } from '../../common/service/GlobalService';
import { Utils } from '../../common/utils/utils';
import { JsUtilsService } from '../../common/service/JsUtils.Service';
@Component({
  selector: 'app-rehabilitation-person-initial',
  templateUrl: './rehabilitation-person-initial.component.html',
  styleUrls: ['./rehabilitation-person-initial.component.css']
})
export class RehabilitationPersonInitialComponent implements OnInit {
	page = {
		total: 0,
		size: 10,
		index: 1
	};
	reqObj = {
		page: 1,
		size: 10,
		name: '',
		recureStatus: '',
		beginTime: '',
		endTime: ''
	};
	list = [];
	isTableLoading = false;
	selectedDate = [];
	constructor(
		private httpReq: HttpReqService,
		private globalService: GlobalService,
		private message: NzMessageService,
		private router: Router,
		private route: ActivatedRoute,
		private jsUtil: JsUtilsService
	) {}

	ngOnInit() {
		if (sessionStorage.getItem(this.router.url) !== null) {
			this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
			if (!Utils.isEmpty(this.reqObj.beginTime) && !Utils.isEmpty(this.reqObj.endTime)) {
				this.selectedDate.push(new Date(this.reqObj.beginTime));
				this.selectedDate.push(new Date(this.reqObj.endTime));
			}
		}

		this.updateList();
	}

	// 获得所有列表的信息
	updateList(reset: boolean = false): void {
		if (reset) {
			this.page.index = 1;
		}
		this.reqObj.page = this.page.index - 1;
		this.reqObj.size = this.page.size;
		sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
		this.isTableLoading = true;
		this.httpReq.post('/rcInitEvaluation/listPage', null, this.reqObj, (data) => {
			this.isTableLoading = false;
			if (data['status'] == 200) {
				this.list = data['data']['content'];
				this.page.total = data['data']['totalElements'];
			}
		});
	}
	turnToEdit(data, e?: MouseEvent){
		if (e) {
			e.preventDefault();
		}
		this.router.navigate([ '../rehabilitationPersonMiddle/PersonMiddleAdd', { recureCaseId:data.recureCase.id,recureFlag:data.recureCase.recureFlag } ], {
			relativeTo: this.route
		});
	}

	turnToCheck(data, e?: MouseEvent){
		if (e) {
			e.preventDefault();
		}
		this.router.navigate([ '../rehabilitationPersonMiddle/PersonMiddleCheck', { recureCaseId:data.recureCase.id,recureFlag:data.recureCase.recureFlag } ], {
			relativeTo: this.route
		});
	}

	// 删除
	delete(id, e?: MouseEvent) {
		if (e) {
			e.preventDefault();
		}
		this.globalService.delModal(() => {
			this.httpReq.post('/rcInitEvaluation/del', null, { id: id }, (data) => {
				if (data['status'] == 200) {
					if (data['code'] == 0) {
						this.message.success('删除成功！');
						this.updateList();
					} else {
						this.message.error(data.message);
					}
				}
			});
		});
	}

	// 选择日期
	onRangerPickerChange(dateArr: Date[]) {
		if (dateArr[0]) {
			this.reqObj.beginTime = this.jsUtil.dateFormat(dateArr[0]) + ' 00:00:00';
		} else {
			this.reqObj.beginTime = '';
		}
		if (dateArr[1]) {
			this.reqObj.endTime = this.jsUtil.dateFormat(dateArr[1]) + ' 23:59:59';
		} else {
			this.reqObj.endTime = '';
		}
	}
}
