// let Koa = require('koa');
// let app = new Koa();

function app() {

}
app.routes = [];
app.use = function (fn) {
    app.routes.push(fn)
};

app.use((ctx,next)=>{
    console.log(1);
    next();
    console.log(2);
});
app.use((ctx,next)=>{
    console.log(3);
    next();
    console.log(4);
});


let index= 0;
function next() {
    if(app.routes.length ===index) return;
    let route =  app.routes[index++];
    route({},next);
}
next();
