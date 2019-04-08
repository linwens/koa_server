const path = require('path');
const isProduction = process.env.NODE_ENV === 'production'; //当前环境的开关
//日志输出目录
const logPath = path.resolve(__dirname, "logs");
/**
 * errLog： 错误日志
 * resLog:  响应日志
 * reqLog： 请求日志
 * info：   本地开发打印所有信息
 */
module.exports = {
    // 日志类型配置
    appenders:{
        main:{
            "type": "dateFile",               //日志类型
            "layout": {                       // 输出日志的展示格式
                "type": "pattern",
                "pattern": "[%d{yyyy-MM-dd-hh:mm:ss}]-[%p] %c-%m%n"
            },
            "filename": logPath + "/main",             //日志输出文件名
            "alwaysInludePattern": true,     //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log", //后缀，每小时创建一个新的日志文件
            "path": "logPath",             //保存地址
            "encoding":"utf-8",
            "maxLogSize": 1000,
            "numBackups": 3,
        }
    },
    //暴露给外部调用
    categories: {
        "default": {"appenders": ["main"], "level": "all"},
    },
}