var request = require('request');
var cheerio = require('cheerio');
var request = request.defaults({
	jar: true
});

var funcCenter = {
	login: function(cb) {
		request('https://www.v2ex.com/signin', function(error, response, body) {
			console.log('login', new Date())
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var formBox = $('[action="/signin"]');
				var submitMsg = Array.from(formBox.find('input'));
				var postDate = {};
				submitMsg.forEach(function(v, i) {
					if ($(v).attr('name')) {
						var valueText = $(v).val();
						if (i == 0) {
							valueText = '账号';
						} else if (i == 1) {
							valueText = '密码';
						}
						postDate[$(v).attr('name')] = valueText;
					}
				})
				request.post({
					url: 'https://www.v2ex.com/signin',
					rejectUnauthorized: false, // 忽略安全警告
					form: postDate
				}, function(error, response, body) {
					if (!error && response.statusCode == 302) {
						console.log('login in', new Date())
							// var msg = JSON.parse(body);
						cb()
					} else {
						console.log('login reload', new Date())
						setTimeout(function() {
							funcCenter.login(cb)
						}, 5000)
					}
				})
			}
		})
	},
	getSign: function() {
		request('https://www.v2ex.com/mission/daily', function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log('sign', new Date())
				var $ = cheerio.load(body);
				var url = (($('.super.normal.button').attr('onclick') || '').match(/'([^']*)'/) || []).pop();
				if (!url) {
					console.log('sign reload', new Date())
					var now = new Date();
					if (now.getHours() >= 0) {
						setTimeout(function() {
							funcCenter.goToSign();
						}, 23 * 60 * 60 * 1000)
					} else {
						setTimeout(function() {
							funcCenter.goToSign();
						}, 1 * 60 * 60 * 1000)
					}
				} else {
					request('https://www.v2ex.com' + url, function(error, response, body) {
						if (!error && response.statusCode == 302) {
							console.log('sign in', new Date())
							setTimeout(function() {
								funcCenter.goToSign();
							}, 23 * 60 * 60 * 1000)
						}
					})
				}
			} else if (!error && response.statusCode == 302) {
				funcCenter.login(funcCenter.getSign)
			}
		})
	},
	goToSign: function() {
		funcCenter.getSign()
	}
}

funcCenter.goToSign();

console.log('Service has been started！');
// app.listen(3330);
