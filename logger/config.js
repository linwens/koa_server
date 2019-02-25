const path = require('path');
const isProduction = process.env.NODE_ENV === 'production'; //当前环境的开关
//错误日志输出目录
const errLogPath = path.resolve(__dirname, "../logs/error");
//响应日志输出路径
const resLogPath = path.resolve(__dirname, "../logs/response");

module.exports = {
    // 日志格式设置
    "appenders": [
        // 错误日志
        {
            "category": "errLog",           //logger名称
            "type": "dateFile",             //日志类型
            "filename": errLogPath,         //日志输出位置
            "alwaysInludePattern": true,    //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log" //后缀，每小时创建一个新的日志文件
        },
        // 响应日志
        {
            "category": "resLog",
            "type": "dateFile",
            "filename": resLogPath,
            "alwaysInludePattern": true,
            "pattern": "-yyyy-MM-dd-hh.log"
        }
    ],
    "levels":{
        "errLog":"ERROR",
        "resLog":"ALL",
    }
}