const http = require('http');

http.createServer((request, response) =>{
    let body=[];
    console.log('body1：',body,typeof body);
    var url = request.url;
    console.log('收到请求了，请求路径是：' + url)
    console.log('请求我的客户端的地址是：', request.socket.remoteAddress, request.socket.remotePort)
    request.on('error', (err) => {
        console.log(err);
    }).on('data', (chunk) => {
        body.push(chunk.toString());
    }).on('end', () =>{
        try{
            console.log(`body：${body},length=${body.length}`);
            body = body = body.join('');
        }catch(e){
            console.log('end e：',e);            
        }
        //console.log('body2：',body);
        response.writeHead(200,{'Content-Type':'text/html'});
        /*if (url === '/') {
            response.end('<h1>h1</h1>Hello World.<br />index page')
        } else if (url === '/login') {
            response.end('<h1>h1</h1>Hello World.<br />login page')
        } else if (url === '/register') {
            response.end('<h1>h1</h1>Hello World.<br />register page')
        } else {
            response.end('<h1>h1</h1>Hello World.<br />404 Not Found.')
        }*/
        response.end(
`<html maaa=a >
<head>
    <style>
#container{
    width:500px;
    height:300px;
    display:flex;
    background-color:rgb(255,255,255);
}
#container #myid{
    width:200px;
    height:100px;
    background-color:rgb(255,0,0);
}
#container .cl{
    flex:1;
    background-color:rgb(0,255,0);
}
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"/>
        <div class="c1" />
    </div>
</body>
</html>`);
    });
})
.listen(8088, function () {
    console.log('服务器启动成功了，可以通过 http://127.0.0.1:8088/ 来进行访问')
});
