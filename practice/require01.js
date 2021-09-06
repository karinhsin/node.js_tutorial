const { f1, f3 } = require('./arrow-func'); //匯入時也會執行匯入的內容 通常都用這種 寫法一
const f2 = require(__dirname + '/arrow-func'); //較傳統的寫法 寫法二 
//f2接收整個物件 f2裡面有f1跟f3

console.log('2:', __dirname);
console.log(f1(9));
console.log(f3(10));

console.log(f2.f1(5));
console.log(f2.f3(5));
//匯入匯出 參照的概念