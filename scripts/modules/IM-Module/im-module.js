const { Memory, MemoryTypes } = require('../Storage/storage-module');
const { Client, FastApi } = require('../Discord/discord');
const { dialog, ipcRenderer } = require('electron');

let IM = class {
    constructor(params) {
        this.tasks = []
        this.version = "1.0";
        
    }

    addAccount(token){
        new FastApi(token).get('/users/@me').then((res)=>{
            if(res.code === 0){
                alert('Токен невалидный');
            }
            else{
                let data = {
                    id : res.id,
                    name : `${res.username}#${res.discriminator}`,
                    token : token
                }
                let wrapper = document.querySelector(".account-list");
                    let container = document.createElement("div");
                    container.classList.add("account");
                    container.innerHTML = `<span class="account-name">${data.name}</span>`
                    wrapper.append(container);
                if(DATA.ACCOUNTS == undefined){
                    DATA.ACCOUNTS = [];
                }
                DATA.ACCOUNTS.push(data);
                Memory.set(MemoryTypes.Accounts,DATA.ACCOUNTS);
                alert(`Аккаунт ${data.name} добавлен в список`);
            }
        })
    }
    findAccount(id){
        for(let acc of DATA.ACCOUNTS){
            if(acc.id == id || acc.name == id){
                return acc;
            }
        }
    }

    findTemplate(id){
        for(let tmpl in DATA.MESSAGES){
            if(tmpl == id){
                DATA.MESSAGES[tmpl].id = tmpl;
                return DATA.MESSAGES[tmpl];
            }
        }
    }
    checkActivation(){

        var axios = require('axios');

        var config = {
        method: 'get',
        url: 'https://raw.githubusercontent.com/luckycod3r/imcdatabase/main/db.json',
        headers: { }
        };

        return axios(config)

    }
    createTimer(tmpl,timerID){
        let SECONDS = tmpl.timeCD;


        let seconds = SECONDS;
        let minutes = 0;
        let timer = setInterval(()=>{
            seconds -= 1;
            if(seconds == 0){
                seconds = SECONDS;
            }
            document.querySelector("#timer-" + timerID).innerHTML = `${seconds}`;
        },1000)
        return timer;
    }

    createTask(tmpl){
        let client = new Client(tmpl.account);
        client.sendToChannel(tmpl);
        let interval = setInterval(()=>{
            
            client.sendToChannel(tmpl);
        },~~tmpl.timeCD * 1000)
            this.tasks.push({
                template : tmpl,
                interval : interval,
                stoped : false,
                timer : this.createTimer(tmpl,tmpl.id)
            }) 
    }
    deleteMessage(id){
        let tmpl = this.findTemplate(id);
        DATA.MESSAGES.splice(DATA.MESSAGES.indexOf(tmpl),1);
        Memory.set(MemoryTypes.Messages,DATA.MESSAGES);
        console.log('removed');
        return true;
    }

    findTask(tmpl){
        for(let i of this.tasks){
            if(i.template == tmpl){
                return i;
            }
        }
        return null;
    }

    removeTask(tmpl){
        let task = this.findTask(tmpl);
        if(!task.stoped){
            clearInterval(task.interval);
            clearInterval(task.timer);
            this.tasks.splice(this.tasks.indexOf(tmpl),1);
        }
    }

    addTemplate(data){
        let nextID = null;
        if(DATA.MESSAGES == undefined){
            DATA.MESSAGES = [];
            nextID = 0;
        }
        //if(nextID != null) nextID = DATA.MESSAGES[DATA.MESSAGES.length - 1].id + 1;
        data.id = nextID;
        DATA.MESSAGES.push(data);
        Memory.set(MemoryTypes.Messages,DATA.MESSAGES)
        SET_PAGE("messages");
        return true
    }
   
    updateTemplate(templateData){
        console.log(templateData);
        DATA.MESSAGES[state.edittable_template] = templateData;
        Memory.set(MemoryTypes.Messages,DATA.MESSAGES);
        return true;
    }

    createDialogue(type, handler){
        if(type === 'upload'){
            ipcRenderer.invoke('dialog').then(handler);

        }
    }

}

module.exports = {IMClient : new IM()}