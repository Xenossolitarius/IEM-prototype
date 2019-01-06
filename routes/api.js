var express = require('express');
var router = express.Router();
var db = require('../lib/DB');
var pool=db.pool;


/* GET users listing. */
router.post('/PUSHPROJECT',function(req,res) {

    //console.log(req.body);
    //console.log(req.sessval.id);
    var IBANSlock=req.body.IBANS.length;
    var IBANSLIMIT=IBANSlock;
    var IBANSlock3;
    var IBANSlock4;


    //console.log('IBANSLIMIT ' + IBANSLIMIT);
    var IBANS=[];

     //ovo triba popravit na klijentu
    for(var j=0;j<IBANSLIMIT;j++){
        if(req.body.IBANS[j].value != 'X' && req.body.IBANS[j].value != undefined) {

            IBANS.push(req.body.IBANS[j].value);
        }
    }
   // console.log('IBANS');
    //console.log(IBANS);
   // console.log(IBANS.length);



    var IBANStypeIN= [];
    var IBANStypeOUT= [];
    var projid;
    var i;
    var sql1 = [
        "INSERT INTO projekt SET ime=?,datumpoc=?,datumkraj=?,iznos=?,id_korisnik=?",
    ].join('');
    var inserts1 = [req.body.name, req.body.start, req.body.end, req.body.budget, req.sessval.id];
    pool.query(sql1, inserts1, function (error, results, fields) {
        if (error) throw error;
        projid = results.insertId;
       // console.log('Projid'+ projid);
        insertKAT();
        if(IBANS.length==0){
            finishEverything();
        }else {
            for (var i = 0; i < IBANSLIMIT; i = i + 1) {
                checkINOUT(i);
            }//end of for
        }
    });

    var checkINOUT=function(k){

        var sql2 = [
            "SELECT * FROM br_rac WHERE IBAN=? AND id_korisnik=?",
        ].join('');
        var inserts2 = [req.body.IBANS[k].value, req.sessval.id];
        pool.query(sql2, inserts2, function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                var IBANSobject ={IBANS: IBANS[k], insertId: results[0].id_br_rac};
                IBANStypeIN.push(IBANSobject);
                IBANSlock -=1;
                //console.log(req.body.IBANS[i].value + 'postoji');
                if(IBANSlock===0){
                    finishrequest();
                }

            } else {
                var IBANSobjectno ={IBANS: IBANS[k], insertId: ''};
                IBANStypeOUT.push(IBANSobjectno);
                IBANSlock -=1;
                //console.log(req.body.IBANS[i].value + 'ne postoji');
                if(IBANSlock===0){
                    finishrequest();
                }
            }
        });
    };

    var finishrequest = function(){
        //console.log('GOTOVO');
        //console.log(IBANStypeIN);
       // console.log(IBANStypeOUT);
        var IBANSYESREPEAT=IBANStypeIN.length;
        if(IBANSYESREPEAT==0){
            finishYES();
        }else {
            insertINracproj(IBANSYESREPEAT);

        }
    };

    var insertINracproj=function(k){

        var SQLHEAD = 'INSERT INTO rac_proj' +
            ' (id_br_rac,id_projekt)' +
            'VALUES';
        for(var i=0;i<k;i++){
            SQLHEAD += '(' + IBANStypeIN[i].insertId + ',' + projid + ')';
            if(i != (k-1)){
                SQLHEAD += ',';
            }else{
                SQLHEAD += ';';
            }
        }

        pool.query(SQLHEAD, function (error, results, fields) {
            if (error) throw error;

                finishYES();



        });

    };

    var finishYES= function(){
       // console.log('YES DONE');
        var IBANSINSERTREPEAT=IBANStypeOUT.length;
        if(IBANSINSERTREPEAT==0){
            finishEverything();
        }else {
            IBANSlock3 = IBANSINSERTREPEAT;
            for (var l = 0; l < IBANSINSERTREPEAT; l++) {
                insertNEWIBANS(l, IBANSlock3);
            }
        }
    };

    var insertNEWIBANS=function(k,timeout){
        var sql4 = [
            "INSERT INTO br_rac SET IBAN=?,id_korisnik=?",
        ].join('');
        var inserts4 = [IBANStypeOUT[k].IBANS, req.sessval.id];
        pool.query(sql4, inserts4, function (error, results, fields) {
            if (error) throw error;
            IBANStypeOUT[k].insertId = results.insertId;
            timeout -= 1;
            //console.log(req.body.IBANS[i].value + 'postoji');
            if (timeout === 0) {
                finishNO();
            }


        });


    };

    var finishNO = function (){
        //console.log('INSERT DONE');
        //console.log(IBANStypeOUT);
        var IBANSINSERTREPEAT=IBANStypeOUT.length;


            insertRACNO(IBANSINSERTREPEAT);
    };


    var insertRACNO=function(k){

        var SQLHEAD = 'INSERT INTO rac_proj' +
            ' (id_br_rac,id_projekt)' +
            'VALUES';
        for(var i=0;i<k;i++){
            SQLHEAD += '(' + IBANStypeOUT[i].insertId + ',' + projid + ')';
            if(i != (k-1)){
                SQLHEAD += ',';
            }else{
                SQLHEAD += ';';
            }
        }

        pool.query(SQLHEAD, function (error, results, fields) {
            if (error) throw error;

            //console.log(req.body.IBANS[i].value + 'postoji');

                finishEverything();



        });


    };
    var finishEverything = function(){
       // console.log('Over!');

        res.send('success');
    };

    var insertKAT=function(){

        var SQLHEAD = 'INSERT INTO kategorija' +
            ' (naziv,id_projekt)' +
            'VALUES'+
            "('Ljudski resursi',"+ projid + '),' +
            "('Putovanja',"+ projid + '),' +
            "('Oprema i roba',"+ projid + '),' +
            "('Ostali troškovi i usluge',"+ projid + '),' +
            "('Troškovi obavljanja osnovne djelatnosti',"+ projid + '),' +
            "('Budžetni prihodi'," + projid + '),' +
            "('Nepovezani budžet',"+ projid + ');' ;

        pool.query(SQLHEAD, function (error, results, fields) {
            if (error) throw error;

        });

    };


});





