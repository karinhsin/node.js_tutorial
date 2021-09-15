
const jwt = require('jsonwebtoken');

//key如果換了 token就要重來 否則無法解密之前加密的內容
const secretKey = 'abc';

(async () => {

    // 加密
    const token = await jwt.sign({ name: 'david' }, secretKey);

    console.log(token);

    const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGF2aWQiLCJpYXQiOjE2MzE2ODYwNjN9.1S8SsBae9Nb8kLZaz4aBsFcLAzC1v4Hn-eDhyPXlGrg';

    // 解密
    const decoded = await jwt.verify(token1, secretKey);

    console.log(decoded);

})()