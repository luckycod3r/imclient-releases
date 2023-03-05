let SELECTED_PAGE = 'updates';

let updates = [
  {
    v : "release-build-1.0.0",
    i : "Пофикшены баги. Добавлена эта вкладка. Авто-обновления."
  }
]

document.addEventListener("DOMContentLoaded",()=>{
  for(let i in updates){
    let cont = document.createElement("div");
    cont.classList.add("update");
    cont.innerHTML = `
        <span class="update-version">${updates[i].v}</span>
        <p>${updates[i].i}</p>
    `
    document.querySelector(".updates-wrapper").append(cont)
    }
})

function page(name){
  SELECTED_PAGE = name;
  document.querySelector(`[show="true"]`).setAttribute("show",false)
  document.querySelector(`.${name}`).setAttribute("show",true);

  if(name === "edit"){
    let form = document.querySelector("#edit");
    form["name"].value = "";
    form["msgs"].value = "";
    form["time"].value = "";
    form["message"].value = "";
    form["cid"].value = "";
    document.getElementById("msg-create").setAttribute("action","new")
    document.getElementById("msg-create").innerHTML = 'Создать шаблон'
  }
}

