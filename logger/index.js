const log4js = require('log4js');
const log_conf = require('./config');
//加载配置文件
log4js.configure(log_conf);

module.exports = log4js.getLogger('main');
