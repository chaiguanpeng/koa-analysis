let request = { // 封装求的方法
  get url(){
    return this.req.url
  },
  get path(){
    let {pathname:path} = require('url').parse(this.req.url);
    return path;
  },
  get query(){
    let { query } = require('url').parse(this.req.url,true);
    return query;
  }
  // .........
}

module.exports = request;