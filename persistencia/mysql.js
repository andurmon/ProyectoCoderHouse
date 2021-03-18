 
function getChats(knex){
    return new Promise((resolve, reject)=>{
        knex.from('chats').select("*")
        .then((msgs) => {
            if (!msgs.length) { resolve([]); return}
            resolve(msgs);
        })
        .catch((err)=>{
            reject({"error" : err})
        })
    })

   
}

function escribirChat(knex, chat){
    knex('chats').insert(chat);
}


 module.exports = {
    getChats: getChats,
    escribirChat: escribirChat
}