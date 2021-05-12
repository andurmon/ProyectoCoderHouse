let cantidad = 10, min = 1, max = 1000; 
let random = () => Math.floor(Math.random() * (+max - +min) + +min);

process.on("message", msg => {
    let obj = {
        randoms : []
    }
    for(let i=0; i<=cantidad; i++){
        obj.randoms.push(random());
    }
    process.send(obj)
})
