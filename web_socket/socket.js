//连接数据库
var mysql = require('mysql');
var conn;
var userNum;

function handleError() {
	conn = mysql.createConnection({
		host: 'localhost',
		user: 'nodejs',
		password: 'nodejs',
		database: 'nodejs',
		port: 3306
	});

	//连接错误，2秒重试
	conn.connect(function(err) {
		if (err) {
			console.log('error when connecting to db:', err);
			setTimeout(handleError, 2000);
		}
	});

	conn.on('error', function(err) {
		console.log('db error', err);
		// 如果是连接断开，自动重新连接
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleError();
		} else {
			throw err;
		}
	});
}
handleError();
// 引入需要的模块：http和socket.io
var http = require('http'),
	io = require('socket.io');
//创建server
var server = http.createServer(function(req, res) {
	// Send HTML headers and message
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end('<h1>Hello Socket Lover!</h1>');
});
var userOnline = [];
//端口8020
server.listen(8020);
//创建socket
var socket = io.listen(server);
//添加连接监听
socket.on('connection', function(client) {
	//连接成功则执行下面的监听
	//socket.send()
	client.on('message', function(event) {
		//console.log('客户端消息',event);
		switch (event.messType) {
			case "pageOpen":
				startPage(event); //页面登录状态验证
				break;
			case "pageClose":
				closePage(event)
				break;
			case "chengeName":
				chengeName(event)
				break;
			case "singleChat":
				singleChat(event)
				break;
			case "noChat":
				noChat(event)
				break;
			default:
				if (event.switchLock == 0) {
					if (event.content.length <= 400) {
						checkFace(event);
					} else {
						var errMessage = {
							"errContent": "发送字数超出限制!请调整至200字一下,或分条发送.",
							"messageType": "maxNum",
							"uid": event.uid
						}
						socket.send(errMessage);
					}
				} else {
					checkFace(event);
				}
		}
	});
	//断开连接callback
	client.on('disconnect', function(event) {
		var time = new Date();
		console.log(time.toLocaleTimeString() + '服务器断开');
	});
});

