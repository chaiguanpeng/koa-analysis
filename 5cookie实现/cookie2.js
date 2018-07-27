let Koa = require('koa');
let Router = require('koa-router');
let app = new Koa();
let router = new Router();
app.use(async (ctx,next)=>{
    ctx.cookies.get = function (key) {
       let r =ctx.get('Cookie') || '';
       let cookieObj = require('querystring').parse(r,'; ');
       return cookieObj[key];
    };
    let allCookies = [];
    ctx.cookies.set = function (key, value, options) {
        let arr = []; // [name='zfpx',domain='zf1.cn']
        let line = `${key}=${encodeURIComponent(value)}`;
        arr.push(line);
        if(options.domain){
            arr.push(`Domain=${options.domain}`);
        }
        if(options.maxAge){
            arr.push(`Max-Age=${options.maxAge}`)
        }
        if(options.httpOnly){
            arr.push(`httpOnly=true`)
        }
        if(options.path){
            arr.push(`Path=${options.path}`)
        }
        line = arr.join('; ');
        allCookies.push(line);
        ctx.set('Set-Cookie',allCookies);
    };
    await next();
});




router.get('/read',(ctx,next)=>{
   let name = ctx.cookies.get('name') || '没有name';
   let age = ctx.cookies.get('age') || '没有age';
   ctx.body = `${name}-${age}`
});
router.get('/write',(ctx,next)=>{
   ctx.cookies.set('name','zfpx',{maxAge:10*1000});
   ctx.cookies.set('age','9',{path:"/"});
   ctx.body = 'write ok';
});







app.use(router.routes());
app.listen(4000)