import { OcrImageComponent } from './ocrimage.component';
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/**
 * 模块框服务
 */
@Injectable()
export class OcrImgService {

    constructor(private modalService: NgbModal) { }
    /**
     * 
     * @param config 输入框
     */
    showDialog(ocrData): Promise<any> {

        const modalRef: NgbModalRef = this.modalService.open(OcrImageComponent,{size:'lg'});
        modalRef.componentInstance.ocrData = ocrData;
        return modalRef.result;
    }

}