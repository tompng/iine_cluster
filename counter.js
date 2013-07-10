function create(delay){
  var timer=null,count=0;
  var counter={}
  counter.increment=function(n){
    count+=(n==undefined?1:n);
    if(timer)return;
    timer=setTimeout(function(){
      counter.onfire(count);
      timer=null;
      count=0;
    },delay);
  }
  counter.onfire=function(){}
  return counter;
}

module.exports={create:create};
