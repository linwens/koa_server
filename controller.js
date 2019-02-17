// http://nodejs.cn/api/fs.html
var fs = require('fs');

//处理每个路由
function addMapping(router, mapping){
    for (var url in mapping){
        if (url.startsWith('GET')) { // url类似 "GET xxx"  对空格敏感，有缺陷
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST')){ // url类似 "POST xxx"
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}

// 处理controllers下的js文件
function addControllers(router){
    var files = fs.readdirSync(__dirname + '/controllers');

    //过滤出js文件
    var js_files = files.filter((f)=>{
        return f.endsWith('.js');
    })
    //处理js文件
    for (var f of js_files){
        console.log(`process controllers: ${f}...`)
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping)
    }
}

module.exports = function (dir){
    let controllers_dir = dir || 'controllers', //扫描目录默认'controllers'
        router = require('koa-router')();

    addControllers(router, controllers_dir);
    return router.routes();
}
