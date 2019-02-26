const log4js = require('log4js');
const log_conf = require('./config');
//加载配置文件
log4js.configure(log_conf);

const logUtil = {};

const errLogger = log4js.getLogger('errLog');
const reqLogger = log4js.getLogger('reqLog');
const resLogger = log4js.getLogger('resLog');
const consoleLogger = log4js.getLogger('info');
//封装错误日志
logUtil.errLogger = function (ctx, error, resTime) {
    if (ctx && error) {
        errLogger.error(formatError(ctx, error, resTime));
    }
};
//封装响应日志
logUtil.reqLogger = function (ctx, resTime) {
    if (ctx) {
        reqLogger.info(formatReq(ctx, resTime));
    }
};
//封装响应日志
logUtil.resLogger = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};
//封装console日志
logUtil.consoleLogger = function (info) {
    if (info) {
        consoleLogger.info( formatInfo(info));
    }
};
//输出格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String();

    //错误信息开始
    logText += "";

    //添加请求日志
    logText += formatReq(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*******************";

    return logText;
};
// 开发时console
var formatInfo = function (info) {
    var logText = new String();
    //响应日志开始
    logText += "";

    //响应内容
    logText += "detail: " + "\n" + JSON.stringify(info) + "\n";

    //响应日志结束
    logText += "*********info*******";

    return logText;
}

//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = new String();
    //响应日志开始
    logText += "";

    // //添加请求日志
    // logText += formatReq(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "****************";

    return logText;

}
//格式化请求日志
var formatReq = function (req, resTime) {

    var logText = new String();

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

module.exports = logUtil;
