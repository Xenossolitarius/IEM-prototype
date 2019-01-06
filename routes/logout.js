
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    req.sessval.user= undefined;
    req.sessval.id= undefined;

    res.render('login', {
        title: 'Prijava',
        id: 'register',
        item: 'Registracija'
    });
});

module.exports = router;