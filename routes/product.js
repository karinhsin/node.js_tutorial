const express = require('express');
const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-images');

const router = express.Router();

// 列表
router.get('/', async (req, res) => {

});

// 讀取單筆
router.get('/:id', async (req, res) => {
    const output = {
        success: false,
        // status: '',
        // statusCode: 0,
        data: null,
    };
    const sql = "SELECT * FROM products WHERE sid=?";
    const [rs] = await db.query(sql, [req.params.id]);
    if (rs && rs.length === 1) {
        output.success = true;
        output.data = rs[0];
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