router.post('/GETIBANS',function(req,res){


    var sql = [
        "SELECT * FROM br_rac WHERE br_rac.id_korisnik=?",
    ].join('');
    var inserts = [req.sessval.id];
    pool.query(sql, inserts, function (error, results, fields) {
        if (error) throw error;

        //console.log(results);
        if (results.length > 0) {

            //sending errors

            res.send(results);

        } else {

            res.send('failure');

        }


    });





});



router.post('/IBAN',function(req,res){
   // console.log(req.sessval.user);



       var sql = [
           "SELECT * FROM br_rac WHERE br_rac.id_korisnik=? AND br_rac.IBAN=?",
       ].join('');
       var inserts = [req.sessval.id, req.body.IBAN];
       pool.query(sql, inserts, function (error, results, fields) {
           if (error) throw error;

           // console.log(results);
           if (results.length > 0) {

               //sending errors

               res.send('success');

           } else {

               res.send('failure');

           }


       });






});






router.post('/login', function(req, res) {
 //ka fol provjerio bazu


    var sql = [
        "SELECT username,email,password,id_korisnik FROM korisnik WHERE (korisnik.username =? OR korisnik.email=?) AND password=?",
    ].join('');
    var inserts = [req.body.username,req.body.username,req.body.password];
    pool.query(sql,inserts, function (error, results, fields) {
        if (error) throw error;

        //console.log(results);
        if( results.length  > 0){

            //sending errors
            req.sessval.user= req.body.username;
            req.sessval.id= results[0].id_korisnik;
                res.send('cool');


        }else {
            res.send('Rejected');


        }


    });




});

router.post('/register',function(req,res){

    //searching for avaliable username

  var sql = [
      "SELECT username,email FROM korisnik WHERE korisnik.username =? OR korisnik.email=?",
  ].join('');
  var inserts = [req.body.userName,req.body.userEmail];
 pool.query(sql,inserts, function (error, results, fields) {
      if (error) throw error;

      if( results.length  > 0){

          //sending errors
          if(results[0].username==req.body.userName){
                res.send('errorusername')

          }else{
                res.send('erroremail');

          }

      }else{
        //registering
          var sql = [
              "INSERT INTO korisnik SET",
              " ime=?",
              ",prezime=?",
              ",email=?",
              ",password=?",
              ",username=?",
              ",firma=?",
              ",transemail=?",
          ].join('');
          var inserts = [req.body.firstName, req.body.lastName, req.body.userEmail, req.body.password, req.body.userName, req.body.companyName, req.body.transactionEmail];
          pool.query(sql, inserts, function (error, results, fields) {
              if (error) throw error;

          });


          res.send('success');

          res.end();


      }
  });




});

