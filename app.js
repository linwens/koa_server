const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); //解析post请求
const app = new Koa();
const controller = require('./controller');//路由控制
const templating = require('./view'); //模板引擎
const isProduction = process.env.NODE_ENV === 'production'; //当前环境的开关
//静态资源
if(!isProduction){ // 生产环境的静态资源由nginx处理
  let staticFiles = require('./static-files');
  app.use(staticFiles('/static/', __dirname + '/static'));
}

//logger
app.use(async (ctx, next) => { //这是一个中间件单元
  await next(); // 这里把控制权交给下一个中间件，等那个中间件执行完了，再回来执行后面的代码
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

//x-reponse-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
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