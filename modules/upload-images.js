const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../public/img')
        //放在public所有的用戶都看得到 沒有權限問題
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + extMap[file.mimetype]);
        //主檔名uuidv4  副檔名
    },
});

const fileFilter = (req, file, cb) => {
    cb(null, !!extMap[file.mimetype]);
};//如果不是這三種類型的檔案 副檔名會對應到undefine＝false

module.exports = multer({ storage, fileFilter });