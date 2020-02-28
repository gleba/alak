// import { dev } from './devConst'
//
// export function getConnector() {
//   var io = require('socket.io-client')
//   console.log('alak debug mode')
//   if (!io) {
//     console.log('please add socket.io to enable debug session')
//     console.log('npm i socket.io-client')
//     console.log('or add header')
//     console.log('<script src="/socket.io/socket.io.js"></script>')
//     throw 'socket.io-client not found'
//   }
//   // let socket = io('http://localhost:8778?ctx=app');
//
//   let socket = io('http://localhost:8778?ctx=app&asid=' + dev.sid)
//
//   let cache = []
//   let isOnline = false
//   socket.on('connect', () => {
//     isOnline = true
//     console.log('debug session online')
//     while (cache.length) socket.send(cache.shift())
//   })
//
//   socket.on('error', function(data) {
//     console.log('debug sessions error', data)
//   })
//   // socket.on('event', function(data){
//   //   console.log('event', data)
//   //
//   // });
//   socket.on('disconnect', e => {
//     console.log('debug sessions disconnect', e)
//   })
//
//   return (path, data) => {
//     data['time'] = Date.now()
//     if (isOnline) {
//       socket.send(data)
//     } else {
//       cache.push(data)
//     }
//   }
// }
