/*
 * nodejs 获取文件依赖
 * 获取 require()形式依赖
 */
var fs = require("fs");
// 入口文件
var jsMap = ["jobs/client/macSearchResult.js"];
var num = 0;
var max = 0;
var count = 0;
var addMap = [];
var pathMap = {};
setTimeout(function() {
	readJs(jsMap[num])
}, 1000)

function readJs(url) {
	pathMap = pathSplicing(url.split('/'));
	writeFiles('\n' + pathMap.fileName + '文件引用:(路径：' + pathMap.basePath + ')')
	fs.readFile(url, "utf8", function(error, data) {
		if (error) throw error;
		data = data.match(/require\((.*)\)/g);
		console.log(data);
		if (!data) {
			if (count == addMap.length) {
				return false;
			}
			setTimeout(function() {
				readJs(addMap[count])
				count++
			}, 3000)
		} else {
			max = data.length - 1;
			data.forEach(function(v, i) {
				(function(v, i) {
					setTimeout(function() {
						if (i == max) {
							writeFiles(v, function() {
								if (num == jsMap.length - 1) {
									if (count == addMap.length) {
										return false;
									}
									console.log(addMap)
									setTimeout(function() {
										readJs(addMap[count])
										count++
									}, 3000)
								} else {
									num++
									setTimeout(function() {
										readJs(jsMap[num])
									}, 3000)
								}
							});
						} else {
							writeFiles(v);
						}
					}, i * 1000)
				})(v, i);
			})
		}
	});
}

function writeFiles(txt, cb) {
	fs.readFile("bb.txt", "utf8", function(error, data) {
		if (error) throw error;
		txt = txt.replace(/\"/g, "'")
		var saveTxt = txt.split("'")[1];

		if (!saveTxt) {
			saveTxt = txt;
		}
		var patt1 = new RegExp(saveTxt);
		if (!patt1.test(data)) {
			var text = data + '\n' + saveTxt;
			if (data) {
				fs.writeFile("bb.txt", text, function(err) {
					if (err) throw err;
					console.log("File Saved !"); //文件被保存
					if (!/文件引用/.test(saveTxt)) {
						addMap.push(pathMap.basePath + saveTxt + '.js');
					}
					if (cb) {
						cb()
					}
				});
			} else {
				console.log('\n' + saveTxt + '未保存\n')
			}
		} else {
			console.log('文件已存在！')
			if (cb) {
				cb()
			}
		}

	});
}

function pathSplicing(data) {
	var basePath = '';
	data.forEach(function(v, i) {
		if (i != data.length - 1) {
			basePath = basePath + v + '/'
		}
	})
	return {
		basePath: basePath,
		fileName: data.pop(),
		length: data.length - 1
	}
}