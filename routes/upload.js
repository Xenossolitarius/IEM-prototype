var express = require('express');
var router = express.Router();
var formidable= require('formidable');
var db = require('../lib/DB');
var pool=db.pool;
var fs = require('fs');
var iconvlite = require('iconv-lite');

router.post('/', function(req, res) {

    var form = new formidable.IncomingForm();
    //console.log(form);
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = oldpath;
       // console.log(oldpath);
        /*
        var newpath = 'C:/Users/User2/WebstormProjects/EM-Project/uploads/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;

        });*/
        fs.exists(oldpath, function(exists){
            if(exists){ // results true
               fs.readFile(oldpath,function(err,data){
                   if(err) {
                       return console.log(err);
                   }
                 var  content=data;
                 var BANKA;
                 var IBAN;
                 var racun, partner,adresa,grad,iznos,opis,datum;
                 var id_rac;
                 var UI;
                 var temp;
                 var SQLHEAD = 'INSERT INTO transakcije'+
                     '(banka,racun,partner,adresa,grad,iznos,opis,datum,id_racun)' +
                     'VALUES';
                   //console.log(content);
                   var encoded  = iconvlite.decode(content, 'cp1250');

                   var array =encoded.split('\n');
                   //console.log(array);
                  BANKA = array[0].substr(7,50).trim();
                  IBAN = array[1].substr(18,21);

                  pool.query("SELECT id_br_rac FROM br_rac WHERE br_rac.IBAN ='"+IBAN+"';", function (error, results, fields) {
                      if (error) throw error;
                     if(results.length > 0) {
                         id_rac = results[0].id_br_rac;

                         wrapper();
                     }else{
                         res.end('wrong');
                     }
                  });
    var wrapper = function() {

        for (var i = 0; i < array.length; i++) {
            if (array[i].charAt(999) == '5') {
                temp = array[i].substr(0, 2);
                if (temp.localeCompare('10') == 0) {
                    UI = -1;

                } else if (temp.localeCompare('20') == 0) {
                    UI = 1;

                }
                racun = array[i].substr(2, 34).trim();
                partner = array[i].substr(36, 70).trim();
                adresa = array[i].substr(106, 35).trim();
                grad = array[i].substr(141, 35).trim();
                datum = array[i].substr(184, 8);
                opis = array[i].substr(298, 140).trim();
                iznos = parseInt(array[i].substr(227, 15));
                iznos = iznos / 100;
                iznos = iznos * UI;

                SQLHEAD += "('" + BANKA + "','" + racun + "','" + partner + "','" + adresa + "','" + grad +
                    "'," + iznos + ",'" + opis + "','" + datum + "',"+id_rac+ '),';


            }
        }
        var fixedSQL = SQLHEAD.substring(0, SQLHEAD.length - 1);
        fixedSQL += ';';
          pool.query(fixedSQL, function (error, results, fields) {
              if (error) throw error;
          });

        fs.unlink(newpath,function(err){
            if(err) return console.log(err);
            //console.log('file deleted successfully');
        });


        /*
         fs.writeFile('C:/Users/User2/Desktop/Nered/test.txt', fixedSQL, function (err) {
             if (err) {
                 return console.log(err);
             }

             console.log("The file was saved!");
         });*/
    }
               // console.log(encoded);
               });

                }

        });
        res.redirect('/testtable');
        //res.write('success!');
        res.end();
    });





});

module.exports = router;