router.post('/getprojects',function(req,res){
    var sql = [
        'SELECT * FROM projekt,kategorija WHERE projekt.id_projekt = kategorija.id_projekt AND projekt.id_korisnik=? ;'
    ].join('');
    var inserts = [req.sessval.id];
    pool.query(sql,inserts,function (error, results, fields) {
        if (error) throw error;
        //console.log(results);
        var currentprojid=-1;
        var projektnum=-1;
        var projekti =[
            {about: {},
                kategorija: []

            }

        ];

        if(results.length > 0) {


            for (var i = 0; i < results.length; i++) {
                if (currentprojid != results[i].id_projekt) {
                    projektnum++;
                    currentprojid = results[i].id_projekt;
                    var j = i;
                    var kategnum = 0;
                    projekti[projektnum].about = {
                        "id_projekt": results[i].id_projekt,
                        "ime": results[i].ime,
                        "datumpoc": results[i].datumpoc,
                        "datumkraj": results[i].datumkraj,
                        "iznos": results[i].iznos,
                        "datumizmj": results[i].datumizmj,
                        "datumpos": results[i].datumpos,
                        "id_korisnik": results[i].id_korisnik,
                        "aktivan": results[i].aktivan

                    };
                    while (currentprojid == results[j].id_projekt) {
                        projekti[projektnum].kategorija[kategnum] = {
                            "id_kategorija": results[j].id_kategorija,
                            "naziv": results[j].naziv,
                            "budzet": results[j].budzet,
                            "troskovi": results[j].troskovi,
                            "tezina_kat": results[j].tezina_kat,
                            "vrsta": results[j].vrsta,
                            "id_kat": results[j].id_kat
                        };
                        j++;
                        kategnum++;
                        if (j == results.length) {
                            break;
                        }
                    }
                    if (j != results.length) {
                        projekti.push({
                            about: {},
                            kategorija: []

                        });
                    }

                } else {

                }

            }
            res.send(projekti);
            res.end();
        }else{
            res.send('empty');

        }


    });




});





router.post('/gettrans',function(req,res) {
    var sql = [
        'SELECT DISTINCT id_tran,banka,racun,partner,adresa,grad,transakcije.iznos,opis,datum,transakcije.datumpos,id_racun,rac_proj.id_projekt ' +
        'FROM transakcije,br_rac,rac_proj ' +
        'WHERE ' +
        'transakcije.id_racun=br_rac.id_br_rac AND ' +
        'br_rac.id_br_rac=rac_proj.id_br_rac AND ' +
        ' transakcije.pridjeljeno=0 AND ' +
        ' br_rac.id_korisnik = ?;'
    ].join('');

    var inserts = [req.sessval.id];
    pool.query(sql,inserts,function (error, results, fields) {
        if (error) throw error;
        var currenttranid=-1;
        var trannum=-1;
        var transakcije =[
            {about: {},
                projekt: []

            }

        ];

        if(results.length > 0) {


            for (var i = 0; i < results.length; i++) {
                if (currenttranid != results[i].id_tran) {
                    trannum++;
                    currenttranid = results[i].id_tran;
                    var j = i;
                    var kategnum = 0;
                    transakcije[trannum].about = {
                        "id_tran": results[i].id_tran,
                        "banka": results[i].banka,
                        "racun": results[i].racun,
                        "partner": results[i].partner,
                        "adresa": results[i].adresa,
                        "iznos": results[i].iznos,
                        "opis": results[i].opis,
                        "datum": results[i].datum,
                        "datumpos": results[i].datumpos,
                        "id_racun": results[i].id_racun


                    };
                    while (currenttranid == results[j].id_tran) {
                        transakcije[trannum].projekt[kategnum] = {
                            "id_projekt": results[j].id_projekt

                        };
                        j++;
                        kategnum++;
                        if (j == results.length) {
                            break;
                        }
                    }
                    if (j != results.length) {
                        transakcije.push({
                            about: {},
                            projekt: []

                        });
                    }

                } else {

                }

            }
            res.send(transakcije);
            res.end();
        }else{
            res.send('Prazno');

        }



    });



});

