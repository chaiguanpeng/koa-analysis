const Koa = require('koa');
const app = new Koa();
const path = require('path');
const fs = require('fs');
const convert = require('koa-convert');
const bodyParse = require('koa-bodyparser');
const queryString = require('querystring');
const uuid = require('uuid');

/*
*
*
*
* */


// const betterParser = require('koa-better-body');
// app.use(convert(betterParser({
//     uploadDir:path.join(__dirname,"uploads")
// })))
app.use(async (ctx,next)=>{
    if(ctx.url==="/user" && ctx.method ==='GET'){
        ctx.set("Content-Type","text/html;charset=utf8");
        ctx.body = (
            `
            <form method="post" enctype="multipart/form-data">
                <input type="text" name="username">
                <input type="file" name="avatar">
                <input type="submit">
            </form>
            `
        )
    }else {
        await next();
    }
});


Buffer.prototype.split = function (sep) {
    let arr = [];
    let offset = 0;
    let len = Buffer.from(sep).length;
    let start = 0;
    while (-1!==(offset = this.indexOf(sep,start)) ){
        arr.push(this.slice(start,offset).toString());
        start = offset+len;
    }
    if(this.slice(start).toString()!==""){
        arr.push(this.slice(start).toString())
    }
    return arr;
}
/*
* 解析的请求体格式
*    ------WebKitFormBoundaryVQNn5v92CoD31Qr6
    Content-Disposition: form-data; name="username"

    3333
    ------WebKitFormBoundaryVQNn5v92CoD31Qr6
    Content-Disposition: form-data; name="avatar"; filename=""
    Content-Type: application/octet-stream


    ------WebKitFormBoundaryVQNn5v92CoD31Qr6--
*
* */
app.use(async (ctx,next)=>{
    if(ctx.url==="/user" && ctx.method ==='POST'){
        let contentType = ctx.headers["content-type"]; //multipart/form-data; boundary=----WebKitFormBoundaryVQNn5v92CoD31Qr6
        if(contentType.includes('multipart/form-data')){
            let matches = contentType.match(/\bboundary=(.+)/);
            let seq = "--" + matches[1]; //------WebKitFormBoundaryVQNn5v92CoD31Qr6
            ctx.body = await getBody(ctx.req,seq);
        }
    }else {
        await next();
    }
});
app.listen('8000');

function getBody(req, seq) {
    return new Promise((resolve,reject)=>{
        let buffer = [];
        req.on('data',function (data) {
            buffer.push(data)
        });
        req.on('end',function () {
           let all = Buffer.concat(buffer);
           let fileds ={};
           let line = all.split(seq);
           line = line.slice(1,-1);  /*[ '\r\nContent-Disposition: form-data; name="username"\r\n\r\n123\r\n',
                                            '\r\nContent-Disposition: form-data; name="avatar"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n'
                                        ]*/
           line.forEach(function (line) {
               let [desc,val]= line.split('\r\n\r\n');
               desc = desc.toString();
               val = val.slice(0,-2);
               if(desc.includes('filename')){ //如果包含filename就认为它是一个文件
                    // 如果是文件的话就写到文件里
                   let [,line1,line2] = desc.split('\r\n');
                   let lineObj1 = queryString.parse(line1,'; ');
                   let lineObj2 = queryString.parse(line2,'; ');
                   let filepath = path.join(__dirname,'uploads',uuid.v4());
                   fs.writeFileSync(filepath,val);
                   fileds[lineObj1.name] = [
                       {...lineObj1,...lineObj2,filepath}
                   ]
               }else { //普通字段
                    let name = desc.match(/name="(\w+)"/)[1];
                   fileds[name] = val.toString()
                }
           })
            // console.log(fileds);
            resolve( fileds);
        })
    })
}
