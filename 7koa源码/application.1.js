let EventEmitter = require('events');
let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
class Koa extends EventEmitter{
  constructor(){
    super();
    this.fn;
    this.context = context;
    this.request = request;
    this.response = response;
  }
  use(fn){
    this.fn = fn;
  }
  createContext(req,res){ // 创建上下文
    // 不会修改原有的context 还可以新增一些属性w
    let ctx = Object.create(this.context); 
    let request = Object.create(this.request); 
    let response = Object.create(this.response);
    ctx.request = request; // 这个是自己封装的
    ctx.response = response; 
    // 原生的
    ctx.req = ctx.request.req =  req;
    ctx.res = ctx.response.res =  res;
    return ctx;
  }
  handleRequest(req,res){
    // 创建一个上下文
    let context = this.createContext(req,res);
    res.statusCode = 404;
    this.fn(context);
    if (typeof context.body === 'string'){
      res.setHeader('Content-Type', 'text/html;charset=utf8');
      res.end(context.body);
    }else{
      res.end('Not found')
    }
  }
  listen(){
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(...arguments);
  }
}

module.exports = Koa;