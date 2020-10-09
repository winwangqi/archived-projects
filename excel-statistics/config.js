const path = require("path");

module.exports = {
	expenses: {
		originalFile: path.join(__dirname, "/data/开支表.xlsx"),    // 原始文件
		destFile: path.join(__dirname, "/dist/开支表（处理后）.xlsx")	// 处理后文件
	},
	balance: {
		originalFile: path.join(__dirname, "/data/资金平衡表.xlsx"),
		destFile: path.join(__dirname, "/dist/资金平衡表（处理后）.xlsx")	// 处理后文件
	}
};