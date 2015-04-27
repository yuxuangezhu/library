$("body").append('<div id="deng" style="position: fixed;top: 210px;width: 80%;height: 160px;background: rgba(226, 224, 224, 0.8);text-align: center;color: #F22D2D;line-height: 160px;font-size: 22px;left: 10%;border-radius: 10px;font-family: "Microsoft YaHei">正在匹配题目请稍后,已匹配<span>...</span></div>')
var aa = $("#iframe").contents().find("iframe").contents().find("iframe").contents().find(".TiMu").find(".Zy_TItle").find("div");
var ss = [];
for (var i = 0; i < aa.length; i++) {
	ss[i] = $(aa[i]).text()
};
var shu = 0;

function cha(data) {
	if (shu >= ss.length) {
		alert("查询完成!")
		$("#deng").remove();
		for (var i = 0; i < aa.length; i++) {
			if (ff[i]) {
				$(aa[i]).text(ff[i])
			}
		};
		return
	}
	$.ajax({
		url: 'post.php',
		dataType: 'jsonp',
		jsonp: 'aaa',
		data: {
			key: data
		}
	})
}
var ff = []

function aaa(data) {
	ff.push(data)
	$("#deng span").html((shu + 1) + '个题目,共' + ss.length + '个题目')
	shu = shu + 1;
	cha(ss[shu])
}
cha(ss[shu])