function checkFace(event) {
	var face_content = event.content;
	// face_box = ["smilea_org.gif", "tootha_org.gif", "laugh.gif", "tza_org.gif", "kl_org.gif", "kbsa_org.gif", "cj_org.gif", "shamea_org.gif", "zy_org.gif", "bz_org.gif", "bs2_org.gif", "lovea_org.gif", "sada_org.gif", "heia_org.gif", "qq_org.gif", "sb_org.gif", "mb_org.gif", "ldln_org.gif", "yhh_org.gif", "zhh_org.gif", "x_org.gif", "cry.gif", "wq_org.gif", "t_org.gif", "k_org.gif", "bba_org.gif", "angrya_org.gif", "yw_org.gif", "cza_org.gif", "88_org.gif", "sk_org.gif", "sweata_org.gif", "sleepya_org.gif", "sleepa_org.gif", "money_org.gif", "sw_org.gif", "cool_org.gif", "hsa_org.gif", "hatea_org.gif", "gza_org.gif", "dizzya_org.gif", "bs_org.gif", "crazya_org.gif", "h_org.gif", "yx_org.gif", "nm_org.gif", "doge_org.gif", "horse2_org.gif","bmzuocao_org.gif", "bmzhuakuang_org.gif", "bmzhongqiang_org.gif", "bmzhenjing_org.gif", "bmzan_org.gif", "bmxiyue_org.gif", "bmxingwu_org.gif", "bmxingfen_org.gif", "bmxielei_org.gif", "bmwabikong_org.gif", "bmtushetou_org.gif", "bmtucao_org.gif", "bmtousu_org.gif", "bmtiaosheng_org.gif", "bmtiaopi_org.gif", "bmtaolun_org.gif", "bmtaitui_org.gif", "bmsikao_org.gif", "bmshengqi_org.gif", "bmqinwen_org.gif", "bmqingxing_org.gif", "bmneihan_org.gif", "bmmanglu_org.gif", "bmluanru_org.gif", "bmluanmeng_org.gif", "bmliulei_org.gif", "bmliukoushui_org.gif", "bmliubiti_org.gif", "bmliguo_org.gif", "bmliezui_org.gif", "bmlaladui_org.gif", "bmkusu_org.gif", "bmkuqi_org.gif", "bmkubi_org.gif"];
	// face_name = ["[呵呵]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻屎]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[懒得理你]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[打哈气]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡觉]", "[钱]", "[失望]", "[酷]", "[花心]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[doge]", "[神马]","[bm做操]", "[bm抓狂]", "[bm中枪]", "[bm震惊]", "[bm赞]", "[bm喜悦]", "[bm醒悟]", "[bm兴奋]", "[bm血泪]", "[bm挖鼻孔]", "[bm吐舌头]", "[bm吐槽]", "[bm投诉]", "[bm跳绳]", "[bm调皮]", "[bm讨论]", "[bm抬腿]", "[bm思考]", "[bm生气]", "[bm亲吻]", "[bm庆幸]", "[bm内涵]", "[bm忙碌]", "[bm乱入]", "[bm卖萌]", "[bm流泪]", "[bm流口水]", "[bm流鼻涕]", "[bm路过]", "[bm咧嘴]", "[bm啦啦队]", "[bm哭诉]", "[bm哭泣]", "[bm苦逼]"];
	face_emoji = ["-😄-0", "-😃-0", "0-😀-0", "-😊-0", "-☺-☺️", "-😉-0", "-😍-0", "-😘-0", "-😚-0", "0-😗-0", "0-😙-0", "-😜-0", "-😝-0", "0-😛-0", "-😳-0", "-😁-0", "-😔-0", "-😌-0", "-😒-0", "-😞-0", "-😣-0", "-😢-0", "-😂-0", "-😭-0", "-😪-0", "-😥-0", "-😰-0", "0-😅-0", "-😓-0", "0-😩-0", "0-😫-0", "-😨-0", "-😱-0", "-😠-0", "-😡-0", "0-😤-0", "-😖-0", "0-😆-0", "0-😋-0", "-😷-0", "0-😎-0", "0-😴-0", "0-😵-0", "-😲-0", "0-😟-0", "0-😦-0", "0-😧-0", "0-😈-0", "-👿-0", "0-😮-0", "0-😬-0", "0-😐-0", "0-😕-0", "0-😯-0", "0-😶-0", "0-😇-0", "-😏-0", "0-😑-0", "-👲-0", "-👳-0", "-👮-0", "-👷-0", "-💂-0", "-👶-0", "-👦-0", "-👧-0", "-👨-0", "-👩-0", "-👴-0", "-👵-0", "-👱-0", "-👼-0", "-👸-0", "0-😺-0", "0-😸-0", "0-😻-0", "0-😽-0", "0-😼-0", "0-🙀-0", "0-😿-0", "0-😹-0", "0-😾-0", "0-👹-0", "0-👺-0", "0-🙈-0", "0-🙉-0", "0-🙊-0", "-💀-0", "-👽-0", "-💩-0", "-🔥-0", "-✨-0", "-🌟-0", "0-💫-0", "0-💥-0", "-💢-0", "-💦-0", "0-💧-0", "-💤-0", "-💨-0", "-👂-0", "-👀-0", "-👃-0", "0-👅-0", "-👄-0", "-👍-0", "-👎-0", "-👌-0", "-👊-0", "-✊-0", "-✌-✌️", "-👋-0", "-✋-0", "-👐-0", "-👆-0", "-👇-0", "-👉-0", "-👈-0", "-🙌-0", "-🙏-0", "-☝-☝️", "-👏-0", "-💪-0", "-🚶-0", "-🏃-0", "-💃-0", "-👫-0", "0-👪-0", "0-👬-0", "0-👭-0", "-💏-0", "-💑-0", "-👯-0", "-🙆-0", "-🙅-0", "-💁-0", "0-🙋-0", "-💆-0", "-💇-0", "-💅-0", "0-👰-0", "0-🙎-0", "0-🙍-0", "-🙇-0", "-🎩-0", "-👑-0", "-👒-0", "-👟-0", "0-👞-0", "-👡-0", "-👠-0", "-👢-0", "-👕-0", "-👔-0", "0-👚-0", "-👗-0", "0-🎽-0", "0-👖-0", "-👘-0", "-👙-0", "-💼-0", "-👜-0", "0-👝-0", "0-👛-0", "0-👓-0", "-🎀-0", "-🌂-0", "-💄-0", "-💛-0", "-💙-0", "-💜-0", "-💚-0", "-❤-❤️", "-💔-0", "-💗-0", "-💓-0", "0-💕-0", "0-💖-0", "0-💞-0", "-💘-0", "0-💌-0", "-💋-0", "-💍-0", "-💎-0", "0-👤-0", "0-👥-0", "0-💬-0", "-👣-0", "0-💭-0", "-🐶-0", "-🐺-0", "-🐱-0", "-🐭-0", "-🐹-0", "-🐰-0", "-🐸-0", "-🐯-0", "-🐨-0", "-🐻-0", "-🐷-0", "0-🐽-0", "-🐮-0", "-🐗-0", "-🐵-0", "-🐒-0", "-🐴-0", "-🐑-0", "-🐘-0", "0-🐼-0", "-🐧-0", "-🐦-0", "-🐤-0", "0-🐥-0", "0-🐣-0", "-🐔-0", "-🐍-0", "0-🐢-0", "-🐛-0", "0-🐝-0", "0-🐜-0", "0-🐞-0", "0-🐌-0", "-🐙-0", "-🐚-0", "-🐠-0", "-🐟-0", "-🐬-0", "-🐳-0", "0-🐋-0", "0-🐄-0", "0-🐏-0", "0-🐀-0", "0-🐃-0", "0-🐅-0", "0-🐇-0", "0-🐉-0", "-🐎-0", "0-🐐-0", "0-🐓-0", "0-🐕-0", "0-🐖-0", "0-🐁-0", "0-🐂-0", "0-🐲-0", "0-🐡-0", "0-🐊-0", "-🐫-0", "0-🐪-0", "0-🐆-0", "0-🐈-0", "0-🐩-0", "0-🐾-0", "-💐-0", "-🌸-0", "-🌷-0", "-🍀-0", "-🌹-0", "-🌻-0", "-🌺-0", "-🍁-0", "-🍃-0", "-🍂-0", "0-🌿-0", "-🌾-0", "0-🍄-0", "-🌵-0", "-🌴-0", "0-🌲-0", "0-🌳-0", "0-🌰-0", "0-🌱-0", "0-🌼-0", "0-🌐-0", "0-🌞-0", "0-🌝-0", "0-🌚-0", "0-🌑-0", "0-🌒-0", "0-🌓-0", "0-🌔-0", "0-🌕-0", "0-🌖-0", "0-🌗-0", "0-🌘-0", "0-🌜-0", "0-🌛-0", "-🌙-0", "0-🌍-0", "0-🌎-0", "0-🌏-0", "0-🌋-0", "0-🌌-0", "0-🌠-0", "0-⭐-⭐️", "-☀-☀️", "0-⛅-⛅️", "-☁-☁️", "-⚡-⚡️", "-☔-☔️", "0-❄-❄️", "-⛄-⛄️", "-🌀-0", "0-🌁-0", "-🌈-0", "-🌊-0"]
	face_emoji_po = ["0px 0px", "-21px 0px", "-43px 0px", "-64px 0px", "-86px 0px", "-107px 0px", "-129px 0px", "-150px 0px", "-172px 0px", "-193px 0px", "-215px 0px", "-236px 0px", "-258px 0px", "-279px 0px", "-301px 0px", "-322px 0px", "-344px 0px", "-365px 0px", "-387px 0px", "-408px 0px", "-430px 0px", "-451px 0px", "-473px 0px", "-494px 0px", "-516px 0px", "-537px 0px", "-559px 0px", "-580px 0px", "-602px 0px", "-623px 0px", "-645px 0px", "-666px 0px", "-688px 0px", "-709px 0px", "-731px 0px", "-752px 0px", "-774px 0px", "-795px 0px", "-817px 0px", "-838px 0px", "0px -22px", "-21px -22px", "-43px -22px", "-64px -22px", "-86px -22px", "-107px -22px", "-129px -22px", "-150px -22px", "-172px -22px", "-193px -22px", "-215px -22px", "-236px -22px", "-258px -22px", "-279px -22px", "-301px -22px", "-322px -22px", "-344px -22px", "-365px -22px", "-387px -22px", "-408px -22px", "-430px -22px", "-451px -22px", "-473px -22px", "-494px -22px", "-516px -22px", "-537px -22px", "-559px -22px", "-580px -22px", "-602px -22px", "-623px -22px", "-645px -22px", "-666px -22px", "-688px -22px", "-709px -22px", "-731px -22px", "-752px -22px", "-774px -22px", "-795px -22px", "-817px -22px", "-838px -22px", "0px -43px", "-21px -43px", "-43px -43px", "-64px -43px", "-86px -43px", "-107px -43px", "-129px -43px", "-150px -43px", "-172px -43px", "-193px -43px", "-215px -43px", "-236px -43px", "-258px -43px", "-279px -43px", "-301px -43px", "-322px -43px", "-344px -43px", "-365px -43px", "-387px -43px", "-408px -43px", "-430px -43px", "-451px -43px", "-473px -43px", "-494px -43px", "-516px -43px", "-537px -43px", "-559px -43px", "-580px -43px", "-602px -43px", "-623px -43px", "-645px -43px", "-666px -43px", "-688px -43px", "-709px -43px", "-731px -43px", "-752px -43px", "-774px -43px", "-795px -43px", "-817px -43px", "-838px -43px", "0px -64px", "-21px -64px", "-43px -64px", "-64px -64px", "-86px -64px", "-107px -64px", "-129px -64px", "-150px -64px", "-172px -64px", "-193px -64px", "-215px -64px", "-236px -64px", "-258px -64px", "-279px -64px", "-301px -64px", "-322px -64px", "-344px -64px", "-365px -64px", "-387px -64px", "-408px -64px", "-430px -64px", "-451px -64px", "-473px -64px", "-494px -64px", "-516px -64px", "-537px -64px", "-559px -64px", "-580px -64px", "-602px -64px", "-623px -64px", "-645px -64px", "-666px -64px", "-688px -64px", "-709px -64px", "-731px -64px", "-752px -64px", "-774px -64px", "-795px -64px", "-817px -64px", "-838px -64px", "0px -86px", "-21px -86px", "-43px -86px", "-64px -86px", "-86px -86px", "-107px -86px", "-129px -86px", "-150px -86px", "-172px -86px", "-193px -86px", "-215px -86px", "-236px -86px", "-258px -86px", "-279px -86px", "-301px -86px", "-322px -86px", "-344px -86px", "-365px -86px", "-387px -86px", "-408px -86px", "-430px -86px", "-451px -86px", "-473px -86px", "-494px -86px", "-516px -86px", "-537px -86px", "-559px -86px", "-580px -86px", "-602px -86px", "-623px -86px", "-645px -86px", "-666px -86px", "-688px -86px", "-709px -86px", "-731px -86px", "-752px -86px", "-774px -86px", "-795px -86px", "-817px -86px", "-838px -86px", "0px -107px", "-21px -107px", "-43px -107px", "-64px -107px", "-86px -107px", "-107px -107px", "-129px -107px", "-150px -107px", "-172px -107px", "-193px -107px", "-215px -107px", "-236px -107px", "-258px -107px", "-279px -107px", "-301px -107px", "-322px -107px", "-344px -107px", "-365px -107px", "-387px -107px", "-408px -107px", "-430px -107px", "-451px -107px", "-473px -107px", "-494px -107px", "-516px -107px", "-537px -107px", "-559px -107px", "-580px -107px", "-602px -107px", "-623px -107px", "-645px -107px", "-666px -107px", "-688px -107px", "-709px -107px", "-731px -107px", "-752px -107px", "-774px -107px", "-795px -107px", "-817px -107px", "-838px -107px", "0px -129px", "-21px -129px", "-43px -129px", "-64px -129px", "-86px -129px", "-107px -129px", "-129px -129px", "-150px -129px", "-172px -129px", "-193px -129px", "-215px -129px", "-236px -129px", "-258px -129px", "-279px -129px", "-301px -129px", "-322px -129px", "-344px -129px", "-365px -129px", "-387px -129px", "-408px -129px", "-430px -129px", "-451px -129px", "-473px -129px", "-494px -129px", "-516px -129px", "-537px -129px", "-559px -129px", "-580px -129px", "-602px -129px", "-623px -129px", "-645px -129px", "-666px -129px", "-688px -129px", "-709px -129px", "-731px -129px", "-752px -129px", "-774px -129px", "-795px -129px", "-817px -129px", "-838px -129px", "0px -150px", "-21px -150px", "-43px -150px", "-64px -150px", "-86px -150px", "-107px -150px", "-129px -150px", "-150px -150px", "-172px -150px", "-193px -150px", "-215px -150px", "-236px -150px", "-258px -150px", "-279px -150px", "-301px -150px", "-322px -150px", "-344px -150px", "-365px -150px", "-387px -150px", "-408px -150px", "-430px -150px", "-451px -150px", "-473px -150px", "-494px -150px", "-516px -150px"]
	for (var j = 0; j < 200; j++) {
		face_content = face_content.replace("<", "&lt;")
		face_content = face_content.replace(">", "&gt;")
	}
	for (var j = 0; j < 200; j++) {
		// for(var i = 0; i < face_name.length; i++){
		//     face_content = face_content.replace(face_name[i],"<img src='images/face_img/"+face_box[i]+"' alt='"+face_name[i]+"' class='face_mess'>")
		//}
		for (var i = 0; i < face_emoji_po.length; i++) {
			face_content = face_content.replace(face_emoji[i], "<i class='emoji'  style='background-position:" + face_emoji_po[i] + ";'></i>")
		}
	}
	event.content = face_content;
	socket.send(event);
}

