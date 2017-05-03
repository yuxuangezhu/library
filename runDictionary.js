var fs = require("fs");
var rd = require('rd');
var startFolder = './new';
var files = rd.readSync(startFolder);
var base = files[0];
files.shift();
var num = 0;
var dataLength = 0;
var runArr = [];
files.forEach(function(v, i) {
	if (v.match(/\/([^.]*)\./) && !v.match(/DS_Store/)) {
		runArr[num] = v.replace(base, startFolder);
		num++;
	}
})
console.log(runArr)
var intNum = 0;
var startTime = new Date();
console.log(startTime)
readFs(runArr[intNum]);

function readFs(url) {
	fs.readFile(url, "utf8", function(error, data) {
		if (error) throw error;
		var msg = data.split('\r\n');
		var lib = [];
		msg.forEach(function(v, i) {
			if (!v) {
				return
			} else {
				var mid = v.split('----');
				lib.push({
					user: mid[0],
					pass: mid[1]
				})
			}
		})
		dataLength = dataLength + lib.length;
		var txt = JSON.stringify(lib)
		writeFiles(txt, function() {
			console.log(runArr[intNum] + '读取完成');
			intNum++;
			if (intNum < runArr.length) {
				readFs(runArr[intNum])
			} else {
				var endTime = new Date()
				console.log(endTime)
				console.log('数据读取完成,共处理' + dataLength + '条数据,耗时' + (endTime.getTime() - startTime.getTime())/1000 + 's')
			}
		})
	});
}
function writeFiles(txt, cb) {
	// fs.readFile("bb.js", "utf8", function(error, data) {
	// 	if (error) throw error;
	// 	var text = JSON.parse(data);
	// 	txt.forEach(function(v) {
	// 		text.push(v)
	// 	})
	// 	setTimeout(function() {
			// text = JSON.stringify(text);
			fs.writeFile("./format/fs"+ intNum +".js", txt, function(err) {
				if (err) throw err;
				console.log("File Saved !"); //文件被保存
				if (cb) {
					cb()
				}
			});
	// 	}, 500)
	// });
}