import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ResMemoItem' })
export class ResMemoItemPipe implements PipeTransform {
    transform(value: string): string {
        let level = "尚未定级";
        switch (value) {
            case 'XISHOU':
                level = "洗手";
                break;
            case 'XILIAN':
                level = "洗脸";
                break;
            case 'ZHIJIA':
                level = "剪指甲";
                break;
            case 'LIFA':
                level = "理发";
                break;
            case 'QIANJIAO':
                level = "扦脚";
                break;
            case 'XIZAO':
                level = "洗澡";
                break;
            case 'CASHEN':
                level = "擦身";
                break;
            case 'XISHAI':
                level = "洗晒衣物";
                break;
            case 'CHUANGSHANG':
                level = "整理床上用品";
                break;
            case 'GEREN':
                level = "整理个人物品";
                break;
        }
        return level;
    }
}