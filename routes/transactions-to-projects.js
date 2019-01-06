var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('transactions-to-projects', {
        title: 'Uredi projekte i transakcije',
        id: 'user-profile',
        item: 'Profil'
    });
});

module.exports = router;
