const f1 = a=>a*a;
const f3 = a=>a*a*a;  //f3沒有被放在module 其他檔案無法使用f3

//console.log(f1(7));
//console.log( '1:',__dirname);

//module.exports = f1; //匯出 沒有放在這邊的常數變數都不會被匯出
module.exports = {f1,f3}; //ES6語法 一般都是匯出obj 比較少匯出array 