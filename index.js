const { logger } = require("./logging.js");

const { fork } = require("child_process");
const cluster = require('cluster') /* https://nodejs.org/dist/latest-v14.x/docs/api/cluster.html */

const numCPUs = require('os').cpus().length

if ( !process.argv[2] | process.argv[2]==="FORK"){
    logger.trace("FORK !!!");
    const forked = fork("./server.js");
    forked.send('start')

} else if (process.argv[2]==="CLUSTER"){

    if(cluster.isMaster) {
        logger.trace(numCPUs)
        logger.trace(`PID MASTER ${process.pid}`)
        
        for(let i=0; i<numCPUs; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', worker => {
            logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
            cluster.fork() 
        })
    }
    /* --------------------------------------------------------------------------- */
    /* WORKERS */
    else {
        require("./server.js")
    }
}