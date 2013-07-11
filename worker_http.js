var http=require('http');
var express=require('express');
var socketio=require('socket.io');
var app=express();
var io;
function start(port){
  var server=http.createServer(app).listen(port);
  io=socketio.listen(server,{'log level':1});
  app.get('/',function(req,res){
    res.sendfile('./index.html');
  });
}
function broadcast(message){
  io.sockets.emit('data',message);
}
module.exports={start:start,broadcast:broadcast};
