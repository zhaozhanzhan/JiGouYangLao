import { enableProdMode, ViewEncapsulation } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

import { preloaderFinished } from "@delon/theme";
preloaderFinished();

if (environment.production) {
  enableProdMode();
  // 对console输入信息的屏蔽,输出太多信息会导致浏览器卡
  window.console.log = () => {};
  window.console.info = () => {};
  window.console.warn = () => {};
  window.console.error = () => {};
}

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch(err => console.log(err));

const bootstrap = () => {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule, {
      defaultEncapsulation: ViewEncapsulation.Emulated,
      preserveWhitespaces: false
    })
    .then(res => {
      if ((<any>window).appBootstrap) {
        (<any>window).appBootstrap();
      }
      return res;
    });
};
bootstrap();
