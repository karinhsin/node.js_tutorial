const express = require('express');
const db = require('./../modules/connect-mysql');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('address-book/main');
});

router.get('/list', async (req, res) => {
    const perPage = 5;
    let page = parseInt(req.query.page) || 1;
    const output = {

    };

    const t_sql = "SELECT COUNT(1) totalRows FROM address_book ";
    const [[{ totalRows }]] = await db.query(t_sql);
    output.totalRows = totalRows;

    res.json(output);
    // res.render('address-book/list');
});

module.exports = router;