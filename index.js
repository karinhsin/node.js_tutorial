require('dotenv').config(); //載入.env的設定

// 1. 引入 express
const express = require('express');
const multer = require('multer');
const upload = multer({dest:'tmp_uploads/'})//destination

// 2. 建立 web server 物件
const app = express();

// 註冊樣版引擎
app.set('view engine','ejs');

//use:方法
//提升到Top-level middleware
//將body-parser設定成頂層middleware，放在所有路由之前，進到所有路由之前都會經過
//這邊不要設定太多 管理上會比較麻煩
app.use(express.urlencoded({ extended: false })); //後面沒設{ extended: false }會出錯
app.use(express.json());
app.use(express.static('public')); //public相當於放在根目錄底下 前面'/'可省略
//上面三行是頂層的middleware 下面兩行不太算
//路徑符合/jquery跟/bootstrap才會進入到後面那邊
//如果沒引入進來 就要把jquery跟bootstrap放到public裡面
app.use('/jquery', express.static('node_modules/jquery/dist'));

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

// 3. 路由定義開始
//路由順序會影響，放前面的優先
//res.send  res.end   res.render res.json這幾個不能同時用 一次只能用一個
app.get('/', (req, res)=>{
    //第二個參數是要傳到樣版的內容
    res.render('home', {name:'Karin'});
    //修改ejs樣板內容不需重新啟動伺服器
    //res.send(`<h2>Hello World!</h2>`);
});
app.get('/json-sales', (req, res)=>{
    const sales = require('./data/sales');
    res.render('json-sales', { sales });
    //require可以動態載入 但如果之前有匯入過同樣的檔案 就不會再去重新載入檔案
    //console.log(sales);
    //res.json(sales);
});

//取得queryString資料 
//可以透過 req.query.名稱 取得，例如:req.query.a
app.get('/try-qs', (req, res) => {
    res.json(req.query);
});
app.post('/try-post', (req, res) => {
    res.json(req.body);
});
//表單資料一般都需要兩個路由
app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});

app.get('/pending', (req, res) => {
});

app.post('/try-upload',upload.single('avatar'), (req, res) => {
    res.json(req.file);
});//用postman測試檔案是否上傳成功 再到tmp_uploads看照片是否有進到資料夾 照片檔案後面改.jpg後就可以看

//路由的middleware
//可以用requests.rest看有沒有成功
//路由定義結束

app.use((req, res) => {
    res.status(404).send(`<h1>找不到頁面</h1>`)
})

//較保險的設定 如果沒有的話就跑3000
let port = process.env.PORT || 3000;  
const node_env = process.env.NODE_ENV || 'development';
app.listen(port, ()=>{
    console.log(`NODE_ENV: ${node_env}`);
    console.log(`啟動：${port}`,new Date());
});