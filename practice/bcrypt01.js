const bcrypt = require('bcryptjs');

(async()=>{

    const salt = await bcrypt.genSalt(8) //一般是設8-10次 越多次會越慢 不要超過31 支援只到31
    console.log(`salt: ${salt}`);

    const hash1 = await bcrypt.hash('karin',salt);
    console.log(`hash1: ${hash1}`);

    const hash2 = await bcrypt.hash('karin', 10);
    console.log(`hash2: ${hash2}`);

    const hash3 = await bcrypt.hash('karin', salt);
    console.log(`hash3: ${hash3}`);

    console.log(await bcrypt.compare('karin', hash2));
    console.log(await bcrypt.compare('karin', hash2));
})();