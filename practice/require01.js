const f1 = require('./arrow-func'); //匯入時也會執行匯入的內容 寫法一
const f2 = require(__dirname + '/arrow-func'); //較傳統的寫法 寫法二

console.log('2:', __dirname);
console.log(f1(9));
console.log(f2(10));