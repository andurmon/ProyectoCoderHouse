let random = (min, max) => Math.floor(Math.random() * (+max - +min) + +min);

process.on("message", msg => {
    console.log("Fathers Message", msg);
    let { cantidad, min, max } = msg;

    let obj = {
        randoms : []
    }

    for(let i=0; i<cantidad; i++){
        obj.randoms.push(random(min, max));
    }
    
    process.send(obj)
})
