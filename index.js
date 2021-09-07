require('dotenv').config(); //載入.env的設定

// 1. 引入 express
const express = require('express');

// 2. 建立 web server 物件
const app = express();

// 註冊樣版引擎
app.set('view engine','ejs');

//這邊不要設定太多 管理上會比較麻煩
app.use(express.static('public')); //public相當於放在根目錄底下 前面'/'可省略
//如果沒引入進來 就要把jquery跟bootstrap放到public裡面
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

// 3. 路由定義開始
//res.send  res.end   res.render 這三個不能同時用 一次只能用一個
app.get('/', (req, res)=>{
    //第二個參數是要傳到樣版的內容
    res.render('home', {name:'Karin'});
    //修改ejs樣板內容不需重新啟動伺服器
    //res.send(`<h2>Hello World!</h2>`);
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