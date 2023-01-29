let SELECTED_PAGE = 'messages';



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

