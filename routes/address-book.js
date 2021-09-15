const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-images');

const router = express.Router();

async function getListData(req, res) {
    const perPage = 5;
    let page = parseInt(req.query.page) || 1;
    let keyword = req.query.keyword || '';  //搜尋功能 如果沒有值就給空字串
    keyword = keyword.trim();//字串的方法 去掉頭尾的空白
    
    //res.locals.keyword = keyword; // 傳給 template  
    const output = {

    };
    
    let where = " WHERE 1 "; //放sql的條件
    if (keyword) {//如果有值的話
        output.keyword = keyword;
        where += ` AND \`name\` LIKE ${db.escape('%' + keyword + '%')} `;//把字串兜起來放進去
    }

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    const [[{ totalRows }]] = await db.query(t_sql);
    output.totalRows = totalRows;
    output.totalPages = Math.ceil(totalRows/perPage); //算出總頁數
    output.perPage = perPage;
    output.rows = [];
    output.page = page;

    //如果有資料才去取得分頁的資料
    if(totalRows > 0){
        if(page < 1){
            output.redirect = '?page=1';
            return output;
        }
        if (page > output.totalPages){
            output.redirect = '?page=' + output.totalPages;
            return output;
            
        }
        const sql = `SELECT * FROM \`address_book\` ${where} ORDER BY sid DESC LIMIT ${(page - 1) * perPage}, ${perPage}`;
        const [rows] = await db.query(sql)
        output.rows = rows;
    }
    return output;
}

router.get('/', (req, res) => {
    res.render('address-book/main');
});

router.get('/list', async (req, res) => {
    res.locals.pageName = 'ab-list';


    const output = await getListData(req, res);
    if (output.redirect) {
        return res.redirect(output.redirect)
    }
    res.render('address-book/list', output);
});

router.get('/api/list', async (req, res) => {
    const output = await getListData(req, res);
    res.json(output);
});

//0-9數字 ]後面的＋代表一個以上
router.delete('/delete/:sid([0-9]+)', async (req, res) => {
    const sql = "DELETE FROM address_book WHERE sid=?";

    const [r] = await db.query(sql, [req.params.sid]);
    console.log({ r });
    res.json(r);
});

router.route('/add')
    .get(async (req, res) => {
        res.locals.pageName = 'ab-add'; //表示選到新增資料的表單頁面
        res.render('address-book/add');
    })
    .post(async (req, res) => {
        // TODO: 欄位檢查
        const output = {
            success: false,
        }

        // const sql = "INSERT INTO `address_book`(" +
        //     "`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

        //寫法一 傳統做法 跟php幾乎一樣 要注意下面的順序 順序是這邊決定的  跟前台表單欄位的順序沒有關係
        // const [result] = await db.query(sql, [
        //     req.body.name,
        //     req.body.email,
        //     req.body.mobile,
        //     req.body.birthday,
        //     req.body.address,
        // ]);

        //寫法二 不管順序 比較容易看 但出錯機率可能會比較高 
        const input = {...req.body,created_at: new Date()}; 
        const sql = "INSERT INTO `address_book` SET ?";
        let result = {};
        //處理新增資料時可能的錯誤
        try{
            [result]= await db.query(sql,[input]);
        }catch(ex){
            output.error = ex.toString();
        }
        output.result = result;
        if (result.affectedRows && result.insertId) { 
            output.success = true;
        }

        console.log({ result });
        /*
        {
          result: ResultSetHeader {
            fieldCount: 0,
            affectedRows: 1,
            insertId: 148,
            info: '',
            serverStatus: 2,
            warningStatus: 0
          }
        }
         */

        res.json(output);
    });

router.route('/edit/:sid')
    .get(async (req, res) => { //呈現要修改資料的表單 如果沒有資料就呈現列表頁
        const sql = "SELECT * FROM address_book WHERE sid=?";
        const [rs] = await db.query(sql, [req.params.sid]);

        if (rs.length) {
            res.render('address-book/edit', { row: rs[0] });
        } else {
            res.redirect('/address-book/list');
        }
    })
    .post(async (req, res) => {
        // TODO: 欄位檢查
        const output = {
            success: false,
            postData: req.body,
        }

        const input = { ...req.body };
        const sql = "UPDATE `address_book` SET ? WHERE sid=?";
        let result = {};
        // 處理修改資料時可能的錯誤
        try {
            [result] = await db.query(sql, [input, req.params.sid]);
        } catch (ex) {
            output.error = ex.toString();
        }
        output.result = result;
        if (result.affectedRows === 1) {
            if (result.changedRows === 1) {
                output.success = true;
            } else {
                output.error = '資料沒有變更';
            }
        }

        res.json(output);
    });
    
module.exports = router;
