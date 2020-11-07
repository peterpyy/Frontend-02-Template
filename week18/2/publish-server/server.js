let http = require("http");
let fs = require("fs");

http.createServer(function(request, response){
    console.log('request...');
    let outFile = fs.createWriteStream("../server/public/index.html");
    request.pipe(outFile);

}).listen(8082,'127.0.0.1',(err,stats)=>{
    console.log('listening...');
});