var setSql = {
	insSQL: function(uid, db_name, field, values) { //数据库添加函数
		var insertSQL = 'insert into ' + db_name + '(' + field + ') values("' + values + '")';
		console.log(insertSQL)
		conn.query(insertSQL, function(err1, res1) {
			if (err1) {
				if (err1.code == "ER_DUP_ENTRY") {
					socket.send(["insSQL", {
						"err": true,
						"errCode": "用户名已存在!",
						"uid": uid
					}])
					console.log(333)
				} else {
					console.log(err1.code)
				}
			} else {
				socket.send(["insSQL", {
					"err": false,
					"errCode": "注册成功!",
					"uid": uid
				}])
				console.log("注册成功")
				console.log(err1)
				console.log(values)
			}
		})
	},

	selSQL: function(uid, db_name, field, num) { //数据库查找函数
		var selectSQL = 'select ' + field + ' from ' + db_name + ' limit ' + num;
		conn.query(selectSQL, function(err1, res1) {
			res1.unshift("selSQL");
			console.log(res1.length)
			socket.send(res1)
		})
	},

	delSQL: function(db_name, field, values) { //数据库删除函数
		var deleteSQL = 'delete from ' + db_name + ' where ' + field + ' = "' + values + '"';
		conn.query(deleteSQL, function(err1, res1) {
		})
	},

	upSQL: function(uid, db_name, field, values, new_values) { //数据库更新函数
		var updateSQL = 'update ' + db_name + ' set ' + field + '="' + new_values + '" where ' + field + '="' + values + '"';
		conn.query(updateSQL, function(err1, res1) {
			console.log(err1)
			if (err1) {
				if (err1.code == "ER_DUP_ENTRY") {
					socket.send(["upSQL", {
						"err": true,
						"errCode": "用户名存在!",
						"user": values,
						"uid": uid
					}])
				} else {
					console.log(err1)
				}
			} else {
				socket.send(["upSQL", {
					"err": false,
					"errCode": "修改成功!",
					"user": new_values,
					"uid": uid
				}])
				console.log("修改成功")
			}
		})
	}
}

