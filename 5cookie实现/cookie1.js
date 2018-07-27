let http = require('http');
let server = http.createServer((req,res)=>{
    if(req.url==="/write"){
        res.setHeader('Set-cookie',['name=zfpx; path=/;','age=9']);
        res.end('write ok');
    }else if(req.url==='/read'){
      let cookie = req.headers.cookie;
        console.log(cookie);
        res.end(cookie);
    }
});
server.listen(3000);