let EventEmitter = require('events');
let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
class Koa extends EventEmitter{
  constructor(){
    super();
    this.middlewares = [];
    this.context = context;
    this.request = request;
    this.response = response;
  }
  use(fn){
    this.middlewares.push(fn);
  }
  createContext(req,res){ 
    let ctx = Object.create(this.context); 
    let request = Object.create(this.request); 
    let response = Object.create(this.response);
    ctx.request = request; 
    ctx.response = response; 
    ctx.req = ctx.request.req =  req;
    ctx.res = ctx.response.res =  res;
    return ctx;
  }
  compose(middlewares,ctx){
    // express
    function dispatch(index) {
      if (index === middlewares.length) return Promise.resolve();
      let route = middlewares[index];
      // 把每个中间件都包装成promise
      return Promise.resolve(route(ctx, () => dispatch(index+1)));
    }
    return dispatch(0);
  }
  handleRequest(req,res){
    let ctx = this.createContext(req,res);
    res.statusCode = 404;
    // this.fn(context); 需要把中间件函数组合起来

    let fn = this.compose(this.middlewares,ctx);
    let Stream = require('stream');
    fn.then(data=>{
      if(typeof ctx.body == 'object'){
        res.setHeader('Content-Type', 'application/json;charset=utf8');
        res.end(JSON.stringify(ctx.body))
      } else if (ctx.body instanceof Stream){
        ctx.body.pipe(res);
      }
      else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
        res.setHeader('Content-Type', 'text/html;charset=utf8');
        res.end(ctx.body);
      } else {
        res.end('Not found')
      }
    }).catch(err=>{
      this.emit('error',err);//
      res.statusCode = 500;
      res.end(`server error`);
    })
  }
  listen(){
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(...arguments);
  }
}

module.exports = Koa;