function startPage(event) {
	var user = event.user;
	var uid = event.uid;
	for (i = 0; i < userOnline.length; i++) {
		if (userOnline[i].uid == uid) {
			console.log(userOnline[i].uid)
			userNum = i;
		}
	}
	if (userNum || userNum == 0) {
		userOnline.splice(userNum, 1)
		userOnline.unshift({
			"user": user,
			"uid": uid
		})
	}else{
		userOnline.unshift({
			"user": user,
			"uid": uid
		})
	}
	socket.send(["pageOpen", {
		"message": "欢迎访问," + user,
		"uid": uid
	}, uid])
	socket.send(["pageOpen", userOnline])
	userNum = undefined;
}

function closePage(event) {
	var user = event.user;
	var uid = event.uid;
	for (i = 0; i < userOnline.length; i++) {
		if (userOnline[i].uid == uid) {
			userNum = i;
		}
	}
	if (userNum || userNum == 0) {
		userOnline.splice(userNum, 1)
		socket.send(["pageClose", userOnline])
	}
	userNum = undefined;
}
function chengeName (event) {
	var user = event.user;
	var uid = event.uid;
	for (i = 0; i < userOnline.length; i++) {
		if (userOnline[i].uid == uid) {
			userNum = i;
		}
	}
	if (userNum || userNum == 0) {
		userOnline.splice(userNum, 1)
		userOnline.unshift({
			"user": user,
			"uid": uid
		})
	}else{
		userOnline.unshift({
			"user": user,
			"uid": uid
		})
	}
	socket.emit('message', ["chengeName", {"uid": uid,"user": user}]);
	socket.send(["pageClose", userOnline])
	userNum = undefined;
}
function singleChat(event){
	var from = event.to;
	var to = event.from;
	var chat_name = event.user;
	socket.send(["singleChat", {"uid": from,"to":to,"chat_name": chat_name}])
}
function noChat(event) {
	var from = event.uid;
	var to = event.from;
	var chat_name = event.user;
	socket.send(["noChat", {"uid": from,"to":to,"chat_name": chat_name}])
}