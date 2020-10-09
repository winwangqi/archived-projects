// 加载模块
const url = require("url");
const handler = require("./handler");

// 暴露 router 函数
module.exports = (request, response) => {
    // 获取 url 对象
    const urlObj = url.parse(request.url, true);
    const pathname = urlObj.pathname;
    const method = request.method.toLowerCase();

    request.query = urlObj.query || {};

    // 路由
    if (pathname === "/") {                         // 请求首页
        handler.showIndex(request, response);
    } else if (method === "get" && pathname.startsWith("/public") || pathname.startsWith("/uploads") ||
        pathname.startsWith("/node_module")) {      // 请求开放资源
        handler.openSource(request, response);
    } else if (pathname === "/album") {     // 读取相册内容
        handler.showAlbum(request, response);
    } else if (method === "get" && pathname === "/album/add") {     // 新建相册
        handler.addAlbum(request, response);
    } else if (method === "post" && pathname === "/uploadPic") {
        handler.uploadPic(request, response);
    } else {
        handler.notFound(request, response);
    }
};