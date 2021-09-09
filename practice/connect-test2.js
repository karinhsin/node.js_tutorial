
const db = require('./../modules/connect-mysql');


db.query("SELECT * FROM address_book LIMIT 3,2")
    .then(([r]) => {
        console.log(r);
        process.exit();
    })
    .catch(ex => {
        console.log(ex);
    })