router.post('/updatecategory',function(req,res){
    var NEWSQLHEAD;
    var SQLHEAD = 'INSERT INTO kategorija (id_kategorija,naziv,budzet,tezina_kat,id_kat,id_projekt) VALUES';

    if(req.body.length <=0){


        res.end();
    }else {

        for (var i = 0; i < req.body.length; i++) {
            var convert = String(req.body[i].id);
            var conclude = convert.indexOf('X');
            if (convert == 'KX') {
                console.log('KX');
                SQLHEAD += "(" + 'DEFAULT' + ",'" + req.body[i].naziv + "'," + req.body[i].budzet + ",DEFAULT,DEFAULT," + req.body[i].id_projekt + "),";
            } else if (conclude != -1) {
                var id = parseInt(req.body[i].id.slice(0, -1));
                SQLHEAD += "(" + 'DEFAULT' + ",'" + req.body[i].naziv + "'," + req.body[i].budzet + ",1," + id + "," + req.body[i].id_projekt + "),";
            } else {
                SQLHEAD += "(" + req.body[i].id + ",'" + req.body[i].naziv + "'," + req.body[i].budzet + ",DEFAULT,DEFAULT," + req.body[i].id_projekt + "),";
            }
        }
        NEWSQLHEAD = SQLHEAD.slice(0, -1);
        NEWSQLHEAD += "ON DUPLICATE KEY UPDATE id_kategorija=VALUES(id_kategorija)," +
            "naziv=VALUES(naziv)," +
            "budzet=VALUES(budzet);";




        pool.query(NEWSQLHEAD, function (error, results, fields) {
            if (error) throw error;



        });
    }

    res.end();



});

router.post('/deletetrans',function(req,res){
    var SQLHEAD = "DELETE FROM transakcije WHERE id_tran = "+req.body.ID+";";
    pool.query(SQLHEAD, function (error, results, fields) {
        if (error) throw error;



    });

    res.end();
});

router.post('/transkat',function(req,res){
    //console.log(req.body);
    var preslika = JSON.parse(JSON.stringify(req.body));
    var KATTROSK = [];
    var NEWSQLHEAD;
    var NEWSQLHEAD2;
    var NEWSQLHEAD3;
    var count = 3;
    var SQLHEAD = 'INSERT INTO transakcije(id_tran,banka,racun,partner,iznos,opis,id_racun,pridjeljeno) VALUES';
    for(var i =0 ; i <req.body.length ; i++){
        SQLHEAD += '(' + req.body[i].id_tran + ",'X','X','X',"+req.body[i].noviznos+",'X',1,"+req.body[i].pridjeljeno+'),' ;

    }
    NEWSQLHEAD = SQLHEAD.slice(0, -1);
    NEWSQLHEAD += "ON DUPLICATE KEY UPDATE id_tran=VALUES(id_tran)," +
        "iznos=VALUES(iznos)," +
        "pridjeljeno=VALUES(pridjeljeno);";

    var SQLHEAD2 = 'INSERT INTO kat_tran (id_kat,id_tran,iznos) VALUES';
    for(var i = 0; i <req.body.length; i++){
        SQLHEAD2 += '('+req.body[i].id_kat+','+req.body[i].id_tran+','+req.body[i].iznos+'),';
    }
    NEWSQLHEAD2 = SQLHEAD2.slice(0, -1);
    NEWSQLHEAD2 += ';';
   // console.log('///////////////////////////////////////////////////////////////////////////////////////');

   for(var i = 0; i< preslika.length; i++){
       if(preslika[i]!=null) {
           var newobj = {
               id_kat: "",
               troskovi: 0
           };
           newobj.id_kat = preslika[i].id_kat;
           newobj.troskovi += req.body[i].iznos;
           for (var j = i + 1; j < preslika.length; j++) {
               if (preslika[j] != null) {
                   if (newobj.id_kat == preslika[j].id_kat) {
                       newobj.troskovi += preslika[j].iznos;
                       preslika[j] = null;


                   }
               }

           }
           //console.log(newobj);
           KATTROSK.push(newobj);
       }

    }
    console.log(KATTROSK);
    var SQLHEAD3 = 'INSERT INTO kategorija (id_kategorija,naziv,troskovi,id_projekt) VALUES';
    for(var i =0 ; i <KATTROSK.length ; i++){
        SQLHEAD3 += '(' + KATTROSK[i].id_kat +",'X',"+KATTROSK[i].troskovi+',1),' ;
    }
    NEWSQLHEAD3 = SQLHEAD3.slice(0, -1);
    NEWSQLHEAD3 += "ON DUPLICATE KEY UPDATE id_kategorija=VALUES(id_kategorija)," +
        "troskovi=VALUES(troskovi)+ kategorija.troskovi;" ;

   // console.log(NEWSQLHEAD);
    //console.log(NEWSQLHEAD2);
   // console.log(NEWSQLHEAD3);
    pool.query(NEWSQLHEAD, function (error, results, fields) {
        if (error) throw error;
       count--;
        if(count == 0){
            end();
        }

    });
    pool.query(NEWSQLHEAD2, function (error, results, fields) {
        if (error) throw error;
        count--;
        if(count == 0){
            end();
        }


    });
    pool.query(NEWSQLHEAD3, function (error, results, fields) {
        if (error) throw error;
        count--;
        if(count == 0){
            end();
        }


    });



var end = function (){
    res.end();
};

});

