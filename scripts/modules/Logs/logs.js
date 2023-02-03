let Logs = class {
    constructor(){
        this.sended = [];
    }

    send(type,text){
        this.sended.push({
            type : type,
            text : text,
        })
    }
}

module.exports = {Logs : new Log()}