require('dotenv').config(); //載入.env的設定

// 1. 引入 express
const express = require('express');

// 2. 建立 web server 物件
const app = express();

// 3. 路由定義開始
app.get('/', (req, res)=>{
    res.send(`<h2>Hello World!</h2>`);
});
//這個路由只能透過get的方法 後面是路徑 路由定義結束

app.use((req, res) => {
    res.status(404).send(`<h1>找不到頁面</h1>`)
})

//較保險的設定 如果沒有的話就跑3000
let port = process.env.PORT || 3000;  

app.listen(port, ()=>{
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`啟動：${port}`,new Date());
});