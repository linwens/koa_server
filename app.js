const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); //解析post请求
const app = new Koa();
const jwt = require('jsonwebtoken');
const secret = 'xx-audit';
const authRules = {
    '/login': false, // false表示当前页面不需要登陆
}
const controller = require('./controller');//路由控制
const templating = require('./view'); //模板引擎
const isProduction = process.env.NODE_ENV === 'production'; //当前环境的开关
const log = require('./logger');//引入日志中间件
//静态资源
if(!isProduction){ // 生产环境的静态资源由nginx处理
  let staticFiles = require('./static-files');
  app.use(staticFiles('/static/', __dirname + '/static'));
}

//如果需要权限就返回提示请登录
app.use(async (ctx, next) => {
  let req = ctx.req;
  let url = req.url;
  if(authRules[url]){ //需要登陆
    let token = req.headers.authorization || req.headers['auth-token'];
    if(!token){
      ctx.body = {
        name: 'auth error',
        code: 401,
        message: '没有token',
      }
    }else{
      try{
        await jwt.verify(token, secret);
      }catch(err){
        ctx.body = {
          name: 'auth error',
          code: 401,
          message: '没有token',
        }
      }
      await next();
    }
  }else{
    await next();
  }
})
function needLogin(router, item){
  
  
}
//错误处理及日志记录
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try{
    await next();
    ms = new Date() - start;
    if(isProduction){
      log.info(`${ctx.method} ${ctx.url} - ${rt}`);
    }
  }catch(err){
    ms = new Date() - start;
    if(isProduction){
      //记录异常日志
      log.error(`code= ${err.statusCode || err.status || 500}, message= ${err.message}`);
    }else{
      console.log('-------------------------------')
      console.log(err);
    }
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      name: err.name,
      code: err.code || err.statusCode || err.status || 500,
      message: err.msg,
    }
  }
});
//koa-bodyparser必须在router之前被注册到app对象上
app.use(bodyParser());
//给app.context绑定render方法
templating('views',{
  noCache: !isProduction,
  watch: !isProduction
}, app)
//add router middleware
app.use(controller());

app.listen(3000);
console.log("server starting")