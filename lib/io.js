var cookie = require('cookie');
var sessions = require("client-sessions");
module.exports = function(io) {

    io.set('authorization', function(data, accept) {
        if (data.headers.cookie) {

            data.cookie = cookie.parse(data.headers.cookie);
            //console.log(data.cookie);
            if(data.cookie['sessval']==undefined || data.cookie['sessval']== null){
                return accept('Guest is not allowed',false);
            }
            var decoded = sessions.util.decode(cookieconf, data.cookie['sessval']);
            console.log(decoded);
            //console.log(decoded.content.user);
            if (decoded.content.user == undefined || decoded.content.user == null) {
                return accept('Cookie is invalid.', false);
            }
        }else {
            return accept('No cookie transmitted.', false);
        }


        data.headers.user = decoded.content.user;
        data.headers.id=decoded.content.id;
        //console.log( data.headers);
        accept(null, true);





    });



io.sockets.on('connection', function(socket){
    console.log('a user connected ' + socket.handshake.headers.user +' '+ socket.handshake.headers.id);
   // console.log(socket.handshake);

//console.log(clients);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('send:message', function (data) {
        console.log('RADI');
    });

    socket.on('send:login', function (data) {
        //baza

        if(data.username == username && data.password == password) {


            console.log('RADI');

        }
    });


});
};