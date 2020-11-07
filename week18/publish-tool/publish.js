let http = require("http");
let fs = require("fs");
let archiver = require("archiver");
let child_process = require("child_process");
let querystring = require("querystring");

//1.打开 https://github.com/login/oauth/authorize，client_id=Iv1.c8aeaa4d00376695，client_secret=0d55162dda673fa6909ba10177fd0d02823d2fbf

child_process.exec('open https://github.com/login/oauth/authorize?client_id=Iv1.c8aeaa4d00376695&client_secret=0d55162dda673fa6909ba10177fd0d02823d2fbf');


//3.创建server，接受token，然后点击发布
http.createServer(function(request, response){
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
    publish(query.token);
}).listen(8083,'127.0.0.1',(err,stats)=>{
    console.log('listening...');
});

function publish(token){
    let request = http.request({
        hostname: "127.0.0.1",
        port: 8082,
        method: "POST",
        path: "/publish?token=" + token,
        headers: {
            "Content-Type": "application/octet-stream"
        }
    }, response => {
        console.log(response);
    });

    //let file = fs.createReadStream("./sample.html");

    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    
    archive.directory("sample/",false);
    archive.finalize();
    //archive.pipe(fs.createWriteStream("tmp.zip"));
    archive.pipe(request);
}
