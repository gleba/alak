import {devConst} from "./dev";

export function getConnector() {
  var io = require('socket.io-client')
  console.log("alak debug mode")
  if (!io) {
    console.log("please add socket.io")
    console.log("npm i socket.io-client")
    console.log("or add")
    console.log('<script src="/socket.io/socket.io.js"></script>')
    throw "socket.io-client not found"
  }
  // let socket = io('http://localhost:8778?ctx=app');

  let socket = io('http://localhost:8778?ctx=app&asid='+devConst.sid);

  let cache = []
  let isOnline = false
  socket.on('connect', ()=>{
    isOnline = true
    console.log('online!!!')

    while (cache.length)
      socket.send(cache.shift())
  });


  socket.on('error', function(data){
    console.log('error')
  })
  socket.on('event', function(data){
    console.log('event', data)

  });
  socket.on('disconnect', e=>{
    console.log('disconnect', e)

  });

  return (path, data) => {
    data['time'] = Date.now()
    if (isOnline) {
      socket.send(data)
    } else {
      cache.push(data)
    }
  };
}

