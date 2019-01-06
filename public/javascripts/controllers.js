'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', ['angularModalService']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('§');
    $interpolateProvider.endSymbol('§');
});

app.controller('LoginCtrl', function ($scope, $window, $http, $sce, socket) {

    $scope.sendLogin=function() {

        var varHTML;

        if(($scope.usernameemail == '' || $scope.usernameemail == undefined) &&($scope.password == ''  || $scope.password == undefined)) {
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = 'Molimo unesite korisničko ime ili email te lozinku.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);

        }else if($scope.usernameemail == '' || $scope.usernameemail == undefined){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML='Molimo unesite korisničko ime ili email.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }else if($scope.password == '' || $scope.password == undefined){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML='Molimo unesite lozinku';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);



        }
        else{
            $http.post('/api/login',{username: $scope.usernameemail, password: $scope.password}).
            then(function successCallback(data) {

                if(data.data == "cool"){
                     $scope.showMsg = {'visibility':'hidden'};
                     $window.location.href = '/testtable';
               }else{
                   console.log("Rejected");
                    $scope.showMsg = {'visibility': 'visible'};
                    varHTML='<div style="color:red">Neuspijela autorizacija</div>';

                    $scope.insertHTML = $sce.trustAsHtml(varHTML);

               }

            },function errorCallback(data) {
                console.error("error in posting");
            });

           /* var data = {username : $scope.usernameemail, password : $scope.password};

            socket.emit('send:login',data);*/


        }
    }
});

