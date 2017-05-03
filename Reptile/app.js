var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
// var httpProxy = require('http-proxy');
var path = require('path');
var bodyParser = require('body-parser');
var headerBase = [{
        type: '*',
        value: ''
    }, {
        type: '/js/*',
        value: 'application/json;charset=utf-8'
    }, {
        type: '/css/*',
        value: 'text/css;charset=utf-8'
    }]
    //设置跨域限制
headerBase.forEach(function(v, i) {
    app.all(v.type, function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.2');
        if (v.value) {
            res.header("Content-Type", v.value);
        }
        next();
    });
})
var base = 'http://www.baidu.com';
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function(req, res) {
     
    res.send('Service has been started！');
})

var Router = express.Router();
var urlPath = express.Router();
 

// 接口路由
Router.get('/api/getData', function(req, res) {
    request('http://hr.tuputech.com/recruit/v2/tree?seed=5806e9c686b5987977928f7f', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var ss = [];
            getMsg(data.tree)
            function getMsg(cl) {
                console.log('type',cl.level)
                ss[cl.level] = ss[cl.level] || {};
                request({
                    url:'http://hr.tuputech.com/recruit/tree/' + cl.type, 
                    method: 'POST'
                }, function(rq, re, b) {
                    if (cl.level == 0) {
                        ss[cl.level].result = b;
                    } else {
                        ss[cl.level].child.push({
                            result: b
                        })
                    }
                    // console.log(ss[0])
                    // res.send(dd)
                });
                if (cl.child) {
                    ss[cl.level].child = ss[cl.level].child || [];
                    // console.log(cl.child.length)
                    cl.child.forEach(function(v, i) {
                        (function(v, i) {
                            setTimeout(function() {
                                getMsg(v)
                            }, 2000)
                        })(v, i)
                    })
                }
            }
            console.log(ss)
        }
    })
})
// path路由
urlPath.get('/*', function(req, res) {
    console.log(req.originalUrl)
    var url = base + req.originalUrl;
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    })
})
app.use('/js', Router);
app.use('/', urlPath);
console.log('Service has been started！');
module.exports = app;