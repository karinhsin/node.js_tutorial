require('dotenv').config(); //載入.env的設定

const http= require('http');

//不管從什麼路徑進來都是進到這邊
const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type': 'text/html'
        //text/plain純文字 但通常都是用html
    })
    res.end(`<p>PORT:${process.env.PORT}</p>`);
    //end:輸出內容到頁面上
});
console.log(`PORT: ${ process.env.PORT }`);
server.listen(process.env.PORT);