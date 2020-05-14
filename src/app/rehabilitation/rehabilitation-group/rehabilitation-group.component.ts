import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
import { GlobalService } from '../../common/service/GlobalService';
import { Utils } from '../../common/utils/utils';
import { JsUtilsService } from '../../common/service/JsUtils.Service';
@Component({
  selector: 'app-rehabilitation-group',
  templateUrl: './rehabilitation-group.component.html',
  styleUrls: ['./rehabilitation-group.component.css']
})
export class RehabilitationGroupComponent implements OnInit {
	page = {
		total: 0,
		size: 10,
		index: 1
	};
	reqObj = {
		page: 1,
		size: 10,
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
		this.httpReq.post('/rcGroup/listPage', null, this.reqObj, (data) => {
			this.isTableLoading = false;
			if (data['status'] == 200) {
				this.list = data['data']['content'];
				this.page.total = data['data']['totalElements'];
			}
		});
	}

	// 添加按钮
	// 跳转到保存和修改页面
	turnToAdd(data, e?: MouseEvent) {
		if (e) {
			e.preventDefault();
		}
		if (data == '') {
			this.router.navigate([ 'GroupAdd' ], { relativeTo: this.route });
		} else {
			this.router.navigate([ 'GroupAdd', { info: JSON.stringify(data) } ], {
				relativeTo: this.route
			});
		}
	}
	turnToCheck(data, e?: MouseEvent) {
		if (e) {
			e.preventDefault();
		}
		this.router.navigate([ 'GroupCheck', { info: JSON.stringify(data) } ], {
			relativeTo: this.route
		});
		
	}
	// 删除
	delete(id, e?: MouseEvent) {
		if (e) {
			e.preventDefault();
		}
		this.globalService.delModal(() => {
			this.httpReq.post('/rcGroup/del', null, { id: id }, (data) => {
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
