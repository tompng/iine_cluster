var net=require('net');
var counter=require('./counter').create(10);
var timeout=1000;
function start(port){
  net.createServer(accept).listen(port);
}
counter.onfire=function(count){process.send(count);}
var response='HTTP/1.0 200 OK\r\nAccess-Control-Allow-Origin: *\r\n\r\n'
function accept(socket){
  var endTimer=setTimeout(function(){socket.end();},timeout);
  socket.on('data',function(data){
    if(data[3]==32&&data[5]==32)counter.increment();
    socket.write(response);
    socket.end();
    clearTimeout(endTimer);
  });
}
module.exports={start:start,broadcast:function(){}}
