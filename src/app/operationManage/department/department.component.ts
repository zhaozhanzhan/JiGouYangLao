import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../common/service/HttpUtils.Service';
import { GlobalService } from '../../common/service/GlobalService';
import { NzMessageService, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10
  };
  addBtn=false;
  isTableLoading = false;
   nodes = [];
 expandKeys = ["0"];
  node={
    id:"",
    name:""
  }
  nodeId=""
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    // if (sessionStorage.getItem(this.router.url) !== null) {
    //   this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    //   this.page.index = this.reqObj.page + 1;
    //   this.page.size = this.reqObj.size;
    // }

    this.updateList();
    this.updateTree();
  }


  updateTree() {
    this.nodes = [
    // new NzTreeNode({
    //   title: "部门管理",
    //   key: "0",
    //   disabled: false
    // })
  ];
    this.httpReq.post('/department/listTreeAll', null, {}, data => {
      if (data['status'] == 200 && data['code'] == 0) {
        const result = JSON.parse(data['data']);
        console.log(result);
        result.forEach(element => {
          this.nodes.push(new NzTreeNode(element));
          // this.nodes[0].addChildren([new NzTreeNode(element)]);
        });
      }
    });
  }

  nzEvent(e: NzFormatEmitEvent): void {
    // console.log("e"+JSON.stringify(e.node.origin))
    // console.log("e.node.origin.key"+e.node.origin.key+this.nodes[0].key)
    // if(e.node.origin.key==this.nodes[0].key){
    //   this.addBtn=false;
    // }else{
    //   this.addBtn=true;
    // }
    this.addBtn=true;
    this.node.id=e.node.origin.key
    this.node.name=e.node.origin.title
     this.updateList();
   
  }
  turnToAdd() {
      this.router.navigate(['addEdit', { state: 'add',info:JSON.stringify(this.node) }], { relativeTo: this.route });
  }

  turnToEdit(department) {
    this.router.navigate(['addEdit', { department: JSON.stringify(department), state: 'edit' }], { relativeTo: this.route });
  }

  updateList(reset: boolean = false): void {
    if( this.node.id==""){
       this.nodeId="0"
    }else{
      this.nodeId=this.node.id
    }
    this.isTableLoading = true;
    this.httpReq.post('/department/listParentAll', null, {parentId: this.nodeId}, data => {
      this.isTableLoading = false;
      if (data['status'] == 200) {
        this.list = data['data'];
      }
    });
  }

  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post('department/delete', null, { id: id }, data => {
        if (data['status'] == 200 ) {
          if(data['code'] == 0 ) {
            this.message.success('删除成功！');
            this.updateList();
            this.updateTree();
          } else {
            this.message.error(data.message);
          }
        } 
      });
    });
  }
}
