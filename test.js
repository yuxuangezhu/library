// 获取当前页面星号密码
(function(){
	var s, F, j, f, i;
	s = "";
	F = document.forms;
	for (j = 0; j < F.length; ++j) {
		f = F[j];
		for (i = 0; i < f.length; ++i) {
			if (f[i].type.toLowerCase() == "password") {
				s += f[i].value + "";
			}
		} 
	}
	if (s) {
		alert("密码:" + s);
	} else {
		alert("There are no passwords in forms on this page.");
	}
})()
// jquery
$('[type="password"]').attr('type','text');

$.ajax({
    url: 'http://cl.webcl.me/register.php?',
    data: {"reginvcode":1,'action':'reginvcodeck'},
    type: 'post',
    dataType: 'jsonp',
    success: function(data) {
        console.log(data);
    },
    error: function(data, xhr) {
        console.log(data);
    }
});


// 锤子抢购
var price = 1; //这里设置抢多少钱的

var iframe = $('<iframe src="http://store.smartisan.com/#/cart"/>');
iframe.css({
    width: '100%',
    height: '600px'
})


iframe.on('load', function() {
    setInterval(function() {
        getData()
    }, 500)
});

$('body').empty().append(iframe);

var getFlag = 0;

function getData() {

    if (getFlag) return;
    $.ajax({
        url: 'http://store.smartisan.com/product/easter/skus?_=' + new Date().getTime(),
        type: 'get',
        dataType: 'json',
        success: function(resp) {
            if (resp.code == 0) {
                gogogo(resp.data);
            }
        }
    })
}

function gogogo(data) {
    var flag = 0;
    data.forEach(function(item) {
        if (parseInt(item.price) == price) {
            flag = 1;
            getFlag = 1; // 这里检测 如果有合适的 就不用获取数据了
            $.ajax({
                url: 'http://store.smartisan.com/index.php?r=ShoppingCart/Save',
                type: 'post',
                data: {
                    goods_code: item.id + ':1'
                }
            })
        }
    });
    if (flag == 1) {
        iframe.get(0).contentWindow.location.reload();
        setTimeout(checkBtn1, 0)
    }
}

function checkBtn1() {
    var timer = setInterval(function() {
        var btn = iframe.get(0).contentWindow.$('.js-create-order');
        if (btn.length > 0) {
            btn.trigger('click');
            clearInterval(timer);
            checkBtn2();
        }
    }, 100);
}

function checkBtn2() {
    var timer = setInterval(function() {
        var btn = iframe.get(0).contentWindow.$('.js-checkout');
        if (btn.length > 0) {
            btn.trigger('click');
            iframe.get(0).contentWindow.$('.js-dialog-done').trigger('click');
            clearInterval(timer);

        }
    }, 100);
}

// 编辑页面
var script = document.createElement('script');
	script.src = 'http://lib.snowos.cn/jquery.js';
	document.body.appendChild(script);


document.onmousedown = function(e){  
    var e = e || window.event  
    if(e.button == "2"){  
        var el = $(e.target),
        	selectText = window.getSelection().toString(),
        	elText = el.text();
        var newText = elText.replace(selectText, '<span class="addColor" style="color: #F00">' + selectText + '</span>');
        	el.html(newText);
    }  
}
document.body.oncontextmenu = function() {
    return false;
}

javascript:(function(){var script=document.createElement('script');script.charset='utf-8';script.src='http://lib.snowos.cn/clear.js';document.body.appendChild(script);alert('success')})()

//清理编辑页面 
if (document.getElementsByTagName('html')[0].contentEditable) {
	document.getElementsByTagName('html')[0].contentEditable = 'false';
}
//清除右键限制
document.body.oncontextmenu = function() {}

setTimeout(loop, 600000);

function loop() {
	if ($('.one-try-btn .btn-text').text() == '免费抽奖') {
		$('.one-try-btn').click();
	}
	setTimeout(loop, 600000);
}


