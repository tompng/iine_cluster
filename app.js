var cpus=require('os').cpus().length;
var cluster=require('cluster');
var Counter=require('./counter');
var httpport=4567,websocketport=4568,curlport=5678;
process.on('uncaughtException',function(err){console.log(err)});
if(cluster.isMaster){
  master();
}else{
  worker();
}

function master(){
  var workers=[];
  var counter=Counter.create(10);
  counter.onfire=function(count){
    for(var i=0;i<workers.length;i++){
      workers[i].send({data:count});
    }
  }
  function exec(index,option){
    var worker=cluster.fork();
    workers[index]=worker;
    worker.send(option);
    worker.on('message',function(count){counter.increment(count)});
    worker.on('exit',function(){
      setTimeout(function(){
        exec(index,option);
      },1000);
    })
    return worker;
  }
  function startWorker(option){
    exec(workers.length,option);
  }
  startWorker({file:'./worker_http',port:httpport});
  for(var i=0;i<cpus;i++)startWorker({file:'./worker_curl',port:curlport});
  for(var i=0;i<cpus;i++)startWorker({file:'./worker_websocket',port:websocketport});
}

function worker(){
  var w;
  process.on('message',function(msg){
    if(msg.file){
      w=require(msg.file);
      w.start(msg.port);
    }
    if(msg.data){
      w.broadcast(msg.data);
    }
  })
  setTimeout(function(){process.exit()},30000+30000*Math.random());
}