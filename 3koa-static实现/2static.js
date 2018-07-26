let Koa = require('koa');
let app = new Koa();
let Router = require("koa-router");
let router = new Router();
let mime = require('mime');
// let static = require('koa-static');
let fs = require('fs');
let path = require('path');
let util = require('util');
let stat = util.promisify(fs.stat);
app.use(router.routes())
app.use(router.allowedMethods());
router.get('/wqe',async (ctx,next)=>{
    ctx.body = 'hello word'
});

function static(p) {
    return async (ctx,next)=>{
        let execFile = path.join(p,ctx.path); //是一个绝对路径
        let statObj = await stat(execFile);
        try{
            if(statObj.isDirectory()){
                let file = path.join(execFile,'index.html');
                ctx.set("Content-Type",'text/html');
                ctx.body =  fs.createReadStream(file);
            }else {
                ctx.set('Content-Type',mime.getType(execFile));
                ctx.body =  fs.createReadStream(execFile);
            }
        }catch (e) {
            await next()
        }
    }
}



app.use(static(path.join(__dirname,'public')));




app.listen(3000);