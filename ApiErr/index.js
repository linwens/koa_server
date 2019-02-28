const ApiErrConf = require('./config');

class ApiErr extends Error {
  constructor(err_name) {
    super();
    
    let err_info = ApiErrConf.getErrInfo(err_name);
    this.name = err_name;
    this.code = err_info.code;
    this.msg = err_info.msg;
  }
}
module.exports = ApiErr;