
var ApiErrConf = {};
//设置错误名称,没有这个标识符，后面set的时候会出错
//各中间件部分错误捕获，对应部分的逻辑代码，try-catch时用以下err_name
ApiErrConf.UNKNOW_ERR = "unknowErr";
ApiErrConf.CONTROLLER_ERR = "controllerErr";
ApiErrConf.DATA_USER_ERR = "dataUserErr";
ApiErrConf.DATA_ARTICLE_ERR = "dataArticleErr";
ApiErrConf.DATA_IMG_ERR = "dataImgErr";
ApiErrConf.VIEW_ERR = "viewErr";
ApiErrConf.STATIC_ERR = "staticErr";

//设置错误名称对应的错误信息
const err_map = new Map();
err_map.set(ApiErrConf.UNKNOW_ERR,{code:-1, msg:'未知错误'});
err_map.set(ApiErrConf.CONTROLLER_ERR,{code:101, msg:'路由处理出错'});
err_map.set(ApiErrConf.DATA_USER_ERR,{code:102, msg:'用户数据处理出错'});
err_map.set(ApiErrConf.DATA_ARTICLE_ERR,{code:103, msg:'文章数据处理出错'});
err_map.set(ApiErrConf.DATA_IMG_ERR,{code:104, msg:'图片数据处理出错'});
err_map.set(ApiErrConf.VIEW_ERR,{code:105, msg:'视图处理出错'});
err_map.set(ApiErrConf.STATIC_ERR,{code:106, msg:'静态资源处理出错'});

//根据错误名称获取错误信息
ApiErrConf.getErrInfo = (err_name) => {
  let err_info;
  if(err_name){
    err_info = err_map.get(ApiErrConf[err_name])
  }else{ //未传错误名，默认"未知错误"
    err_info = err_map.get(ApiErrConf['UNKNOW_ERR'])
  }
  return err_info;
}

module.exports = ApiErrConf;