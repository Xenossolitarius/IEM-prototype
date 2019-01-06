var mysql =  require('mysql');
var pool =  mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    port     : '4000',
    user     : 'root',
    password : 'root',
    database : 'iemdb'

});
console.log('DB dignut');

module.exports.pool = pool;