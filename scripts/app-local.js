let SELECTED_PAGE = 'messages';



function page(name){
  SELECTED_PAGE = name;
  document.querySelector(`[show="true"]`).setAttribute("show",false)
  document.querySelector(`.${name}`).setAttribute("show",true);
}

