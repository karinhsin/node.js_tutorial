const http= require('http');

//不管從什麼路徑進來都是進到這邊
const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type': 'text/html'
        //text/plain純文字 但通常都是用html
    })
    res.end(`<h1>Hola,${req.url}</h1>`);
    //end:輸出內容到頁面上
});
//apache會依照路徑去找有沒有對應到的檔案

server.listen(3000); //apache用80 //node習慣用3000