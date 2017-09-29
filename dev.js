const fs = require('fs')
const chokidar = require('chokidar')
let cluster = require('cluster');


if (cluster.isMaster) {
    let worker = cluster.fork()
    let t = Date.now()
    let it = false
    chokidar.watch(['src', 'tests'], {ignored: /(^|[\/\\])\../})
            .on('all', (event, path) => {
                //console.log(event, path)
                if (Date.now() - t > 500) {
                    clearTimeout(it)
                    it = setTimeout(() => {
                        console.log("restart")
                        if (console.log(worker.isConnected())) {
                            worker.send('any message')
                        }
                        worker = cluster.fork()
                    }, 500)
                }
                t = Date.now()
            })

    cluster.on('exit', function (deadWorker, code, signal) {
        let oldPID = deadWorker.process.pid
        console.log('worker ' + oldPID + ' died......................................')
    })
    //console.log("master")
} else {
    console.log("new worker", process.pid)
    process.on('message', (msg) => {
        process.exit(1)
    });
    const ts = require('ts-node')
    ts.register({
        fast:true,
        cacheDirectory:".tmp"
    })
    require('./tests/index')
}

