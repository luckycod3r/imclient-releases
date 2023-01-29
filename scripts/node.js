
global.SET_PAGE = (name) => {
    document.querySelector(`[show="true"]`).setAttribute("show",false)
    document.querySelector(`.${name}`).setAttribute("show",true);
  }
  
const { ipcRenderer, net, shell } = require('electron');
const {machineId, machineIdSync} = require('node-machine-id');
const Store = require('electron-store');
const { Client } = require('./discord-module');
const { Memory, MemoryTypes } = require('./storage-module');

global.DATA = {
    ACCOUNTS : [],
    MESSAGES : []
}

const { IMClient } = require('./im-module');

function clk(selector,callback){
    document.querySelector(selector).onclick = callback;
}

let fstQ = class {
    constructor(prefix){
        this.prefix = prefix
    }
    x(name){
        return document.querySelector(`${this.prefix}-${name}`);
    }
    v(name){
        console.log(`${this.prefix}-${name}`);
        return document.querySelector(`${this.prefix}-${name}`).value;
    }
}



function loadData(){
    let wrapper = document.querySelector(".account-list");
    for(let data of DATA.ACCOUNTS){
        let container = document.createElement("div");
        container.classList.add("account");
        container.innerHTML = `<span class="account-name">${data.name}</span>`
        wrapper.append(container);
        document.querySelector("#msg-account").innerHTML += `<option data-id="${data.id}">${data.name}</option>`
    }
}

function loadMessages(){
    let wrapper = document.querySelector(".messages-list");
    wrapper.innerHTML = '';
    if(DATA.MESSAGES == undefined) DATA.MESSAGES = [];
    for(let data in DATA.MESSAGES){
        let container = document.createElement("div");
        container.classList.add("message");
        container.innerHTML = `<span class="message-name">${DATA.MESSAGES[data].name}</span><button id="template-${data}" class="button-start-template">Запустить</button> <span id="timer-${data}">10:00</span>`
        wrapper.append(container);
    }
    document.querySelectorAll(".button-start-template").forEach((btn)=>{
        btn.addEventListener("click",()=>{
            let TEMPLATE_ID = btn.id.split("-")[1];
            let TEMPLATE_OBJECT = IMClient.findTemplate(TEMPLATE_ID);
            if(IMClient.findTask(TEMPLATE_OBJECT) == null){
                IMClient.createTask(TEMPLATE_OBJECT);
                btn.innerHTML = 'Остановить';
            }
            else{
                IMClient.removeTask(TEMPLATE_OBJECT);
                btn.innerHTML = 'Запустить';
            }
            
        })
    })
}

window.addEventListener('DOMContentLoaded', () => {
     Memory.get(MemoryTypes.Accounts,(res)=>{
        DATA.ACCOUNTS = res;
        loadData();
     })
     Memory.get(MemoryTypes.Messages,((res)=>{
        DATA.MESSAGES = res;
        loadMessages();
     }))
    clk("#msg-create",()=>{
        let fst = new fstQ('#msg');
        let data = {
            name : fst.v('template'),
            channelID : fst.v('chid'),
            timeCD : fst.v('time'),
            msgCD : fst.v('q'),
            account : IMClient.findAccount(fst.v('account')).token,
            message : fst.v('message')
        }
        if(IMClient.addTemplate(data)){
            loadMessages();
        }
    })
    document.querySelector("#addAcc").addEventListener("click",()=>{
        if(document.querySelector("#account-token").value === ''){
            alert("Неккоректный токен");
        }
        else{
            IMClient.addAccount(document.querySelector("#account-token").value);
        }
        
    })
    // console.log(STORAGE.get("test"))
})
