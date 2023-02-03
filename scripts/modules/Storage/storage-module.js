const { ipcRenderer } = require("electron");

const MMR = class {
    constructor(){

    }

    get(key,callback){
        ipcRenderer.invoke("getFromStorage",key).then(callback)
    }
    set(key,value){
        ipcRenderer.invoke("saveInStorage",key,value);
    }

}

const types = {
    Accounts : "accounts",
    Messages : "messages"
}
const Memory = new MMR();

module.exports = {Memory : Memory, MemoryTypes : types};