// 加载模块
const http = require("http");
const router = require("./router");

const PORT = "3000";
const IP = "127.0.0.1";
// 1. 创建服务器
const server = http.createServer();
// 2. 侦测请求
server.on("request", (request, response) => {
    router(request, response);
});
// 3. 监听端口
server.listen(PORT, IP, () => {
    console.log("server is running...");
});