
var fn_index = async (ctx, next) => {
    ctx.render('index.html');
};

var fn_signin = async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.render('success.html', {name: name});
    } else {
        ctx.render('fail.html');
    }
};

module.exports = {
    "GET /" : fn_index,
    "POST /signin" : fn_signin
}