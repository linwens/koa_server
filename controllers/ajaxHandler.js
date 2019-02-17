// 数据库用户操作
//import {Login, Regist} from '../dataBase/users'
var Login = require('../dataBase/users').Login;
var Regist = require('../dataBase/users').Regist;
//注册接口
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

module.exports = {
    "POST /signin" : fn_signin
}