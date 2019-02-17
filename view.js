const nunjucks = require('nunjucks');

function createEnv(path, opts){
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            }
        );
    if(opts.filters){ // 自定义过滤器？
        for( var f in opts.filters){
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

function templating(path, opts, app){
    var env = createEnv(path, opts);
    
    app.context.render = function(view, model){
        //this指向app.context
        this.response.body = env.render(view, Object.assign({}, this.state||{}, model||{}));
        this.response.type = 'text/html';
    }
}

module.exports = templating;