app.controller('RegisterCtrl', function ($scope, $window, $http, $sce, $timeout) {
    $scope.sendRegistration = function(){
        var varHTML;

        if($scope.firstName == '' || $scope.firstName == undefined){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = 'Molimo unesite Vaše ime.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.lastName == '' || $scope.lastName == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite Vaše prezime.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.companyName == '' || $scope.companyName == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite ime poduzeća.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.transactionEmail == '' || $scope.transactionEmail == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite email adresu za transakcije.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.userName == '' || $scope.userName == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite korisničko ime.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.userEmail == '' || $scope.userEmail == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite korisnički email.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.password == '' || $scope.password == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite lozinku (Najmanje 6 znakova).';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.password != $scope.confirmPassword) {
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Potvrdite lozinku.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else{
            $http.post('/api/register', {firstName: $scope.firstName, lastName: $scope.lastName, companyName: $scope.companyName,
                transactionEmail: $scope.transactionEmail, userName: $scope.userName, userEmail: $scope.userEmail, password: $scope.password}).
            then(function SuccessCallback(data) {

                    if (data.data == "errorusername") {
                        $scope.showMsg = {'visibility': 'visible'};
                        varHTML = '<div style="color:red">Korisničko ime već postoji.</div>';

                        $scope.insertHTML = $sce.trustAsHtml(varHTML);
                    }
                    else if(data.data == "erroremail"){
                        $scope.showMsg = {'visibility': 'visible'};
                        varHTML = '<div style="color:red">Korisnički email već postoji.</div>';

                        $scope.insertHTML = $sce.trustAsHtml(varHTML);
                    } else if(data.data == "success"){

                    $scope.showMsg = {'visibility': 'visible'};
                    varHTML = '<div style="color:blue">Uspješna registracija.</div>';

                    $scope.insertHTML = $sce.trustAsHtml(varHTML);
                        $timeout(function () { $window.location.href = '/login';}, 2500);

                }
            }, function errorCallback(data) {
                console.error("error in posting");
            });
        }
    }
});

app.controller('hoverLink', function($scope){
    $scope.open = false;
});

app.controller('unusable', function($scope, $location){
    $scope.showProject = function(project){
        $location.path('#/project-list/' + project.id);
    };
    console.log('RADI');
});

app.controller('oneproject', function($scope,$http,$window,$document,$location) {
      var idprojekta;
      var kattran;
      var something=[];

       $scope.katran=[];


     idprojekta = parseInt($window.location.pathname.replace('/project-template/',""));
   // console.log(idprojekta);





    $http.post('/api/gettemplate', {id: idprojekta}).
    then(function SuccessCallback(data) {
        if(data.data=='empty'){
            console.log('NOTHING IN BASE');
            //ako nema transakcija
        }else {


            $scope.namepro=data.data[0].ime;
           kattran=parsekattran(data.data);
           //console.log(kattran);
          $scope.katran =JSON.parse(JSON.stringify(kattran));
        }

    }, function errorCallback(data) {
        console.error("error in posting");
    });




$scope.removetran = function(parent,$index,obj, $event){
    //console.log (parent);
   // console.log($index);
//console.log($scope.katran);
var slanje = {
    id_kat_tran: $scope.katran[parent].transakcije[$index].id_kat_tran,
    id_tran : $scope.katran[parent].transakcije[$index].id_tran,
    iznos : $scope.katran[parent].transakcije[$index].iznos,
    id_kat : $scope.katran[parent].kategorija.id_kat
};

    $http.post('/api/deletekattrans', slanje).
    then(function SuccessCallback(data) {
        if(data.data=='ok'){
            $scope.katran[parent].transakcije.splice($index,1);
            //ako nema transakcija
        }else {


        }

    }, function errorCallback(data) {
        console.error("error in posting");
    });

};




});






app.controller('showTables', function($scope,$http,$window){
    $scope.selection = { selectedNode:  null };
    $scope.stanje = 1; //pocetno stanje
    var izabranakategorija = -1;
    var izabranatransakcija = -1;
    var izabranbuzet = -1;
    var parentkat = -1;
    var indexkat =-1;
    var indextran = -1;
    var indexbudzet = -1;
    var oldtranvalue;
    var duzinaprojekata;
    var duzinatransakcija;
    var projekti;
    $scope.posttrans=[];
    $scope.buttonEnable= ["","","disenable","","disenable","disenable"];
    $scope.editkat = [];
    $scope.editkatnaziv =[];
    $scope.hidekatnaziv=[];
    $scope.hidekatbudzet=[];
    $scope.openremove= [];
    $scope.openlink = [];
    $scope.showtran = [];
    $scope.hidetran = [];
    $scope.addcatbottun=true;
    $scope.category = -1;
    $scope.categorybudz = -1;
    $scope.broj = -1;
    var projbudzet;
    var namebudzet;
    var idbudzet = -1;
    var izmjene=[];
    var originalprojects={};
    var originaltrans={};

    $http.post('/api/getprojects', {HELLO: "HELLO"}).
    then(function SuccessCallback(data) {
        if(data.data=='empty'){
            console.log('NOTHING IN BASE');
          //ako nema projekata
        }else {

           // console.log(data.data);
          var newdata = projectTableParser(data);
          for(var i=0;i<newdata.length;i++) {
              newdata[i].kategorija.sort(function (a, b) {
                  if (a.brojkat < b.brojkat) {
                      return -1;
                  }
                  if (a.brojkat > b.brojkat) {
                      return 1;

                  }
                  if(a.brojkat == b.brojkat){
                      if(a.vrstakat =='K' && b.vrstakat == 'K') {
                          return 0;
                      } else if(a.vrstakat =='P' && b.vrstakat == 'P'){
                          return 0;
                      }else if(a.vrstakat =='K' && b.vrstakat == 'P'){
                          return -1;
                      }else if(a.vrstakat =='P' && b.vrstakat == 'K'){
                          return 1;
                      }
                  }
              });
              newdata[i].kategorija.clean(undefined);
          }
           //console.log (newdata);
          originalprojects=JSON.parse(JSON.stringify(newdata));
          $scope.projects = newdata;
          duzinaprojekata= newdata.length;
        }
    }, function errorCallback(data) {
        console.error("error in posting");
    });



    $http.post('/api/gettrans', {HELLO: "HELLO"}).
    then(function SuccessCallback(data) {
        if(data.data=='empty'){
            console.log('NOTHING IN BASE');
            //ako nema transakcija
        }else {
            var newdata;
            //console.log(data.data);
            newdata = transactionTableParser(data.data);
            //console.log(newdata);
            originaltrans=JSON.parse(JSON.stringify(newdata));
            duzinatransakcija=newdata.length;
            $scope.transactions=newdata;
        }

    }, function errorCallback(data) {
        console.error("error in posting");
    });

    $scope.projectshow =[];



     /*
    var result = document.getElementsByClassName("clickableRow");
        console.log(result);*/

    $scope.projectclick=function($index,obj, $event) {
        if ($scope.stanje == 1) {
            var projectidfromhtml = obj.currentTarget.cells[0].innerHTML;
            var poststring = '/project-template/' + projectidfromhtml;
            $window.location.href = poststring;


        } else if ($scope.stanje == 2 || $scope.stanje == 3) {
            if ($scope.projectshow[$index] == true) {
                $scope.projectshow[$index] = false;
            } else {
                $scope.projectshow[$index] = true;
            }


        }
    };//end of project click
$scope.addpodkat= function (parent,$index,obj,$event) {
    var convert = String($scope.projects[parent].kategorija[$index].id_kat)
    var conclude = convert.indexOf('X');
    if( conclude == -1) {
        var newpot = {
            brojkat: $scope.projects[parent].kategorija[$index].brojkat,
            budzet: 0,
            id_kat: $scope.projects[parent].kategorija[$index].id_kat + "X",
            naziv: "Podkategorija",
            preostaliiznos: 0,
            troskovi: 0,
            vrstakat: "P"
        };

        $scope.projects[parent].kategorija.splice($index + 1, 0, newpot);
    }
    //console.log($scope.projects);
  // $scope.$apply();

};
$scope.removepodkat = function (parent,$index,obj,$event) {
 var convert = String($scope.projects[parent].kategorija[$index].id_kat)
 var conclude = convert.indexOf('X');
    if( conclude != -1) {
        $scope.projects[parent].kategorija.splice($index, 1);
       // console.log($scope.projects);
    }else{

    }
};
$scope.addkat = function($index,obj,$event){
   //console.log($index);
   var lengthofkat = $scope.projects[$index].kategorija.length;
   var highestnum=0;
   for(var i=0; i<lengthofkat; i++){
       if($scope.projects[$index].kategorija[i].brojkat > highestnum){
           highestnum = $scope.projects[$index].kategorija[i].brojkat;
       }
   }
    var newpot ={
        brojkat :  parseInt(highestnum)+1,
        budzet : 0,
        id_kat :    "KX",
        naziv : "Kategorija",
        preostaliiznos : 0,
        troskovi : 0,
        vrstakat : "K"
    };
    $scope.projects[$index].kategorija.splice(lengthofkat,0,newpot);


};




     var selectedcategory=0;
     var selectedlastparent;
     var selectedlastindex;
     var selectedlastnaziv;
     var selectedlastid;
     var selectedlastbudzet;
     var selectedindex;
    $scope.categoryclick =function(parent,$index,obj, $event){
      if($scope.stanje == 2){
         if(selectedcategory==0) {
             selectedlastindex=$index;
             selectedlastparent=parent;
            selectedlastnaziv=$scope.projects[parent].kategorija[$index].naziv;
            selectedlastbudzet=$scope.projects[parent].kategorija[$index].budzet;
            selectedlastid=$scope.projects[parent].kategorija[$index].id_kat;
             selectedindex=parent +' '+ $index;
             $scope.editkat[parent +' '+ $index] = true;
             if($scope.projects[parent].kategorija[$index].vrstakat == 'P' || $scope.projects[parent].kategorija[$index].id_kat == 'KX') {
                 $scope.editkatnaziv[parent + ' ' + $index] = true;
                 $scope.hidekatnaziv[parent + ' ' + $index]=true;
             }
             $scope.hidekatbudzet[parent + ' ' + $index]=true;
             selectedcategory = 1;
         }else if(selectedcategory == 1 && selectedindex != parent+ ' ' +$index){
             $scope.editkat= [];
             $scope.editkatnaziv=[];
             $scope.hidekatnaziv=[];
             $scope.hidekatbudzet=[];

             selectedcategory = 0;
             selectedindex = "";
             selectedlastnaziv="";
             selectedlastbudzet="";
             selectedlastid = "";
            // console.log($scope.projects);
             //console.log($scope.katinput[selectedindex]);
         }
      }else if($scope.stanje == 3){
         if(indextran != -1){ //turnoff kategorija tran
             parentkat= -1;
             indexkat = -1;
             izabranakategorija = -1;
             $scope.showtran[indextran]=false;
             $scope.hidetran[indextran]=false;
             $scope.category = -1;
             indextran = -1;
             $scope.selectedIndex = [];
             $scope.getStyleTran(-1);
             return;
         }
         if(izabranbuzet == 1){
             izabranbuzet = -1;
             $scope.categorybudz = -1;
             $scope.broj = -1;
         }
          parentkat=parent;
          indexkat = $index;
          izabranakategorija=$scope.projects[parent].kategorija[$index].id_kat;
          //console.log(izabranakategorija);
          var stringC ='background-color: #0e67ff; color: #ffffff';
           $scope.selectedIndex = parent+" "+ $index;
          ////////////////////////////////////////////////////////////////////////////////
      }
    };
    $scope.budgetclick =function(select,$index,obj, $event){

       if($scope.stanje == 3){
           if( izabranakategorija != -1){ // gasi kategoriju
               parentkat= -1;
               indexkat = -1;
               izabranakategorija = -1;
               $scope.selectedIndex = [];

           }
           if(indextran != -1 ){ //turnoff budjet tran

               parentkat= -1;
               indexkat = -1;
               izabranakategorija = -1;
               izabranatransakcija = -1;
               izabranbuzet = -1;
               $scope.showtran[indextran]=false;
               $scope.hidetran[indextran]=false;
               $scope.category = -1;
               indextran = -1;
               $scope.selectedIndex = [];
               $scope.getStyleTran(-1);
               return;
           }


            if(select == 0){
                indexbudzet = $index;
                projbudzet = $scope.projects[$index].projekt.naziv;
                namebudzet = "Budžetni prihodi";
                idbudzet = $scope.projects[$index].budzet.id_budzet;
                //console.log(projbudzet, namebudzet, idbudzet);
                izabranbuzet = 1;
                $scope.categorybudz = $index;
                $scope.broj = 0;
            }else if (select == 1){
                indexbudzet = $index;
               // console.log(indexbudzet);
                projbudzet = $scope.projects[$index].projekt.naziv;
                namebudzet = "Nepovezani budžet";
                idbudzet = $scope.projects[$index].budzet.id_prebudzet;
               // console.log(projbudzet, namebudzet, idbudzet);
                izabranbuzet = 1;
                $scope.categorybudz = $index;
                $scope.broj = 1;
            }


       }



    };

    $scope.transclick =function($index,obj, $event){
        var uvjet = false;
        if($scope.stanje == 3) {
            if(izabranakategorija != -1) {
                for (var i = 0; i < $scope.transactions[$index].projekt.length; i++) {
                    if ($scope.projects[parentkat].projekt.id == $scope.transactions[$index].projekt[i].id_projekt) {
                        uvjet = true;

                    } else {

                    }
                }
            }else if(izabranbuzet == 1){
                for (var i = 0; i < $scope.transactions[$index].projekt.length; i++) {
                    if ($scope.projects[indexbudzet].projekt.id == $scope.transactions[$index].projekt[i].id_projekt) {
                        uvjet = true;

                    } else {

                    }
                }
            }
            if(uvjet) {
                if(indextran != -1){
                    $scope.showtran[indextran]=false;
                    $scope.hidetran[indextran]=false;
                }
                indextran = $index;
                oldtranvalue = $scope.transactions[$index].about.iznos;
                //console.log('STARA VRIJEDNOST'+oldtranvalue);
                //console.log(indextran);

                izabranatransakcija = $scope.transactions[$index].about.id_tran;
              // console.log(izabranatransakcija);
                $scope.selectedIndexTran = $index;
                $scope.category = $index;
                $scope.showtran[$index]=true;
                $scope.hidetran[$index]=true;


            }
        }
    };

    $scope.linkpress=function($index,obj, $event){
      var brisi = false;
      var newobject = {
          imeprojekta : "",
          kategorija: "",
          datum : "",
          partner : "",
          opis : "",
          iznos: "",
          id_kat: "",
          id_tran: "",
          pridjeljeno: "",
          noviznos: ""
      };
      // console.log('Nova vrijednost' +oldtranvalue);
       //console.log(indextran);
       //console.log($scope.transactions[indextran].about.iznos);
            if($scope.transactions[indextran]==undefined){
                return;
            }

            var newvalue = $scope.transactions[indextran].about.iznos;
            var diff = oldtranvalue - newvalue;
            // console.log('RAZLIKA ' + diff);
            if ((oldtranvalue < 0 && diff > 0 ) || (oldtranvalue > 0 && diff < 0 )) {
                $scope.selectedIndexTran = [];
                $scope.showtran[indextran] = false;
                $scope.hidetran[indextran] = false;
                $scope.transactions[indextran].about.iznos = oldtranvalue;


                return;
            }
            if ((oldtranvalue < 0 && newvalue > 0) || (oldtranvalue > 0 && newvalue < 0)) {
                $scope.selectedIndexTran = [];
                $scope.showtran[indextran] = false;
                $scope.hidetran[indextran] = false;
                $scope.transactions[indextran].about.iznos = oldtranvalue;


                return;
            }

            if (oldtranvalue == $scope.transactions[indextran].about.iznos) {
                newobject.pridjeljeno = 1;
                newobject.iznos = oldtranvalue;
                newobject.noviznos = 0;
                brisi = true;
            } else {
                newobject.pridjeljeno = 0;
                newobject.iznos = $scope.transactions[indextran].about.iznos;
                $scope.transactions[indextran].about.iznos = oldtranvalue - $scope.transactions[indextran].about.iznos;
                newobject.noviznos = oldtranvalue - $scope.transactions[indextran].about.iznos;
            }
        if(izabranakategorija != -1) {
            newobject.imeprojekta = $scope.projects[parentkat].projekt.naziv;
            newobject.kategorija = $scope.projects[parentkat].kategorija[indexkat].naziv;
            newobject.datum = $scope.transactions[indextran].about.datum;
            newobject.partner = $scope.transactions[indextran].about.partner;
            newobject.opis = $scope.transactions[indextran].about.opis;
            newobject.id_kat = $scope.projects[parentkat].kategorija[indexkat].id_kat;
            newobject.id_tran = $scope.transactions[indextran].about.id_tran;
        }else if(izabranbuzet == 1){
            newobject.imeprojekta = $scope.projects[indexbudzet].projekt.naziv;
            newobject.kategorija = namebudzet;
            newobject.datum = $scope.transactions[indextran].about.datum;
            newobject.partner = $scope.transactions[indextran].about.partner;
            newobject.opis = $scope.transactions[indextran].about.opis;
            newobject.id_kat = idbudzet;
            newobject.id_tran = $scope.transactions[indextran].about.id_tran;
        }
        if(brisi){
            $scope.transactions.splice(indextran, 1);

        }
            $scope.posttrans.push(newobject);
            console.log($scope.posttrans);
            $scope.selectedIndexTran = [];
            $scope.openlink = [];
            $scope.category = -1;
            $scope.showtran[indextran] = false;
            $scope.hidetran[indextran] = false;

            if(brisi){
             indextran = -1;
         }

    };


   $scope.changestate=function(change){

        if(change ==1){
            $scope.stanje=1;
            for(var i = 0; i< duzinaprojekata; i++) {
                $scope.projectshow[i] = false;
            }
            $scope.buttonEnable= ["","","disenable","","disenable","disenable"];


            for(var i=0; i<duzinaprojekata;i++){
                var duzinakategorijaorig=originalprojects[i].kategorija.length;
                var duzinakategorijacurr=$scope.projects[i].kategorija.length;
                for(var j=0; j<duzinakategorijacurr;j++){
                    var convert = String($scope.projects[i].kategorija[j].id_kat);
                    var conclude = convert.indexOf('X');
                    if(conclude != -1){
                        izmjene.push({
                            id: $scope.projects[i].kategorija[j].id_kat,
                            naziv: $scope.projects[i].kategorija[j].naziv,
                            budzet: $scope.projects[i].kategorija[j].budzet,
                            id_projekt: $scope.projects[i].projekt.id
                            });
                    }else {

                        for (var k = 0; k < duzinakategorijaorig; k++) {
                            if ($scope.projects[i].kategorija[j].id_kat == originalprojects[i].kategorija[k].id_kat){
                                if($scope.projects[i].kategorija[j].naziv != originalprojects[i].kategorija[k].naziv ||
                                    $scope.projects[i].kategorija[j].budzet != originalprojects[i].kategorija[k].budzet){
                                    izmjene.push({
                                        id: $scope.projects[i].kategorija[j].id_kat,
                                        naziv: $scope.projects[i].kategorija[j].naziv,
                                        budzet: $scope.projects[i].kategorija[j].budzet,
                                        id_projekt: $scope.projects[i].projekt.id

                                    });


                                }
                            }

                        }
                    }
                }
            }

            $http.post('/api/updatecategory', izmjene).
            then(function SuccessCallback(data) {
                $window.location.reload();

            }, function errorCallback(data) {
                console.error("error in posting");
            });
            $window.location.reload();

      }else if(change ==2){
         $scope.stanje = 2;

          for(var i = 0; i< duzinaprojekata; i++) {
              $scope.projectshow[i] = true;
          }
            $scope.buttonEnable= ["disenable","disenable","","disenable","disenable","disenable"];




      }else if(change ==3){
            $scope.stanje = 3;

            for(var i = 0; i< duzinaprojekata; i++) {
                $scope.projectshow[i] = true;
            }
            $scope.buttonEnable= ["disenable","disenable","disenable","disenable","",""];

      }/*else if(change ==4){
           $scope.stanje =1;
            for(var i = 0; i< duzinaprojekata; i++) {
                $scope.projectshow[i] = false;
            }
            $scope.buttonEnable= ["","","disenable","","disenable","disenable"];
        }*/
        else if(change == 5){
            $scope.stanje =1;
            for(var i = 0; i< duzinaprojekata; i++) {
                $scope.projectshow[i] = false;
            }
            $scope.buttonEnable= ["","","disenable","","disenable","disenable"];
            $window.location.reload();
        }

    };

    $scope.getStyle = function(parent,child){
        if( (parent+" "+child) === $scope.selectedIndex ){
            return  {
                'background-color': '#0e67ff',
                'color': '#ffffff'

        };
        } else{
            return "";
        }
    };

    $scope.getStyleTran = function($index,category){
        if( $index === $scope.category ) {
            return {
                'background-color': '#0e67ff',
                'color': '#ffffff'

            };
        }
         else{
            return "";
        }
    };
    $scope.getStyleBudz = function(broj,$index,categorybudz){
        if( $index === $scope.categorybudz && broj == $scope.broj ) {
            return {
                'background-color': '#0e67ff',
                'color': '#ffffff'

            };
        }
        else{
            return "";
        }
    };

   $scope.removetranclick=function($index,obj,$event){
      var selectedtransid= obj.currentTarget.parentNode.parentNode.children[0].innerHTML;
       console.log(selectedtransid);
       console.log($scope.transactions[$index]);
       $scope.transactions.splice($index,1);

       $http.post('/api/deletetrans', {ID: selectedtransid}).
       then(function SuccessCallback(data) {


       }, function errorCallback(data) {
           console.error("error in posting");
       });



   };

    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

    $scope.hoverInTran = function($index){
        if($scope.stanje ==2) {
            $scope.openremove[$index] = true;

        }else  if($scope.stanje ==3 && $scope.selectedIndexTran==$index && ((parentkat != -1) || (izabranbuzet==1))) {
                    $scope.openlink[$index] = true;
        }


    };

    $scope.hoverOutTran = function($index){
        if($scope.stanje ==2) {
            $scope.openremove[$index] = false;
        }else if($scope.stanje ==3){
            $scope.openlink[$index] = false;
        }
    };

 $scope.linkserverpost = function(){
     $http.post('/api/transkat', $scope.posttrans).
     then(function SuccessCallback(data) {
         $window.location.reload();

     }, function errorCallback(data) {
         console.error("error in posting");
     });


 }
});



app.controller('CreateProCtrl', function($scope, $window, $http, $sce){
     //lets make angular change some shit
    $scope.names= [];

    $scope.IBANS=[];
    $scope.IBANS.push({
        value: "X",
        button: ""
    });
    var deletedthefirst=false;
//getibans
    $http.post('/api/GETIBANS', {HELLO: "HELLO"}).
    then(function SuccessCallback(data) {
           if(data.data=='failure'){
               console.log('NOTHING IN BASE');

           }else {

               for(var i=0;i<data.data.length;i++){
                   $scope.names.push(data.data[i].IBAN);

                }


           }


    }, function errorCallback(data) {
        console.error("error in posting");
    });


 $scope.update=function(index){

     $scope.showIBANS = {'visibility': 'visible'};

     if(deletedthefirst==false){
         $scope.IBANS.splice(0,1);
         deletedthefirst=true;
     }
     $scope.IBANS.push({
         value: $scope.dropdownIBAN,
         button: ""
     });
     //$scope.names.splice($scope.names.indexOf($scope.dropdownIBAN),1);
    //var  position=$scope.names.indexOf($scope.dropdownIBAN);
     //console.log($scope.IBANS);
     $scope.newIBAN='';
     $scope.showMsg = {'visibility': 'hidden'};
    };






    $scope.addIBAN = function(){
        var varHTML;

        if($scope.newIBAN == undefined || $scope.newIBAN == null){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = '<div style="color:red">Novi IBAN nije unesen</div>';
            $scope.insertHTML = $sce.trustAsHtml(varHTML);
            return;
        }
        if($scope.newIBAN.length < 21){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = '<div style="color:red">Uneseni IBAN je kraći od 21</div>';
            $scope.insertHTML = $sce.trustAsHtml(varHTML);
            return;
        }
        $http.post('/api/IBAN', {IBAN: $scope.newIBAN, workmode: 'add'}).
        then(function SuccessCallback(data) {

            if (data.data == "success") {
                //console.log('found');
                $scope.showMsg = {'visibility': 'visible'};
                varHTML = '<div style="color:red">IBAN već postoji.</div>';
                $scope.insertHTML = $sce.trustAsHtml(varHTML);

            }
            else if(data.data == "failure"){
                //console.log('notfound');
                //sve proslo
                $scope.showIBANS = {'visibility': 'visible'};

                if(deletedthefirst==false){
                    $scope.IBANS.splice(0,1);
                    deletedthefirst=true;
                }
                $scope.IBANS.push({
                    value: $scope.newIBAN,
                    button: ""
                });
                //console.log($scope.IBANS);
                $scope.newIBAN='';
                $scope.showMsg = {'visibility': 'hidden'};
            }
        }, function errorCallback(data) {
            console.error("error in posting");
        });






    };



    $scope.delIBAN = function(index){
       // if($scope.IBANS.)
        $scope.IBANS.splice(index,1);
        //console.log($scope.IBANS);

    };





     $scope.sendProject = function(){
         var varHTML;
         if($scope.projectName == '' || $scope.projectName == undefined){
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije uneseno ime projekta.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);

             return;
         }
         else if($scope.durationStart == '' || $scope.durationStart == undefined) {
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije unesen datum početka.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);

             return;
         }else if($scope.durationEnd == '' || $scope.durationEnd == undefined){
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije unesen datum kraja.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);

             return;
         }else if(($scope.budget == '' || $scope.budget == undefined) && ($scope.budget != '0')){
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije unesen budžet.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);
             return;


         }else{
             var diff=DateDiff.inDays($scope.durationStart,$scope.durationEnd);
             if(diff < 0 ){
                 $scope.showMsg = {'visibility': 'visible'};
                 varHTML = '<div style="color:red">Datum kraja postavljen prije datuma početka.</div>';

                 $scope.insertHTML = $sce.trustAsHtml(varHTML);

                 return;

             }else{

             }


         }
         //parsiranje datuma u string
          var sdatestr=$scope.durationStart.toString();
         var  edatestr=$scope.durationEnd.toString();


        console.log($scope.projectName+' '+$scope.durationStart+' '+$scope.durationEnd+' '+$scope.budget+' '+sdatestr+ edatestr);
         //ovdje nastavi
         $http.post('/api/PUSHPROJECT', {name: $scope.projectName, start: sdatestr, end: edatestr, budget: $scope.budget, IBANS: $scope.IBANS  }).
         then(function SuccessCallback(data) {
             if(data.data=='success'){
                 console.log('NOTHING IN BASE redirect');

             }else {

                 console.log('Something went wrong');


             }


         }, function errorCallback(data) {
             console.error("error in posting");
         });



     }




});

