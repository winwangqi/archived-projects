/* 引入模块 */
const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx");
const moment = require("moment");
const config = require("./config");

/* 工具函数 */
const getNow = () => {
	return moment().format("YYYY-MM-DD HH:mm:ss");
};

const formatTime = (time) => {
	return moment(new Date((parseInt(time) - (25567 + 1)) * 86400 * 1000)).add(-1, 'days').format('YYYY-MM-DD');
};

/* 初始化变量 */
let jsonData = {
	'expenses': {},
	'balance': {
		2016: {},
		2017: {}
	}
};

/* 读取原表 */
const oriExpenses = config.expenses.originalFile;
const oriBalance = config.balance.originalFile;



/* ================开支表处理================ */

function expenses() {

	/* 转换 */
	const xlsxExpenses = xlsx.parse(oriExpenses);

	const retData = [];

	// 遍历每个sheet
	for (let sheet of xlsxExpenses) {
		// 筛选支出表
		if (sheet.name.includes("支出")) {

			const year = sheet.name.slice(0, 4);	// 年份
			const data = [["分类", "合计"]];
			const sumSheet = { name: `${year}年汇总`, data: data };
			const sumObj = {};

			// 遍历表中每行
			for (let item of sheet.data) {	// 每行是一个数组	
				if (typeof item[0] === "number") {	// 找出记录信息行
					item[0] = formatTime(item[0]);
					const RMB = item[2];
					const category = item[4] ? item[4] : "**未分类**";

					if (category in sumObj) {
						sumObj[category] += RMB;
					} else {
						sumObj[category] = RMB;
					}
				}
			}
			for (let key in sumObj) {
				data.push([key, sumObj[key]]);
			}
			retData.push(sheet);
			retData.push(sumSheet);

			jsonData['expenses'][year] = sumObj;
		}
	}

	const buffer = xlsx.build(retData);

	fs.writeFile(config.expenses.destFile, buffer, err => {
		if (err) {
			console.log(`${getNow()}---开支表处理错误，请关闭开支表目标文件。\n`);
		} else {
			// console.log(`${getNow()}---开支表处理成功！\n`);
		}
	});
}

expenses();

fs.watchFile(config.expenses.originalFile, function () {
	expenses();
});

/* ==============资金平衡表处理=============== */

function balance() {

	/* 转换 */
	const xlsxBalance = xlsx.parse(oriBalance);

	const retData = [];

	// 遍历每个sheet
	for (let sheet of xlsxBalance) {
		// 筛选“年份”表
		if (sheet.name.includes("年")) {

			const data = [];
			const year = sheet.name.slice(0, 4);	// 年份
			const sumSheet = { name: `${year}年汇总`, data: data };
			const earningObj = {};
			const expenditureObj = {};

			// 遍历表中每行
			for (let item of sheet.data) {	// 每行是一个数组	
				if (typeof item[0] === "number") {	// 找出记录信息行
					item[0] = formatTime(item[0]);	// 格式化时间

					const earning = item[1];
					const expenditure = item[3];
					const category = item[5] ? item[5] : "**未分类**";

					if (earning) {
						if (category in earningObj) {
							earningObj[category] += earning;
						} else {
							earningObj[category] = earning;
						}
					} else if (expenditure) {
						if (category in expenditureObj) {
							expenditureObj[category] += expenditure;
						} else {
							expenditureObj[category] = expenditure;
						}
					}
				}
			}
			data.push(["分类", "合计", "==收入=="]);
			for (let key in earningObj) {
				data.push([key, earningObj[key]]);
			}
			data.push([""], ["分类", "合计", "==支出=="]);
			for (let key in expenditureObj) {
				data.push([key, expenditureObj[key]]);
			}
			retData.push(sumSheet);
			jsonData['balance'][year]['earn'] = earningObj;
			jsonData['balance'][year]['expenditur'] = expenditureObj;
		}
		retData.push(sheet);
	}

	const buffer = xlsx.build(retData);

	fs.writeFile(config.balance.destFile, buffer, err => {
		if (err) {
			console.log(`${getNow()}---资金平衡表处理错误，请关闭资金平衡表目标文件。\n`);
		} else {
			// console.log(`${getNow()}---资金平衡表处理成功！\n`);
		}
	});

}

balance();

fs.watchFile(config.balance.originalFile, function () {
	balance();
});

module.exports = jsonData;