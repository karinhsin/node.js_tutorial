const express = require('express');

const Cart = require('./../models/Cart');
const { getListData } = require("./address-book");

const router = express.Router();

router.use((req, res, next) => {
    // 判斷有沒有通過 jwt 驗證 (寫在 index.js 主程式)
    if (req.myAuth && req.myAuth.id) {
        next();
    } else {
        res.json({ success: false, error: '沒有 token 或者 token 不合法' });
    }
});

// 讀取購物車清單
router.get('/', async (req, res) => {
    res.json({ info: 'ok' });
});

// 新增項目
router.post('/', async (req, res) => {

});

// 修改項目
router.put('/:id', async (req, res) => {

});

// 刪除項目
router.delete('/:id', async (req, res) => {

});

// 清空購物車


module.exports = router;