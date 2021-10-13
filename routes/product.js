const express = require('express');
//const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-images');
const Product = require('./../models/Product');

const router = express.Router();

// 列表
router.get('/', async (req, res) => {

});

// 讀取單筆 async後面都是路由處理器
//改寫 把資料處理的部分交給models那邊 這邊程式碼會看起來比較單純 較好管理
router.get('/:id', async (req, res) => {
    const output = {
        success: false,
        data: null,
    };
    output.data = await Product.readOne(req.params.id);
    if (output.data) {
        output.success = true;
    }
    res.json(output);
});

// 新增
router.post('/', async (req, res) => {

});

// 修改
router.put('/:id', async (req, res) => {

});

// 刪除
router.delete('/:id', async (req, res) => {

});


module.exports = router;