let proto = {}
// 代理的作用
function defineGetter(property,name) {
  proto.__defineGetter__(name,function () {
    return this[property][name];
  })
}
function defineSetter(property,name) {
  // ctx.body = xxx
  // ctx.response.body = xxx
  proto.__defineSetter__(name,function (val) {
    this[property][name] = val;
  })
}
// ctx.query = ctx.request.query
defineGetter('request','query');
defineGetter('response','body');
defineSetter('response','body');
module.exports = proto;