const net = require("net");
const parser = require("./parser.js");

class Request{
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"] === "application/json"){
            this.bodyText = JSON.stringify(this.body);
        }else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded"){
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }else{
            this.bodyText = '';
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }
    send(connection){
        return new Promise((resolve, reject) => {
            console.log('待发送：'+this.toString());
            const parser = new ResponseParser();
            if(connection){
                connection.write(this.toString());
            }else{
                connection = net.createConnection(
                    {
                        host: this.host,
                        port: this.port
                    },() => {
                        connection.write(this.toString());
                    }
                );
            }
            connection.on('data',(data) => {
                console.log('收到：'+data.toString());
                parser.receive(data.toString());
                if(parser.isFinished){
                    resolve(parser.response);
                    console.log('解析到的内容：'+parser.response.body);
                    connection.end();
                }
            });
            connection.on('error',(err) => {
                console.log('发生错误：'+err);
                reject(err);
                connection.end();
            });

            //resolve("");
        });
    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }
}

class ResponseParser{
    constructor(){
        this.WAITTING_STATUS_LINE = 0;
        this.WAITTING_STATUS_LINE_END= 1;
        this.WAITTING_HEADER_NAME = 2;
        this.WAITTING_HEADER_SAPCE = 3;
        this.WAITTING_HEADER_VALUE = 4;
        this.WAITTING_HEADER_LINE_END = 5;
        this.WAITTING_HEADER_BLOCK_END = 6;
        this.WAITTING_BODY = 7;

        this.current = this.WAITTING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+ ([\s\S]+))/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive(string){
        for(let i=0;i<string.length;i++){
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char){
        if(this.current === this.WAITTING_STATUS_LINE){
            if(char === '\r'){
                this.current = this.WAITTING_STATUS_LINE_END;
            }else{
                this.statusLine += char;
            }
        }else if(this.current === this.WAITTING_STATUS_LINE_END){
            if(char === '\n'){
                this.current = this.WAITTING_HEADER_NAME;
            }
        }else if(this.current === this.WAITTING_HEADER_NAME){
            if(char === ':'){
                this.current = this.WAITTING_HEADER_SAPCE;
            }else if (char === '\r'){
                this.current = this.WAITTING_HEADER_BLOCK_END;
                if(this.headers["Transfer-Encoding"] === 'chunked'){
                    this.bodyParser = new TrunkedBodyParser();
                }
            }else{
                this.headerName += char;
            }
        }else if(this.current === this.WAITTING_HEADER_SAPCE){
            if(char === ' '){
                this.current = this.WAITTING_HEADER_VALUE;
            }
        }else if(this.current === this.WAITTING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WAITTING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            }else{
                this.headerValue += char;
            }
        }else if(this.current === this.WAITTING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WAITTING_HEADER_NAME;
            }
        }else if(this.current === this.WAITTING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WAITTING_BODY;
            }
        }else if(this.current === this.WAITTING_BODY){
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser{
    constructor(){
        this.WAITTING_LENGTH = 0;
        this.WAITTING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITTING_NEW_LINE = 3;
        this.WAITTING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITTING_LENGTH;
    }
    receiveChar(char){
        if(this.current === this.WAITTING_LENGTH){
            if(char === '\r'){
                if(this.length === 0){
                    this.isFinished = true;
                }
                this.current = this.WAITTING_LENGTH_LINE_END;
            }else{
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        }else if(this.current === this.WAITTING_LENGTH_LINE_END){
            if(char === '\n'){
                this.current = this.READING_TRUNK;
            }
        }else if(this.current === this.READING_TRUNK){
            this.content.push(char);
            this.length--;
            if(this.length === 0){
                this.current = this.WAITTING_NEW_LINE;
            }
        }else if(this.current === this.WAITTING_NEW_LINE){
            if(char === '\r'){
                this.current = this.WAITTING_NEW_LINE_END;
            }
        }else if(this.current === this.WAITTING_NEW_LINE_END){
            if(char === '\n'){
                this.current = this.WAITTING_LENGTH;
            }
        }
    }

}

void async function (){
    let request = new Request({
        method: "POST",
        host: "192.168.1.123",
        port: "8088",
        path: "/",
        headers:{
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "peterpc",
            workage: "24y"
        }
    });
    let response = await request.send();
    let dom = parser.parseHTML(response.body);
}();