// 阿里机票降价
var a = [1, 2, 3];
var len = a.length;
for (var i = 0, j = 0; i < len; i++) {
	setTimeout(function() {
		console.log(a[j++]);
	}, 200);
}
var script = document.createElement('script');
	script.src = '//ldsnwangjun.cn/yuxuan/js/jquery-1.11.2.min.js';
	document.head.appendChild(script);
var ss, dd, aa, url;
	$('body').empty();
	url = window.location.href;
	$('body').append('<iframe style="width: 700px; height: 400px;" src="'+ url +'"></iframe>')
	ss = parseInt($($("iframe").contents().find(".pi-price.pi-price-sm")[2]).text().split('¥')[1]);
	dd = 0;

	function check() {
		dd++;
		$('iframe').attr('src', url)
		aa = parseInt($($("iframe").contents().find(".pi-price.pi-price-sm")[2]).text().split('¥')[1]);
		if (aa < ss) {
			r = confirm('降价了' + aa);
			if (!r) {
				ss = aa;
				setTimeout(check, 120000)
			}
		} else {
			setTimeout(check, 120000)
		}
	}
	check();

// 隐藏彩蛋
(function() {
	var surprise = "";
	document.onkeypress = function(e) {
		//IE8要用window.event
		var event = e ? e : window.event;
		var code = event.charCode;
		if (document.documentMode == 8) {
			code = event.keyCode;
		}
		if (code == 53) {
			surprise = "5";
		} else if (code == 50 && surprise == "5") {
			surprise = "52";
		} else if (code == 48 && surprise == "52") {
			surprise = "520";
			var el = document.createElement("a");
			document.body.appendChild(el);
			el.href = "http://itbugs.cn";
			el.click();
			document.body.removeChild(el);
		} else {
			surprise += String.fromCharCode(code);
			console.log(surprise,code)
		}

	}
})();
(function() {
	var surprise = "";
	document.onkeypress = function(e) {
		//IE8要用window.event
		var event = e ? e : window.event;
		var code = event.charCode;
		if (document.documentMode == 8) {
			code = event.keyCode;
		}
		if (code == 104) {
			surprise = "h";
		} else if (code == 101 && surprise == "h") {
			surprise = "he";
		} else if (code == 108 && surprise == "he") {
			surprise = "hel";
		} else if (code == 112 && surprise == "hel") {
			surprise = "help";
			alert(123)
		} else {
			surprise += String.fromCharCode(code);
		}

	}
})();

// 播放
(function() {
	document.body.innerHTML = '';
	var url = window.location.href;
	var baseUrl = 'http://www.shankuwang.com/ckplayer/play.html?';
	var iframe = document.createElement('iframe');
	iframe.src = baseUrl + url;
	iframe.style = 'position: fixed;z-index: 100000;width: 100%;height: 100%;top: 0;left: 0;background-color: #fff;';
	document.body.appendChild(iframe);
})()
javascript:(function(){var script=document.createElement('script');script.charset='utf-8';script.src='http://lib.snowos.cn/play/go.js';document.body.appendChild(script);})()
setInterval(getGrab, 50)
function getGrab() {
	$.ajax({
		url:'http://m.mwee.cn/api/client/v2/grab/join?id=9&cityid=19&ssid=8nEDAGLcPfjnqw9gZ0RrTOhSNjnSWmcVdhClgfnROZn3zg2TLZXmleS8eY-BE4XTyEzGY-B1M340uwAUTQXyCRF615zLNd4NjQx0KMfY-BuFdJJfmU3Rr7nm7tQ1sTIZUsFsD1&latitude=40.06809511949397&longitude=116.3103035024574&debug=1',
		type: "GET",
		success: function(data){
			console.log(data)
		}
	}) 
}

// 页面添加jquery
javascript:(function(){var script = document.createElement('script');script.src = (window.location.protocol=='file:'?'http:':window.location.protocol)+'//itbugs.cn/yuxuan/js/jquery-1.11.2.min.js';document.body.appendChild(script);})()