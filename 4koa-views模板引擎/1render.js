const Koa = require('koa');
const app = new Koa();
let Router = require("koa-router");
let router = new Router();
let f = require('fs');
let path = require('path');
let views = require("koa-views");
app.use(views(__dirname, {
    map: {
        html: 'ejs'
    }
}));
app.use(router.routes());

router.get('/',async (ctx,next)=>{
   await ctx.render('ejs.html',{name:'zfpx'}); //不写return 这个函数执行完就结束了 模板还没有被渲染,ctx.body = ""
})

app.listen(3000);