router.post('/gettemplate',function(req,res){

    var SQLHEAD = ['SELECT kat_tran.id_kat,kategorija.naziv, kategorija.budzet, kategorija.troskovi, kat_tran.id_tran,kat_tran.iznos,transakcije.datum,transakcije.partner,transakcije.opis,kat_tran.id_kat_tran,projekt.ime ',
        'FROM transakcije, kat_tran,kategorija, projekt ',
        'WHERE ',
        'transakcije.id_tran = kat_tran.id_tran AND ',
        'kat_tran.id_kat = kategorija.id_kategorija AND ',
        'kategorija.id_projekt = projekt.id_projekt AND ',
        'kategorija.id_projekt=?;'].join('');
     var inserts =[req.body.id];

     pool.query(SQLHEAD,inserts, function (error, results, fields) {
        if (error) throw error;
        if(results.length > 0){
            res.send(results);
            res.end();

        }else{
            res.send('empty');
            res.end();
        }


    });




});

router.post('/deletekattrans',function(req,res){
 var count = 3;
    //console.log(req.body);


    var SQLHEAD = 'INSERT INTO transakcije(id_tran,banka,racun,partner,iznos,opis,id_racun,pridjeljeno) VALUES';

        SQLHEAD += '(' + req.body.id_tran + ",'X','X','X',"+req.body.iznos+",'X',1,0)" ;

    SQLHEAD += "ON DUPLICATE KEY UPDATE id_tran=VALUES(id_tran)," +
        "iznos=VALUES(iznos)+transakcije.iznos," +
        "pridjeljeno=VALUES(pridjeljeno);";

    var SQLHEAD2 = 'INSERT INTO kategorija (id_kategorija,naziv,troskovi,id_projekt) VALUES';
        SQLHEAD2 += '('+ req.body.id_kat +",'X',"+req.body.iznos+',1)' ;


    SQLHEAD2 += "ON DUPLICATE KEY UPDATE id_kategorija=VALUES(id_kategorija)," +
        "troskovi=VALUES(troskovi)- kategorija.troskovi;" ;


    var SQLHEAD3 = 'DELETE FROM kat_tran WHERE kat_tran.id_kat_tran =' +req.body.id_kat_tran +';'

    pool.query(SQLHEAD, function (error, results, fields) {
        if (error) throw error;
        count--;
        if(count == 0){
            end();
        }

    });
    pool.query(SQLHEAD2, function (error, results, fields) {
        if (error) throw error;
        count--;
        if(count == 0){
            end();
        }


    });
    pool.query(SQLHEAD3, function (error, results, fields) {
        if (error) throw error;
        count--;
        if(count == 0){
            end();
        }


    });

    var end = function (){
        res.send('ok');
        res.end();
    };

});



module.exports = router;