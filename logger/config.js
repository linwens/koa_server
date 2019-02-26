const path = require('path');
const isProduction = process.env.NODE_ENV === 'production'; //当前环境的开关
//错误日志输出目录
const errLogPath = path.resolve(__dirname, "../logs/error");
//请求日志输出路径
const reqLogPath = path.resolve(__dirname, "../logs/request");
//响应日志输出路径
const resLogPath = path.resolve(__dirname, "../logs/response");
/**
 * errLog： 错误日志
 * resLog:  响应日志
 * reqLog： 请求日志
 * info：   本地开发打印所有信息
 */
module.exports = {
    // 日志类型配置
    "appenders":{
        "errLog":{
            "category": "errLog",            //logger名称
            "type": "dateFile",              //日志类型
            "filename": "error",             //日志输出文件名
            "alwaysInludePattern": true,     //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log", //后缀，每小时创建一个新的日志文件
            "path": "errLogPath",             //保存地址
            "encoding":"utf-8",
            "maxLogSize": 1000,
            "numBackups": 3,
        },
        "reqLog":{
            "category": "reqLog",
            "type": "dateFile",
            "filename": "request",
            "alwaysInludePattern": true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path": "reqLogPath",
            "encoding":"utf-8",
            "maxLogSize": 1000,
            "numBackups": 3,
        },
        "resLog":{
            "category": "resLog",
            "type": "dateFile",
            "filename": "response",
            "alwaysInludePattern": true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path": "resLogPath",
            "encoding":"utf-8",
            "maxLogSize": 1000,
            "numBackups": 3,
        },
        "info":{
            "type":"console"
        }
    },
    "levels":{
        "errLog":"ERROR",
        "reqLog":"INFO",
        "resLog":"INFO",
        "info": 'ALL'
    }
}