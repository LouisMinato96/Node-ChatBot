
const express = require('express');
const app = express();
const server = require('http').createServer( app );
const io = require('socket.io').listen( server );

var users = [];
var connections = [];

server.listen( process.env.PORT || 4000 );
console.log('Server Running...');

app.get( '/' , function( req , res ){
   res.sendFile( __dirname + '/index.html' );
});

io.sockets.on( 'connection' , function( socket ){
   connections.push( socket );
   console.log( 'Connected: %s sockets connected' , connections.length );

   // Disconnect
   socket.on('disconnect',function( data ){
      
      connections.splice( connections.indexOf( socket ) , 1 );
      users.slice( users.indexOf( socket.userName ), 1);
      console.log( 'Disconnected: %s sockets connected' , connections.length );
      
   });

   // Send Message
   socket.on('broadcast message',function( data ){
      
      console.log( data );
      io.sockets.emit('add new message',{ msg: socket.userName+" : "+data });
      console.log( 'Disconnected: %s sockets connected' , connections.length );

   });

   // Send User
   socket.on('broadcast user',function( data , callback ){
      
      console.log( data );
      callback(true);
      socket.userName = data;
      users.push( socket.userName );
      io.sockets.emit('user list',{ userList: users });

   });

});