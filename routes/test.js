var express = require('express');
var router = express.Router();
var db = require('../lib/DB');
var pool=db.pool;
/* GET users listing. */
router.get('/', function(req, res, next) {
   //session prohibit
    var sql = [
        "SELECT username FROM korisnik WHERE korisnik.username =?",
    ].join('');
    var inserts = [req.sessval.user];
    pool.query(sql,inserts, function (error, results, fields) {
        if (error) throw error;

        console.log(results);
        if( results.length  > 0){

            //sending errors
            res.render('test');


        }else {
            res.locals.message='Access denied';
            res.render('error');


        }


    });




});

module.exports = router;