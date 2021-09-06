const fs = require('fs');

//要寫入的資料
const data = {
    name:'David',
    age:28
};

fs.writeFile(
    'data.json', //檔名 如果要跟這支相同位置
    JSON.stringify(data,null,4), //資料（字串.json字串）
    error=>{  //callback function
    if(error) {  //沒發生錯誤會是空值
        console.log('無法寫入檔案：',error); 
        process.exit(); //結束程式
    }
    console.log('寫入成功');
});
//用終端機去跑 會產生一個data.json資料夾在外面那層 用終端機啟動時是mfee19-node的相對位置