## 调试

- ng serve --prod

## 打包发布

- npm run prod




##解决 Node 内存限制 ng build --prod 报错问题
node_modules/.bin/ng 文件 添加 #!/usr/bin/env node --max_old_space_size=4096
打包时进入 node_modules/.bin 目录执行
`aot` ng build --prod
`jit` ng build --prod --aot=false --build-optimizer=false
