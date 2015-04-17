var socket, timeOut, messType, SQL, uid, userName;
var switchLock = 0;
var userLock = 0;
var lock = 0; //初始化check变量
$(document).ready(function() {
	//页面初始化
	pageStart();
	//websockets连接模块
	socket = io.connect('127.0.0.1:8020/'); //链接websocket服务器
	if (!localStorage.userName) {
		setUserName();
	} else {
		userName = localStorage.userName;
		socket.send({
			"user": userName,
			"uid": uid,
			"messType": "pageOpen"
		})
	}
	socket.on("message", function(event) { //监听服务器信息
		//debugger
		handleMessage(event);
	});
	socket.on('disconnect', function() {
		var time = new Date();
		console.log(time.toLocaleTimeString() + '服务器断开');
	});

	//页面事件中心
	$("#console_name").blur(function() { //当用户名变化时获取用户名存入localStorage
		nameBlur()
	})
	$('#console_send').click(function() { //普通模式发送信息
		sendClick()
	});
	$("#console_input").focus(function() { //内容输入框获得焦点
		contentFocus()
	});
	$("#console_input").blur(function() { //内容输入框失去焦点
		$("#console_input").addClass("bg_opacity")
		clearInterval(timeOut) //删除计时事件
	});

	$(".edit_name").click(function() { //用户名处理事件
		editName();
	});
	$(".switch").click(function() { //实时输入开关
		switchClick()
	});
	$('body').keyup(function(event) { //键盘敲击事件
		if (event.keyCode == 13) { //点击enter键发送信息
			sendClick()
		}
	});
	$(".face_face").click(function() {
		var face_code = $(this).attr("alt");
		console.log(00)
		var contentText = $("#console_input").val();
		$("#console_input").val(contentText + face_code);
	})
	$(".face_emoji").click(function() {
		var face_code = $(this).attr("alt");
		console.log(00)
		var contentText = $("#console_input").val();
		$("#console_input").val(contentText + face_code);
	})
	$(".face").click(function() {
		var face_clcik = $(".select_face").css("display");
		console.log(face_clcik)
		if (face_clcik == "none") {
			$(".select_face").css("display", "block");
		} else {
			$(".select_face").css("display", "none");
		}
	})

	$("#messageBox").delegate("img", "click", function() {
		console.log(231)
		var img_url = $(this).attr("src");
		$("body").append('<div class="big_img_box"><span class="big_img_close"></span><div class="big_img_bg"></div><img src="' + img_url + '"></div>')
	})

	$("body").delegate(".big_img_close", "click", function() {
		console.log(342)
		$(".big_img_box").remove();
	})
	$("#setuser button").click(function() {
		localStorage.userName = $("#setuser input").val();
		var message = {
			"user": localStorage.userName,
			"uid": uid,
			"messType": "pageOpen"
		}
		socket.send(message); //发送信息到服务器
		$("#setuser").removeClass("domBlock")
		$("#setuser").addClass("domNone")

	})
	$(".left_button").click(function() {
		chat_left();
	})
	$(".chat_left").click(function() {
			chat_left();
	})
	$(".chat_left_box").delegate("p","click",function(){
		var to = $(this).attr("touid");
		var from = localStorage.uid;
		var chat_name = $(this).find(".user_online_name").text();
		if(from == to){
			alert_box("不能和自己聊天")
		}else{
			single_chat(from,to,chat_name)
			var message = {
				"user": localStorage.userName,
				"to": to,
				"from": uid,
				"messType": "singleChat"
			}
			socket.send(message); //发送信息到服务器
		}
	})
	$("#single em").click(function(){
		$("#single").css("display","none")
		$("#single iframe").attr("src","");
	})
		//函数库
		//
	function pageStart() {
		if (localStorage.uid) {
			uid = localStorage.uid;
		} else {
			uid = setUid();
			localStorage.uid = uid;
		}
		// if (localStorage.tid || localStorage.tid == "") {
		// 	tid = localStorage.tid;
		// } else {
		// 	tid = setTid();
		// 	localStorage.tid = tid;
		// }
		$("#console_name").text(localStorage.userName) //初始化用户名
		user_name = $("#console_name").text();
		edit_name = document.getElementById('console_name');
		if (user_name) {
			$("#console_name").addClass("user_name_off");
			edit_name.attributes["contenteditable"].value = "flase";
			$("#console_input").after('<button class="edit_name">修改用户</button>');
		}
		var face_img = $(".select_face");
		// face_box = ["smilea_org.gif", "tootha_org.gif", "laugh.gif", "tza_org.gif", "kl_org.gif", "kbsa_org.gif", "cj_org.gif", "shamea_org.gif", "zy_org.gif", "bz_org.gif", "bs2_org.gif", "lovea_org.gif", "sada_org.gif", "heia_org.gif", "qq_org.gif", "sb_org.gif", "mb_org.gif", "ldln_org.gif", "yhh_org.gif", "zhh_org.gif", "x_org.gif", "cry.gif", "wq_org.gif", "t_org.gif", "k_org.gif", "bba_org.gif", "angrya_org.gif", "yw_org.gif", "cza_org.gif", "88_org.gif", "sk_org.gif", "sweata_org.gif", "sleepya_org.gif", "sleepa_org.gif", "money_org.gif", "sw_org.gif", "cool_org.gif", "hsa_org.gif", "hatea_org.gif", "gza_org.gif", "dizzya_org.gif", "bs_org.gif", "crazya_org.gif", "h_org.gif", "yx_org.gif", "nm_org.gif", "doge_org.gif", "horse2_org.gif","bmzuocao_org.gif", "bmzhuakuang_org.gif", "bmzhongqiang_org.gif", "bmzhenjing_org.gif", "bmzan_org.gif", "bmxiyue_org.gif", "bmxingwu_org.gif", "bmxingfen_org.gif", "bmxielei_org.gif", "bmwabikong_org.gif", "bmtushetou_org.gif", "bmtucao_org.gif", "bmtousu_org.gif", "bmtiaosheng_org.gif", "bmtiaopi_org.gif", "bmtaolun_org.gif", "bmtaitui_org.gif", "bmsikao_org.gif", "bmshengqi_org.gif", "bmqinwen_org.gif", "bmqingxing_org.gif", "bmneihan_org.gif", "bmmanglu_org.gif", "bmluanru_org.gif", "bmluanmeng_org.gif", "bmliulei_org.gif", "bmliukoushui_org.gif", "bmliubiti_org.gif", "bmliguo_org.gif", "bmliezui_org.gif", "bmlaladui_org.gif", "bmkusu_org.gif", "bmkuqi_org.gif", "bmkubi_org.gif"];
		// face_name = ["[呵呵]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻屎]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[懒得理你]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[打哈气]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡觉]", "[钱]", "[失望]", "[酷]", "[花心]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[doge]", "[神马]","[bm做操]", "[bm抓狂]", "[bm中枪]", "[bm震惊]", "[bm赞]", "[bm喜悦]", "[bm醒悟]", "[bm兴奋]", "[bm血泪]", "[bm挖鼻孔]", "[bm吐舌头]", "[bm吐槽]", "[bm投诉]", "[bm跳绳]", "[bm调皮]", "[bm讨论]", "[bm抬腿]", "[bm思考]", "[bm生气]", "[bm亲吻]", "[bm庆幸]", "[bm内涵]", "[bm忙碌]", "[bm乱入]", "[bm卖萌]", "[bm流泪]", "[bm流口水]", "[bm流鼻涕]", "[bm路过]", "[bm咧嘴]", "[bm啦啦队]", "[bm哭诉]", "[bm哭泣]", "[bm苦逼]"];
		face_emoji = ["-😄-0", "-😃-0", "0-😀-0", "-😊-0", "-☺-☺️", "-😉-0", "-😍-0", "-😘-0", "-😚-0", "0-😗-0", "0-😙-0", "-😜-0", "-😝-0", "0-😛-0", "-😳-0", "-😁-0", "-😔-0", "-😌-0", "-😒-0", "-😞-0", "-😣-0", "-😢-0", "-😂-0", "-😭-0", "-😪-0", "-😥-0", "-😰-0", "0-😅-0", "-😓-0", "0-😩-0", "0-😫-0", "-😨-0", "-😱-0", "-😠-0", "-😡-0", "0-😤-0", "-😖-0", "0-😆-0", "0-😋-0", "-😷-0", "0-😎-0", "0-😴-0", "0-😵-0", "-😲-0", "0-😟-0", "0-😦-0", "0-😧-0", "0-😈-0", "-👿-0", "0-😮-0", "0-😬-0", "0-😐-0", "0-😕-0", "0-😯-0", "0-😶-0", "0-😇-0", "-😏-0", "0-😑-0", "-👲-0", "-👳-0", "-👮-0", "-👷-0", "-💂-0", "-👶-0", "-👦-0", "-👧-0", "-👨-0", "-👩-0", "-👴-0", "-👵-0", "-👱-0", "-👼-0", "-👸-0", "0-😺-0", "0-😸-0", "0-😻-0", "0-😽-0", "0-😼-0", "0-🙀-0", "0-😿-0", "0-😹-0", "0-😾-0", "0-👹-0", "0-👺-0", "0-🙈-0", "0-🙉-0", "0-🙊-0", "-💀-0", "-👽-0", "-💩-0", "-🔥-0", "-✨-0", "-🌟-0", "0-💫-0", "0-💥-0", "-💢-0", "-💦-0", "0-💧-0", "-💤-0", "-💨-0", "-👂-0", "-👀-0", "-👃-0", "0-👅-0", "-👄-0", "-👍-0", "-👎-0", "-👌-0", "-👊-0", "-✊-0", "-✌-✌️", "-👋-0", "-✋-0", "-👐-0", "-👆-0", "-👇-0", "-👉-0", "-👈-0", "-🙌-0", "-🙏-0", "-☝-☝️", "-👏-0", "-💪-0", "-🚶-0", "-🏃-0", "-💃-0", "-👫-0", "0-👪-0", "0-👬-0", "0-👭-0", "-💏-0", "-💑-0", "-👯-0", "-🙆-0", "-🙅-0", "-💁-0", "0-🙋-0", "-💆-0", "-💇-0", "-💅-0", "0-👰-0", "0-🙎-0", "0-🙍-0", "-🙇-0", "-🎩-0", "-👑-0", "-👒-0", "-👟-0", "0-👞-0", "-👡-0", "-👠-0", "-👢-0", "-👕-0", "-👔-0", "0-👚-0", "-👗-0", "0-🎽-0", "0-👖-0", "-👘-0", "-👙-0", "-💼-0", "-👜-0", "0-👝-0", "0-👛-0", "0-👓-0", "-🎀-0", "-🌂-0", "-💄-0", "-💛-0", "-💙-0", "-💜-0", "-💚-0", "-❤-❤️", "-💔-0", "-💗-0", "-💓-0", "0-💕-0", "0-💖-0", "0-💞-0", "-💘-0", "0-💌-0", "-💋-0", "-💍-0", "-💎-0", "0-👤-0", "0-👥-0", "0-💬-0", "-👣-0", "0-💭-0", "-🐶-0", "-🐺-0", "-🐱-0", "-🐭-0", "-🐹-0", "-🐰-0", "-🐸-0", "-🐯-0", "-🐨-0", "-🐻-0", "-🐷-0", "0-🐽-0", "-🐮-0", "-🐗-0", "-🐵-0", "-🐒-0", "-🐴-0", "-🐑-0", "-🐘-0", "0-🐼-0", "-🐧-0", "-🐦-0", "-🐤-0", "0-🐥-0", "0-🐣-0", "-🐔-0", "-🐍-0", "0-🐢-0", "-🐛-0", "0-🐝-0", "0-🐜-0", "0-🐞-0", "0-🐌-0", "-🐙-0", "-🐚-0", "-🐠-0", "-🐟-0", "-🐬-0", "-🐳-0", "0-🐋-0", "0-🐄-0", "0-🐏-0", "0-🐀-0", "0-🐃-0", "0-🐅-0", "0-🐇-0", "0-🐉-0", "-🐎-0", "0-🐐-0", "0-🐓-0", "0-🐕-0", "0-🐖-0", "0-🐁-0", "0-🐂-0", "0-🐲-0", "0-🐡-0", "0-🐊-0", "-🐫-0", "0-🐪-0", "0-🐆-0", "0-🐈-0", "0-🐩-0", "0-🐾-0", "-💐-0", "-🌸-0", "-🌷-0", "-🍀-0", "-🌹-0", "-🌻-0", "-🌺-0", "-🍁-0", "-🍃-0", "-🍂-0", "0-🌿-0", "-🌾-0", "0-🍄-0", "-🌵-0", "-🌴-0", "0-🌲-0", "0-🌳-0", "0-🌰-0", "0-🌱-0", "0-🌼-0", "0-🌐-0", "0-🌞-0", "0-🌝-0", "0-🌚-0", "0-🌑-0", "0-🌒-0", "0-🌓-0", "0-🌔-0", "0-🌕-0", "0-🌖-0", "0-🌗-0", "0-🌘-0", "0-🌜-0", "0-🌛-0", "-🌙-0", "0-🌍-0", "0-🌎-0", "0-🌏-0", "0-🌋-0", "0-🌌-0", "0-🌠-0", "0-⭐-⭐️", "-☀-☀️", "0-⛅-⛅️", "-☁-☁️", "-⚡-⚡️", "-☔-☔️", "0-❄-❄️", "-⛄-⛄️", "-🌀-0", "0-🌁-0", "-🌈-0", "-🌊-0"]
		face_emoji_po = ["0px 0px", "-21px 0px", "-43px 0px", "-64px 0px", "-86px 0px", "-107px 0px", "-129px 0px", "-150px 0px", "-172px 0px", "-193px 0px", "-215px 0px", "-236px 0px", "-258px 0px", "-279px 0px", "-301px 0px", "-322px 0px", "-344px 0px", "-365px 0px", "-387px 0px", "-408px 0px", "-430px 0px", "-451px 0px", "-473px 0px", "-494px 0px", "-516px 0px", "-537px 0px", "-559px 0px", "-580px 0px", "-602px 0px", "-623px 0px", "-645px 0px", "-666px 0px", "-688px 0px", "-709px 0px", "-731px 0px", "-752px 0px", "-774px 0px", "-795px 0px", "-817px 0px", "-838px 0px", "0px -22px", "-21px -22px", "-43px -22px", "-64px -22px", "-86px -22px", "-107px -22px", "-129px -22px", "-150px -22px", "-172px -22px", "-193px -22px", "-215px -22px", "-236px -22px", "-258px -22px", "-279px -22px", "-301px -22px", "-322px -22px", "-344px -22px", "-365px -22px", "-387px -22px", "-408px -22px", "-430px -22px", "-451px -22px", "-473px -22px", "-494px -22px", "-516px -22px", "-537px -22px", "-559px -22px", "-580px -22px", "-602px -22px", "-623px -22px", "-645px -22px", "-666px -22px", "-688px -22px", "-709px -22px", "-731px -22px", "-752px -22px", "-774px -22px", "-795px -22px", "-817px -22px", "-838px -22px", "0px -43px", "-21px -43px", "-43px -43px", "-64px -43px", "-86px -43px", "-107px -43px", "-129px -43px", "-150px -43px", "-172px -43px", "-193px -43px", "-215px -43px", "-236px -43px", "-258px -43px", "-279px -43px", "-301px -43px", "-322px -43px", "-344px -43px", "-365px -43px", "-387px -43px", "-408px -43px", "-430px -43px", "-451px -43px", "-473px -43px", "-494px -43px", "-516px -43px", "-537px -43px", "-559px -43px", "-580px -43px", "-602px -43px", "-623px -43px", "-645px -43px", "-666px -43px", "-688px -43px", "-709px -43px", "-731px -43px", "-752px -43px", "-774px -43px", "-795px -43px", "-817px -43px", "-838px -43px", "0px -64px", "-21px -64px", "-43px -64px", "-64px -64px", "-86px -64px", "-107px -64px", "-129px -64px", "-150px -64px", "-172px -64px", "-193px -64px", "-215px -64px", "-236px -64px", "-258px -64px", "-279px -64px", "-301px -64px", "-322px -64px", "-344px -64px", "-365px -64px", "-387px -64px", "-408px -64px", "-430px -64px", "-451px -64px", "-473px -64px", "-494px -64px", "-516px -64px", "-537px -64px", "-559px -64px", "-580px -64px", "-602px -64px", "-623px -64px", "-645px -64px", "-666px -64px", "-688px -64px", "-709px -64px", "-731px -64px", "-752px -64px", "-774px -64px", "-795px -64px", "-817px -64px", "-838px -64px", "0px -86px", "-21px -86px", "-43px -86px", "-64px -86px", "-86px -86px", "-107px -86px", "-129px -86px", "-150px -86px", "-172px -86px", "-193px -86px", "-215px -86px", "-236px -86px", "-258px -86px", "-279px -86px", "-301px -86px", "-322px -86px", "-344px -86px", "-365px -86px", "-387px -86px", "-408px -86px", "-430px -86px", "-451px -86px", "-473px -86px", "-494px -86px", "-516px -86px", "-537px -86px", "-559px -86px", "-580px -86px", "-602px -86px", "-623px -86px", "-645px -86px", "-666px -86px", "-688px -86px", "-709px -86px", "-731px -86px", "-752px -86px", "-774px -86px", "-795px -86px", "-817px -86px", "-838px -86px", "0px -107px", "-21px -107px", "-43px -107px", "-64px -107px", "-86px -107px", "-107px -107px", "-129px -107px", "-150px -107px", "-172px -107px", "-193px -107px", "-215px -107px", "-236px -107px", "-258px -107px", "-279px -107px", "-301px -107px", "-322px -107px", "-344px -107px", "-365px -107px", "-387px -107px", "-408px -107px", "-430px -107px", "-451px -107px", "-473px -107px", "-494px -107px", "-516px -107px", "-537px -107px", "-559px -107px", "-580px -107px", "-602px -107px", "-623px -107px", "-645px -107px", "-666px -107px", "-688px -107px", "-709px -107px", "-731px -107px", "-752px -107px", "-774px -107px", "-795px -107px", "-817px -107px", "-838px -107px", "0px -129px", "-21px -129px", "-43px -129px", "-64px -129px", "-86px -129px", "-107px -129px", "-129px -129px", "-150px -129px", "-172px -129px", "-193px -129px", "-215px -129px", "-236px -129px", "-258px -129px", "-279px -129px", "-301px -129px", "-322px -129px", "-344px -129px", "-365px -129px", "-387px -129px", "-408px -129px", "-430px -129px", "-451px -129px", "-473px -129px", "-494px -129px", "-516px -129px", "-537px -129px", "-559px -129px", "-580px -129px", "-602px -129px", "-623px -129px", "-645px -129px", "-666px -129px", "-688px -129px", "-709px -129px", "-731px -129px", "-752px -129px", "-774px -129px", "-795px -129px", "-817px -129px", "-838px -129px", "0px -150px", "-21px -150px", "-43px -150px", "-64px -150px", "-86px -150px", "-107px -150px", "-129px -150px", "-150px -150px", "-172px -150px", "-193px -150px", "-215px -150px", "-236px -150px", "-258px -150px", "-279px -150px", "-301px -150px", "-322px -150px", "-344px -150px", "-365px -150px", "-387px -150px", "-408px -150px", "-430px -150px", "-451px -150px", "-473px -150px", "-494px -150px", "-516px -150px"]
			// for(var i = 0; i < face_box.length; i++){
			//     face_img.append('<img src="images/face_img/'+face_box[i]+'" alt="'+face_name[i]+'" class="face_face">')
			// }
		for (var i = 0; i < face_emoji_po.length; i++) {
			face_img.append('<div alt="' + face_emoji[i] + '" class="face_emoji" style="background-position:' + face_emoji_po[i] + ';"></div>')
		}

	}

	function handleMessage(event) { //message处理函数
		console.log('服务器消息', event);
		// debugger
		if (event.uid) {
			var message_uid = event.uid;
		} else if (event[1].uid) {
			var message_uid = event[1].uid;
		}
		console.log(message_uid)
		if (message_uid == localStorage.uid) {
			if (event.messageType) {
				alert(event.errContent)
				return;
			}
			var typeData = event[0];
			switch (typeData) {
				case "pageOpen":
					alert_box(event[1].message)
					$("#console_name").text(localStorage.userName)
					console.log("pageOpen");
					break
				case "maxNum":
					console.log("maxNum")
					break 
				case "chengeName":
					localStorage.userName = event[1].user;
					break
				case "singleChat":
					var from = event[1].uid;
					var to = event[1].to;
					var chat_name = event[1].chat_name;
					if(confirm(chat_name+'请求与你私聊,是否同意')){
						single_chat(from,to,chat_name)
					}else{
						no_chat(from,to)
					}
					break
				case "noChat":
					var chat_name = event[1].chat_name;
					alert(chat_name+"拒绝了你的请求")
					$("#single").css("display","none")
					$("#single iframe").attr("src","");
					break
					// case "insSQL":
					// 	if (event[1].err) {
					// 		$("#console_name").empty();
					// 	} else {
					// 		localStorage.userName = $("#console_name").text();
					// 	}
					// 	alert(event[1].errCode)
					// 	console.log("insert")
					// 	break;
					// case "upSQL":
					// 	localStorage.userName = event[1].user;
					// 	$("#console_name").text(localStorage.userName);
					// 	alert(event[1].errCode)
					// 	console.log("updata")
					// 	break;
				default:
					if (switchLock == 1) { //检测是否开启实时输入模式,switchLock=1表示开启
						if ($("p").hasClass("message_" + uid)) {
							$(".message_" + uid).html("<span class='message_n'>" + event.user + " " + event.time + "</span><span class='message_c'>" + event.content + "</span>")
						} else {
							$("#messageBox").append("<p class='.message_" + uid + " p_float_right'><span class='message_n'>" + event.user + "  " + event.time + "</span><span class='message_c'>" + event.content + "</span></p>")
						}
					} else {
						$("#messageBox").append("<p class='p_float_right'><span class='message_n'>" + event.user + "  " + event.time + "</span><span class='message_c'>" + event.content + "</span></p>")
					}
			}
		} else {
			var typeData = event[0];
			switch (typeData) {
				case "pageOpen":
					var sHTML = "";
					for (i = 0; i < event[1].length; i++) {
						sHTML = sHTML + '<p class="user_online" touid="'+ event[1][i].uid +'"><span class="user_online_uid">' + event[1][i].uid + '</span><span class="user_online_name">' + event[1][i].user + '</span></p>';
					}
					$(".chat_left_box").html(sHTML)
					break
				case "pageClose":
					var sHTML = "";
					for (i = 0; i < event[1].length; i++) {
						sHTML = sHTML + '<p class="user_online"><span class="user_online_uid">' + event[1][i].uid + '</span><span class="user_online_name"><a href="single.html?from=' + uid + '&to=' + event[1][i].uid + '" target="_blank">' + event[1][i].user + '</a></span></p>';
					}
					$(".chat_left_box").html(sHTML)
					break
				case "singleChat":
					console.log("连接成功")
					break
				case "noChat":
					console.log("拒绝连接")
					break
				default:
					if (event.switchLock == 1) {
						if (event.send) {
							$(".message_" + event.uid).remove();
							$("#messageBox").append("<p class='p_float_left'><span class='message_n'>" + event.user + "  " + event.time + "</span><span class='message_c'>" + event.content + "</span></p>")
						} else if (!$("p").hasClass("message_" + event.uid)) {
							$("#messageBox").append('<p class="message_' + event.uid + ' p_float_left"></p>') //添加内容盒子
							$(".message_" + event.uid).html("<span class='message_n'>" + event.user + "  " + event.time + "</span><span class='message_c'>" + event.content + "</span>")
						} else {
							$(".message_" + event.uid).html("<span class='message_n'>" + event.user + "  " + event.time + "</span><span class='message_c'>" + event.content + "</span>")
						}
					} else {
						$("#messageBox").append("<p class='p_float_left'><span class='message_n'>" + event.user + "  " + event.time + "</span><span class='message_c'>" + event.content + "</span></p>")
					}
			}
		}
		checkMessNum();
	}

	function check() { //实时输入检测函数
		if (!$("p").hasClass("message_" + uid)) {
			$("#messageBox").append("<p class='message_" + uid + "  p_float_right'></p>") //添加内容盒子
		}
		aa = $("#console_input").val(); //获取输入值
		var time = new Date();
		var message = {
			"switchLock": switchLock,
			"user": localStorage.userName,
			"time": time.toLocaleTimeString(),
			"content": $('#console_input').val(),
			"uid": uid
		}
		socket.send(message); //发送信息到服务器
		timeOut = setTimeout(check, 500) //设置计时函数
	}

	function nameCheck() { //用户名检测函数
		var console_name = $("#console_name").text();
		if (console_name == "") { //检测用户名是否为空
			alert("请输入用户名!")
			lock = 1; //设置check变量
		}
		return lock;
	}

	function sendClick() { //信息发送函数
		contentBlur();
		nameCheck(); //检测用户名
		checkEdit();
		if (!($("#console_input").val())) {
			alert_box("发送内容不能为空!")
			return
		}
		console.log(111)
		if (lock == 0) { //判断用户名是否合法
			var time = new Date();
			$(".message_" + uid).remove()
			var message = {
				"send": true,
				"switchLock": switchLock,
				"user": localStorage.userName,
				"time": time.toLocaleTimeString(),
				"content": $('#console_input').val(),
				"uid": uid,
			}
			socket.send(message); //发送信息到服务器
			$("#console_input").val("")
			lock = 0; //初始化检测变量
		}
		return lock;
	}

	function nameBlur() { //用户名设置函数
		var new_user = $("#console_name").text();
		checkEdit();
		socket.send({
			"user": new_user,
			"uid": uid,
			"messType": "chengeName"
		})
		userLock = 1;
	}

	function contentFocus() {
		if (switchLock == 1) { //检测是否开启实时输入模式
			check()
		}
		checkEdit();
		$(".select_face").css("display", "none");
		$("#console_input").removeClass("bg_opacity")
	}

	function editName() {
		console.log(222)
			//debugger
		var edit_name = document.getElementById('console_name');
		if (edit_name.attributes["contenteditable"].value == "true") {
			edit_name.attributes["contenteditable"].value = "flase";
			$("#console_name").removeClass("user_name_on")
			$("#console_name").addClass("user_name_off")
			$(".edit_name").text("修改用户名")
		} else {
			if (userLock == 0) {
				edit_name.attributes["contenteditable"].value = "true";
				$("#console_name").removeClass("user_name_off")
				$("#console_name").addClass("user_name_on")
				$(".edit_name").text("使用用户名")
			} else {
				userLock = 0;
				return
			}
		}
	}

	function checkEdit() {
		edit_name.attributes["contenteditable"].value = "false";
		$("#console_name").removeClass("user_name_on")
		$("#console_name").addClass("user_name_off")
		$(".edit_name").text("修改用户名");
	}

	function switchClick() {
		if ($(".switch").hasClass("stateonlock")) { //检测当前状态
			switchLock = 0; //设置check变量
			$(".switch").css("background", "#fff");
			$(".switch").text("开启")
			$(".switch").removeClass("stateonlock")
			$(".message_" + uid).remove() //点击关闭后删除未发送数据
		} else {
			switchLock = 1;
			$(".switch").css("background", "#2d78f4");
			$(".switch").text("关闭")
			$(".switch").addClass("stateonlock")
			if (!$("p").hasClass("message_" + uid)) {
				$("#messageBox").append("<p class='message_" + uid + " p_float_right'></p>") //添加内容盒子
			}
		}
	}

	function contentBlur() {
		$("#console_input").addClass("bg_opacity")
		if (switchLock == 1) {
			$("#console_input").blur()
		} else {
			$("#console_input").focus()
		}
	}

	function checkMessNum() {
			if ($("p").length > 0) {
				var messNum = $("p").length - 1;
				console.log(messNum)
				var messHeight = parseInt($($("p")[messNum]).css("height")) + 50;
				console.log(messHeight)
				var scrollStart = document.getElementById("messageBox").scrollTop;
				document.getElementById("messageBox").scrollTop = scrollStart + messHeight;
			}
		}
		// function onKeydown() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};

	function setUid() { //生成uid
		return (S4() + S4() + S4());
	};

	function setTid() { //生成tid
		return (S4() + S4() + S4() + S4() + S4());
	};

	function setUserName() {
		$("#setuser").removeClass("domNone")
		$("#setuser").addClass("domBlock")
	}

	// function unloadPageTip (event){
	// 	return "您编辑的文章内容还没有进行保存!"
	// };
	window.onbeforeunload = function(event) {
		var message = {
			"user": localStorage.userName,
			"uid": uid,
			"messType": "pageClose"
		}
		socket.send(message); //发送信息到服务器
		console.log(1111)
		return "cdcdc"
	}

	function chat_left() {
		if ($(".chat_left").hasClass("block")) {
			$(".chat_left").attr("style", "");
			$(".chat_left").removeClass("block")
			$(".left_button").css({
				"left": "0px",
				'transform':'rotate(0deg)'
			})
		} else {
			$(".chat_left").css("margin-left", "0");
			$(".chat_left").addClass("block")
			$(".left_button").css({
				"left": "197px",
				'transform':'rotate(180deg)'
			})
		}
	}
	function single_chat(from,to,chat_name){
		var iframe_url = 'single.html?from=' + from + '&to=' + to;
		$("#single iframe").attr("src",iframe_url);
		$("#single span").text("正在与"+chat_name+"聊天")
		$("#single").css("display","block")
	}
	function no_chat(from,to){
		var message = {
			"user": localStorage.userName,
			"uid": to,
			"from":from,
			"messType": "noChat"
		}
		socket.send(message); //发送信息到服务器
	}
	function alert_box(text){
		$("#alert_box").text(text)
		$("#alert_box").css({
			'display':'block',
			'background':'#FC7728',
		})
		setTimeout(function(){
			$("#alert_box").css({
				'display':'none'
			})
		},3000)
	}
});