const bcrypt = require('bcrypt');
const saltRounds = 10;

function hacher_pwd(pwd){
    let salt = bcrypt.genSaltSync(saltRounds);
    let pwd_hache = bcrypt.hashSync(pwd, salt);
    return pwd_hache;
}

function comparer_pwd(pwd, pwd_hache_db) {
    let result = bcrypt.compareSync(pwd, pwd_hache_db);
    return result;
}

module.exports = { hacher_pwd, comparer_pwd };
