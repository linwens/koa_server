const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

/**
 * 
 * @param {String} url 静态资源访问地址 static
 * @param {String} dir 对应文件的本地地址
 */
function staticFiles(url, dir){
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        if(rpath.startsWith(url)){ //判断访问的url有么有指定开头
            let fp = path.join(dir, rpath.substring(url.length)); //拼接文件本地路径
            if(await fs.exists(fp)){
                ctx.response.type = mime.getType(rpath); //获取文件的type
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        }else{
            await next(); //不是指定的访问静态资源的路径，走进下一个中间件
        }
    }
}

module.exports = staticFiles;