app.controller('AppCtrl', function ($scope, socket) {
   $scope.sendMessage=function() {
       socket.emit('send:message', function (data) {

       });
   }
  }).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });

//functions
var DateDiff = {

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    }
};

var projectTableParser = function(data){

   var katnum = 6;
    var brojprojekata = data.data.length;
    var part = [];

    var projektlist=[{
        projekt : {},
        kategorija: [],
        budzet : {}

    }];






    for(var i=0; i< brojprojekata; i=i+1){
       // console.log(i);
        projektlist[i].projekt.id= data.data[i].about.id_projekt;
        projektlist[i].projekt.naziv= data.data[i].about.ime;
        var today = new Date();
        var endDate = new Date(data.data[i].about.datumkraj);
        projektlist[i].projekt.trajanje= DateDiff.inDays(today,endDate);
        projektlist[i].projekt.iznos= data.data[i].about.iznos;
       //console.log('WTF');
       for(var j=0;j<data.data[i].kategorija.length; j++) {
           if (data.data[i].kategorija[j].naziv == "Budžetni prihodi") {
               projektlist[i].budzet.id_budzet= data.data[i].kategorija[j].id_kategorija;
               projektlist[i].budzet.iznos= data.data[i].kategorija[j].troskovi;
           } else if (data.data[i].kategorija[j].naziv == "Nepovezani budžet") {
               projektlist[i].budzet.id_prebudzet= data.data[i].kategorija[j].id_kategorija;
               projektlist[i].budzet.preiznos= data.data[i].kategorija[j].troskovi;
           } else {

               projektlist[i].kategorija[j] = {
                   id_kat: data.data[i].kategorija[j].id_kategorija,
                   vrstakat: "N",
                   brojkat: "0",
                   naziv: data.data[i].kategorija[j].naziv,
                   budzet: data.data[i].kategorija[j].budzet,
                   troskovi: data.data[i].kategorija[j].troskovi,
                   preostaliiznos: data.data[i].kategorija[j].budzet + data.data[i].kategorija[j].troskovi


               };
               if (data.data[i].kategorija[j].naziv == "Ljudski resursi") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "1";
               } else if (data.data[i].kategorija[j].naziv == "Putovanja") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "2";
               } else if (data.data[i].kategorija[j].naziv == "Oprema i roba") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "3";
               } else if (data.data[i].kategorija[j].naziv == "Ostali troškovi i usluge") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "4";
               } else if (data.data[i].kategorija[j].naziv == "Troškovi obavljanja osnovne djelatnosti") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "5";
               }else if (data.data[i].kategorija[j].tezina_kat ==0){
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = String(katnum);
                   katnum++;
               }else if(data.data[i].kategorija[j].tezina_kat == 1){//podkategorija
                  var noviid;
                  for(var k=0; k <projektlist[i].kategorija.length;k++){
                      if(data.data[i].kategorija[j].id_kat == data.data[i].kategorija[k].id_kategorija){
                          noviid = data.data[i].kategorija[k].naziv;
                          if (noviid == "Ljudski resursi") {
                              projektlist[i].kategorija[j].brojkat = "1";
                          } else if (noviid == "Putovanja") {
                              projektlist[i].kategorija[j].brojkat = "2";
                          } else if (noviid == "Oprema i roba") {
                              projektlist[i].kategorija[j].brojkat = "3";
                          } else if (noviid == "Ostali troškovi i usluge") {
                              projektlist[i].kategorija[j].brojkat = "4";
                          } else if (noviid == "Troškovi obavljanja osnovne djelatnosti") {
                              projektlist[i].kategorija[j].brojkat = "5";
                          }else{
                              projektlist[i].kategorija[j].brojkat = "999";
                          }



                      }
                  }
                   projektlist[i].kategorija[j].vrstakat = "P";





               }


           }
       }


       if(i != (brojprojekata-1)) {
           projektlist.push({
               projekt: {},
               kategorija: [],
               budzet: {}

           });
       }


    }





    return projektlist;



};


