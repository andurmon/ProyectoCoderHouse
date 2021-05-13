const { fork } = require("child_process");
const cluster = require('cluster') /* https://nodejs.org/dist/latest-v14.x/docs/api/cluster.html */

const numCPUs = require('os').cpus().length

if ( !process.argv[2] | process.argv[2]==="FORK"){
    console.log("FORK !!!");
    const forked = fork("./server.js");
    forked.send('start')

} else if (process.argv[2]==="CLUSTER"){

    if(cluster.isMaster) {
        console.log(numCPUs)
        console.log(`PID MASTER ${process.pid}`)
    
        for(let i=0; i<numCPUs; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', worker => {
            console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
            cluster.fork()
        })
    }
    /* --------------------------------------------------------------------------- */
    /* WORKERS */
    else {
        require("./server.js")
    }
}