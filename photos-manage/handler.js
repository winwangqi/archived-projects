// 加载模块
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const _ = require("underscore");
const formidable = require("formidable");
const config = require("./config");

// 响应首页
exports.showIndex = (request, response) => {
    // 获取 uploads 目录
    fs.readdir(config.uploadsDir, "utf-8", (err, files) => {
        if (err) {
            throw err;
        }
        // 渲染首页
        fs.readFile(path.join(config.viewsDir, "index.html"), "utf-8", (err, data) => {
            const indexPage = _.template(data)(
                {
                    dirs: files,
                    uploadsDir: config.uploadsDir
                }
            );
            response.writeHead(200, "OK", {
                "Content-Type": "text/html; charset: utf-8"
            });
            response.end(indexPage);
        });
    });
};

// 响应开放资源
exports.openSource = (request, response) => {
    const url = decodeURI(request.url);
    fs.readFile(`.${url}`, (err, data) => {
        if (err) {
            response.writeHead(404, "Not Found");
            response.end();
        }
        response.writeHead(200, "OK", {
            "Content-Type": mime.lookup(`.${url}`)
        });
        response.end(data);
    });
};

// 显示相册
exports.showAlbum = (request, response) => {
    const albumItem = request.query.albumName.trim();
    fs.access(path.join(config.uploadsDir, albumItem), err => {
        if (err) {
            response.end("album not exists");
        }
        fs.readdir(path.join(config.uploadsDir, albumItem), (err, files) => {
            if (err) {
                response.writeHead(404, "Not Found");
                response.write("Not Found");
            }
            fs.readFile(path.join(config.viewsDir, "album.html"), "utf-8", (err, data) => {
                const albumPage = _.template(data)({
                    pics: files.map(item => {
                        return `/uploads/${albumItem}/${item}`;
                    }),
                    currentAlbum: albumItem
                });
                response.writeHead(200, "OK", {
                    "Content-Type": "text/html; charset: utf-8"
                });
                response.end(albumPage);
            });
        });
    });
};

// 添加相册
exports.addAlbum = (request, response) => {
    const albumName = request.query.albumName.trim();
    const rAlbumName = /(\\|\/|:|\*|\?|\|"|<|>|\|)|^$/;
    // 校验添加相册名的合法性 \/:*?"<>|
    if (rAlbumName.test(albumName)) {
        return response.end("albumName param invalid error.");
    }
    const newDir = path.join(config.uploadsDir, albumName);
    fs.access(newDir, err => {
        // 若相册已存在
        if (!err) {
            return response.end("albumName has exists");
        }
        // 相册不存在
        fs.mkdir(newDir, err => {
            if (err) {
                throw err;
            }
            response.writeHead(302, {
                "Location": "/"
            });
            response.end();
        });
    });
};

// 上传图片
exports.uploadPic = (request, response) => {
    const currentAlbum = request.query.albumName.trim();
    const form = new formidable.IncomingForm();

    // 自定义上传路径
    form.uploadDir = path.join(config.uploadsDir, currentAlbum);

    // 保留文件扩展名
    form.keepExtensions = true;

    // 限制文件大小
    form.maxFieldsSize = 10 * 1024 * 1024;

    form.parse(request, (err, fields, files) => {
        if (err) {
            return response.end('The default size is 10MB.')
        }
        response.writeHead(302, {
            "Location": encodeURI(`/album?albumName=${currentAlbum}`)
        });
        response.end();
    });
};

// Not Found
exports.notFound = (request, response) => {
    response.writeHead(404, "Not Found");
    response.end("Not Found");
};