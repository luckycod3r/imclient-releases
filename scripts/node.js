
global.SET_PAGE = (name) => {
    document.querySelector(`[show="true"]`).setAttribute("show",false)
    document.querySelector(`.${name}`).setAttribute("show",true);
  }
  
const { ipcRenderer, net, shell } = require('electron');
const {machineId, machineIdSync} = require('node-machine-id');
const Store = require('electron-store');
const { Client } = require('./discord-module');
const { Memory, MemoryTypes } = require('./storage-module');
const { parser, htmlOutput, toHTML } = require('discord-markdown-fix');
const hljs = require('highlight.js/lib/common');
global.state = {};
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
        container.innerHTML = `<span class="message-name">${DATA.MESSAGES[data].name}</span><span class="timer" id="timer-${data}">${DATA.MESSAGES[data].timeCD}</span><button id="template-${data}" class="button-start-template"><i class="fa-solid fa-play"></i></button><button class="edit-template" id="template-${data}"><i class="fa-solid fa-pencil"></i></button><button class="delete-template" id="template-${data}"><i class="fa-solid fa-ban"></i></button>`
        wrapper.append(container);
    }
    document.querySelectorAll(".button-start-template").forEach((btn)=>{
        btn.addEventListener("click",()=>{
            let TEMPLATE_ID = btn.id.split("-")[1];
            let TEMPLATE_OBJECT = IMClient.findTemplate(TEMPLATE_ID);
            if(IMClient.findTask(TEMPLATE_OBJECT) == null){
                IMClient.createTask(TEMPLATE_OBJECT);
                btn.innerHTML = `<i class="fa-solid fa-pause"></i>`
            }
            else{
                IMClient.removeTask(TEMPLATE_OBJECT);
                btn.innerHTML = `<i class="fa-solid fa-play"></i>`
            }
            
        })
    });
    document.querySelectorAll(".delete-template").forEach((btn)=>{
        console.log(btn);
        btn.addEventListener("click",()=>{
            let id = btn.id.split("-")[1];
            
            if(IMClient.deleteMessage(~~id)) loadMessages();
        });
    });
    document.querySelectorAll(".edit-template").forEach((btn)=>{
        console.log(btn);
        btn.onclick = ()=>{
            let id = btn.id.split("-")[1];
            let form = document.querySelector("#edit");
            let TEMPLATE_OBJECT = IMClient.findTemplate(id);
            state.edittable_template = id;
            form["name"].value = TEMPLATE_OBJECT.name;
            form["msgs"].value = TEMPLATE_OBJECT.msgCD;
            form["time"].value = TEMPLATE_OBJECT.timeCD;
            form["message"].value = TEMPLATE_OBJECT.message;
            form["cid"].value = TEMPLATE_OBJECT.channelID;
            document.getElementById("msg-create").innerHTML = 'Сохранить шаблон';
            document.getElementById("msg-create").setAttribute("action","edit")
            SET_PAGE('edit');
        }
    });
}
function showPreview(text){
    let format =toHTML(`${text}`);
    document.querySelector(".discord-message").innerHTML = format;
    document.querySelector(".background-popup").classList.remove("hidden");
    document.querySelector(".popup").classList.remove("hidden");
}

function hidePreview(){
    document.querySelector(".background-popup").classList.add("hidden");
    document.querySelector(".popup").classList.add("hidden");
}
window.addEventListener('DOMContentLoaded', () => {
    
    clk(".background-popup",hidePreview);

     Memory.get(MemoryTypes.Accounts,(res)=>{
        DATA.ACCOUNTS = res;
        loadData();
     })
     Memory.get(MemoryTypes.Messages,((res)=>{
        DATA.MESSAGES = res;
        loadMessages();
     }))
     clk("#msg-preview",()=>{
        let fst = new fstQ('#msg');
        showPreview(fst.v('message'));
     })
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
        if(document.getElementById("msg-create").getAttribute("action") == 'new'){
            if(IMClient.addTemplate(data)){
                loadMessages();
            }
        }
        else{
            if(IMClient.updateTemplate(data)){
                SET_PAGE("messages");
                loadMessages();
            }
        }
        
    });




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
