const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('address-book/main');
});
module.exports = router;