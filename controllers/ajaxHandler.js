// 数据库用户操作
//import {Login, Regist} from '../dataBase/users'
var Login = require('../dataBase/users').Login;
var Regist = require('../dataBase/users').Regist;
//---------------------------文章相关
var Add_article = require('../dataBase/articles').Add_article;
//注册接口
var fn_signup = async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    let status = await Regist(ctx)
    console.log(status);
    ctx.response.body = status;
    if (status.res_code===1) {
        ctx.render('success.html', {name: name});
    } else {
        ctx.render('fail.html');
    }
};
//登录接口
var fn_signin = async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    var status = await Login(ctx)
    console.log(status);
    ctx.response.body = status;
    if (status.res_code===1) {
        ctx.render('success.html', {name: name});
    } else {
        ctx.render('fail.html');
    }
};
//文章相关接口-----------------------------------------
// 新增
var fn_article_add = async (ctx, next) => {
    var status = await Add_article(ctx)
    console.log(status);
    ctx.response.body = status;
}
// 删除
var fn_article_del = async (ctx, next) => {
    let id = ctx.params.id;
}
// 更新
var fn_article_update = async (ctx, next) => {
    let id = ctx.params.id;
}
// 获取详情
var fn_article_get = async (ctx, next) => {
    let id = ctx.params.id;
}
// 获取列表
var fn_article_list = async (ctx, next) => {
    let tag = ctx.params.tag;
}
module.exports = {
    "POST /signin" : fn_signin,
    "POST /signup" : fn_signup,
    "POST /article/add" : fn_article_add,
    "POST /article/del/:id" : fn_article_del,
    "POST /article/update/:id" : fn_article_update,
    "GET /article/get/:id" : fn_article_get,
    "GET /article/list/:tag" : fn_article_list,
}