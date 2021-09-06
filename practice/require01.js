const f1 = require('./arrow-func'); //匯入時也會執行匯入的內容
const f2 = require('./arrow-func');

console.log('2:', __dirname);
console.log(f1(9));
console.log(f2(10));