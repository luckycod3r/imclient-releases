var axios = require('axios');
const { ipcRenderer } = require('electron');
var FormData = require('form-data');
var fs = require('fs');

// NzA2MDI1MTI1MDczMzg3NTUx.G9LPNO.hQufICpeXAphPSlAWueBKQ0DS88ILhplhoh51M
let task = (w)=>{
    setTimeout(w,1000);
}

let FastApi = class {
    constructor(token){
        this.token = token;
    }

    async post(lib,params, isDataInBody = false){
        let form = new FormData();
        let data_ = params;
        
        if(!isDataInBody){
            data_ = JSON.stringify(params);
        }
        console.log(data_);
      
        const response = await fetch(`https://discord.com/api/v10${lib}`,{
            body : JSON.stringify(data_),
            method : "post",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': this.token
              }
            
        })
        const data = await response.json();
        console.log(response);
        console.log(data);
        return data;
    }
    async get(lib,params,callback){
        let form = new FormData();
        
        for(let i in params){
            form.append(i,params[i]);
        }

        const response = await fetch(`https://discord.com/api/v10${lib}`,{
            method : "get",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': this.token
              }
            
        })
        const data = await response.json();
        return data
    }
}

let Client = class {
    constructor(token){
        this.token = token;
    }
    sendToChannel(template){
        console.log(template);
        ipcRenderer.invoke("sendMessage",template.channelID,template.message, template.images);
    }
}
let attachmentsList = 0;
let Discord = class {
    constructor(){
        
    }

    Attachment = class {
        constructor(path){
            let id = attachmentsList++;
            var stats = fs.statSync(path)
            let object = {
                id : id,
                filename : "attached_by_imclient",
                size : stats.size,
                url : path,
            }
            return object;
        }
    }
}

module.exports = {Client : Client, FastApi : FastApi, Discord : new Discord()};