var transactionTableParser = function(data){
     if(data.length <=0 ){
         return;
     }
    var days,months,year;
    for(var i=0; i <data.length; i++){
        year=data[i].about.datum.substring(0,4);
        months=data[i].about.datum.substring(4,6);
        days=data[i].about.datum.substring(6,8);
        data[i].about.datum= days +"." + months +"."+ year;
        if(data[i].about.iznos < 0){
            data[i].about.color = "red";
        }else{
            data[i].about.color = "black"
        }

    }



    return data;

};

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

var parsekattran = function(data){
    var parsed =[{
        kategorija: {},
        transakcije: []

    }
    ];

    //console.log(data);

    for(var i=0; i <data.length; i++){
        if((data[i].naziv =='Ljudski resursi') ||
            (data[i].naziv =='Putovanja') ||
            (data[i].naziv =='Oprema i roba') ||
            (data[i].naziv =='Ostali troškovi i usluge') ||
            (data[i].naziv =='Troškovi obavljanja osnovne djelatnosti')){
                data[i].kategorija = 'K';
        }else if((data[i].naziv =='Budžetni prihodi') || (data[i].naziv =='Nepovezani budžet')){
               data[i].kategorija = 'B';
        }else{
            data[i].kategorija = 'P';
        }

    }

    data.sort(function(a,b){
        if(a.id_kat < b.id_kat){
            return -1;
        }else if(a.id_kat > b.id_kat){
            return 1;

        }else{
            return 0;
        }
    });

   // console.log(data);


    var oldid = -1;
     var out = 0;
    for(var i = 0; i<data.length; i++ ){
        if(oldid != data[i].id_kat) {
            parsed[out].kategorija.id_kat = data[i].id_kat;
                parsed[out].kategorija.naziv = data[i].naziv;
                parsed[out].kategorija.budzet = data[i].budzet;
                parsed[out].kategorija.troskovi = data[i].troskovi;
                parsed[out].kategorija. kategorija = data[i].kategorija;


           for (var j = i; j < data.length; j++) {
               if (parsed[out].kategorija.id_kat == data[j].id_kat) {
                   parsed[out].transakcije[j] = {
                       id_kat_tran : data[j].id_kat_tran,
                   id_tran: data[j].id_tran,
                   iznos :data[j].iznos,
                   opis : data[j].opis,
                   partner : data[j].partner,
                   datum : data[j].datum.substring(6,8) +"." + data[j].datum.substring(4,6) +"."+ data[j].datum.substring(0,4)
               };
               }
           }
           if(i+1 != data.length) {
               parsed.push({
                   kategorija: {
                       id_kat: -1,
                       naziv: "" ,
                       budzet: -1,
                       troskovi: -1,
                       kategorija: "",
                       datum: ""
                   }

                   ,
                   transakcije: []

               });
           }
           out++;
           oldid= data[i].id_kat;
       }else{

       }

    }

    for(var i=0; i < parsed.length; i++){
        parsed[i].transakcije.clean(undefined);
    }






    return parsed;

};