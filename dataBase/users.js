//import {User} from './mongoose'
var User = require('./mongoose').User;
//登录
var Login = async (ctx) => {
    console.log(ctx.request.body)
    var req = ctx.request;
    var users = new User({
        username: decodeURI(req.body.name),
        password: decodeURI(req.body.password)
    });
    console.log(users)
    if(users.username==='guests'){
        return {
            res_code:1,
            res_msg:'登录成功',
            data:{
                type:'guests'
            }
        }
    }else{
        var rslt = await User.find({username:users.username}).exec();
        console.log(rslt)
        if(rslt&&rslt!=''){
            if(rslt[0].password == users.password){//验证密码
                //设置cookie
                //res.cookie('uid', rslt[0]._id, {maxAge:60*1000, httpOnly: false, secure: false, signed: true});
                //设置session,存入用户名及登录密码
                // req.session.users = users;
                // console.log(req.session);
                return {
                    res_code:1,
                    res_msg:'登录成功',
                    rslt:{
                        uid:rslt[0]._id
                    }
                }
            }else{
                return {
                    res_code:2,
                    res_msg:'密码错误'
                }
            }
        }else{
            return {
                res_code:-1,
                res_msg:'用户不存在'
            }
        }
    }
}
//注册
var Regist = async (ctx) => {
    var req = ctx.request;
    var users = new User({
        username: req.body.name,
        password: req.body.password
    });
    var rslt = await User.find({username:users.username}).exec();
    if(rslt&&rslt!=''&&rslt!='[]'){
        return {
            res_code:'0',
            res_msg:'用户已经存在'
        }
    }else{
        var newUser = await users.save();//注意save是model的方法，所以是users.save而不是User.save
        console.log(newUser)
        return {
            res_code:'1',
            res_msg:'注册成功',
            data:{
                uid:newUser._id
            }
        }
    }
}
exports.Login = Login;
//注册
exports.Regist = Regist;