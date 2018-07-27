let Koa = require('koa');
let Router = require('koa-router');
let app = new Koa();
let router = new Router();
let session = require('koa-session');
app.keys = ['zfpx'];
app.use(session({
    key:'world'
}, app));
router.get('/towash',(ctx,next)=>{
   if(ctx.session.user){
        ctx.session.user.count--;
        ctx.body = `当前办卡了 次数 ${ctx.session.user.count}`
   }else {
       ctx.session.user = {count:5};
       ctx.body =`当前办卡了 次数为${ctx.session.user.count}`;
   }
});

app.use(router.routes());
app.listen(4000);