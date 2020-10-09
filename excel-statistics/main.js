const fs = require('fs');
const path = require('path');
const express = require('express');
const data = require('./handle');
var c = require('child_process')

const server = express();

/* 暴露静态资源 */
server.use('/assets', express.static(path.resolve(__dirname, 'assets')));
server.use('/node_modules', express.static(path.resolve(__dirname, 'node_modules')));

/* 返回首页 */
server.get('/', (request, response) => {
    response.send(fs.readFileSync('index.html', 'utf-8'));
})

/* 响应ajax请求 */
server.get('/data', (request, response) => {
    response.json(data);
})

/* 监听端口 */
server.listen(9999, (err) => {
    if (err) {
        throw err;
    }
    console.log('\n服务器运行在：localhost:9999，请在最新版本浏览器中打开此网址。\n要退出服务器请按两次`Ctrl+C`');
});

/* 启动浏览器 */
c.exec("start http://127.0.0.1:9999")