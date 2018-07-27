let Koa = require('koa');
let Router = require('koa-router');
let app = new Koa();
let router = new Router();
const uuidv1 = require('uuid/v1');

//一个卡号对应一段信息
let session ={};
let CART_NAME = 'zfpx'; //卡的名字

router.get('/towash',(ctx,next)=>{
    let cartId = ctx.cookies.get(CART_NAME);
    if(cartId){
        session[cartId].count-=1;
        ctx.body = `您的卡号是${cartId}，次数为${session[cartId].count}`
    }else { //办张卡
        let cartId = uuidv1();
        session[cartId] = {count:5};
        ctx.cookies.set(CART_NAME,cartId);
        ctx.body = `您的卡号是${cartId}次数是5`
    }
});



app.use(router.routes());
app.listen(4000);