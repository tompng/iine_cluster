var WebSocketServer=require('websocket').server;
var http=require('http');
var ws;
function start(port){
  var server=http.createServer(function(req,res){res.end();}).listen(port);
  ws=new WebSocketServer({httpServer:server,autoAcceptConnections:true});
}
function broadcast(message){
  ws.broadcast(message);
}
module.exports={start:start,broadcast:broadcast};
