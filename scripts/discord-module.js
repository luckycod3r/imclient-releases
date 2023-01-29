// NzA2MDI1MTI1MDczMzg3NTUx.G9LPNO.hQufICpeXAphPSlAWueBKQ0DS88ILhplhoh51M

let task = (w)=>{
    setTimeout(w,1000);
}

let FastApi = class {
    constructor(token){
        this.token = token;
    }

    async post(lib,params,callback, isDataInBody = false){
        let form = new FormData();
        
        for(let i in params){
            form.append(i,params[i]);
        }

        const response = await fetch(`https://discord.com/api/v10${lib}`,{
            body : JSON.stringify(params),
            method : "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token
              }
            
        })
        const data = await response.json();
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
    sendToChannel(channelID, message){
        new FastApi(this.token).post(`/channels/${channelID}/messages`,{
            "content" : `${message}`
        })   
    }
}


module.exports = {Client : Client, FastApi : FastApi};