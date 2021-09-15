require('dotenv').config(); //載入.env的設定

// 1. 引入 express
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const cors = require('cors');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);//require進來是一個func 呼叫func後面再加session
const moment = require('moment-timezone');
const upload = multer({dest:'tmp_uploads/'})//destination
const uploadImg = require('./modules/upload-images');
const db = require('./modules/connect-mysql');
const sessionStore = new MysqlStore({}, db);

// 2. 建立 web server 物件
const app = express();

// 註冊樣版引擎
app.set('view engine','ejs');

//use:方法
//提升到Top-level middleware
//將body-parser設定成頂層middleware，放在所有路由之前，進到所有路由之前都會經過
//這邊不要設定太多 管理上會比較麻煩
app.use(session({  //secret一定要設定 其他可以不用但沒設定的話會一直跳warning
    name: 'mySessionId',
    saveUninitialized: false, //如果還沒用到session的時候要不要儲存
    resave: false, // 沒變更內容是否強制回存 可以把狀況記錄下來
    store: sessionStore,
    secret: '34908-948fkdgha;kldfha;olfisjl;;asdl', //當作key的加密字串
    cookie: {
        maxAge: 1200000, // 20分鐘，單位毫秒
    }
}));
//同樣都是用use也有優先順序的問題
const corsOptions = {
    credentials:true, 
    origin:(origin,cb) =>{
        console.log(`origin: + ${origin}`);
            cb(null, true);
            //需要使用cookies 和session時(使用白名單)
            //來拜訪的主機如果在白名單內就允許 沒有的話就不允許
    }
};
app.use(cors(corsOptions)); //要放在字形檔的前面
app.use(express.urlencoded({ extended: false })); //後面沒設{ extended: false }會出錯
app.use(express.json());
app.use(express.static('public')); //public相當於放在根目錄底下 前面'/'可省略
//上面三行是頂層的middleware 下面兩行不太算
//路徑符合/jquery跟/bootstrap才會進入到後面那邊
//如果沒引入進來 就要把jquery跟bootstrap放到public裡面
app.use('/jquery', express.static('node_modules/jquery/dist'));

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

//自己定義middleware
app.use((req, res, next) => {
    //指定頁面title
    res.locals.title = 'KK的網站';
    res.locals.pageName = '';

    //設定 template的helper function 可以在template裡面使用
    res.locals.dateToDateString = d => moment(d).format('YYYY-MM-DD');
    res.locals.dateToDateTimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');

    next();
});

// 3. 路由定義開始
//路由順序會影響，放前面的優先
//res.send  res.end   res.render res.json這幾個不能同時用 一次只能用一個
app.get('/', (req, res)=>{
    //第二個參數是要傳到樣版的內容
    res.locals.title = '首頁 - ' + res.locals.title;
    res.render('home', {name:'Karin'});
    //修改ejs樣板內容不需重新啟動伺服器
    //res.send(`<h2>Hello World!</h2>`);
});
app.get('/json-sales', (req, res)=>{
    res.locals.pageName = 'json-sales';
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

app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    //上傳圖檔一般會用async方式
    //如果是jpeg檔案就搬到我要的位置 後面加上他原本的檔名
    if (req.file && req.file.mimetype === 'image/jpeg') {
        try {
            await fs.rename(req.file.path, __dirname + '/public/img/' + req.file.originalname);
            return res.json({ success: true, filename: req.file.originalname });
        } catch (ex) {
            return res.json({ success: false, error: '無法存檔' });
        }
    } else {
        await fs.unlink(req.file.path); //如果上傳的檔案格式是錯的就刪掉暫存檔
        res.json({ success: false, error: '格式不對' });
    }
});//用postman測試檔案是否上傳成功 再到tmp_uploads看照片是否有進到資料夾 照片檔案後面改.jpg後就可以看
//路由的middleware
//可以用requests.rest看有沒有成功

app.post('/try-upload2', uploadImg.single('avatar'), async (req, res) => {
    res.json(req.file);
});
//單一檔案上傳
//欄位名稱需為avatar
app.post('/try-upload3', uploadImg.array('photo', 10), async (req, res) => {
    res.json(req.files);
});
//多個圖檔上傳
//欄位名稱需為photo

app.get('/my-paramsl/:action/:id(\\d+)?',(req, res)=>{
    res.json(req.params);
});
//路徑要給參數 ex.http://localhost:3001/my-paramsl/edit/12
app.get('/my-params1/:action?/:id(\\d+)?', (req, res) => {
    res.json(req.params);
});
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.split('?')[0];
    u = u.slice(3);
    u = u.split('-').join('');

    res.json({
        url: req.url,
        mobile: u
    });
});
//業務員促銷廣告頁面 可透過手機號碼找到他的頁面
///^\/m\/09\d{2}-?\d{3}$/

app.use(require('./routes/admin2'));
app.use('/',require('./routes/login'));
app.use('/admin3', require('./routes/admin3'));
app.use('/address-book', require('./routes/address-book'));

app.get('/try-sess',(req, res)=>{
    req.session.myVar = req.session.myVar || 0;
    req.session.myVar++;
    res.json(req.session);
});

//moment.js
app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';

    res.json({
        m1: moment().format(fm),
        m2: moment().tz('Europe/Berlin').format(fm),
        m3: moment().tz('Asia/Tokyo').format(fm),
    });
});

app.get('/try-db', async (req, res) => {
    const [r] = await db.query("SELECT * FROM address_book WHERE `name` LIKE ?", ['%洋%']);
    res.json(r);
});

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