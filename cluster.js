'use strict';

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

let temp = numCPUs;
let dead = 0;

if (cluster.isMaster) {
    if (!process.argv[2]) {
        console.log('Script to cluster is missing');
    }

    console.log(new Date());

    while (temp--) {
        cluster.fork({cpu_number: temp});
    }
}
else {
    require(__dirname + '/' + process.argv[2]);
}

cluster.on('exit', worker => {
    worker.kill();

    if (++dead === numCPUs) {
        console.log(new Date());
        console.log('Everyone is dead');
        process.exit();
    }
});
