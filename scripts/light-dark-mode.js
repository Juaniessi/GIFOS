
let themeToggleLink = document.querySelector("#modoNocturno");

let botonModoNoct = document.getElementById("checkbox");

themeToggleLink.addEventListener("click", (e) => themeToggler(e));

function themeToggler(e) {
  e.preventDefault();
  trans();
  
  // checkbox.checked=false; //decidir si lo implemnto, deberia cambiar imagenes por iconos de font awesome

  if(document.documentElement.getAttribute("data-theme")=="light")
  {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleLink.textContent="Modo Diurno";
    document.querySelector(".menubtn").setAttribute("src", "img/close-modo-noct.svg"); //cambio imagen a modo nocturno
    cambiarFotos();
  }
  else if(document.documentElement.getAttribute("data-theme")=="dark")
  {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleLink.textContent="Modo Nocturno";
    document.querySelector(".menubtn").setAttribute("src", "img/close.svg"); //cambio la imagen a modo diurno
    cambiarFotos();
  }
};

let trans = () => {
  document.documentElement.classList.add("themeTransition");
  window.setTimeout( () => {
    document.documentElement.classList.remove("themeTransition")
  }, 500)
}

// cambiar imagenes de menu hamburguesa en modo nocturno

document.querySelector(".menubtn").addEventListener("click", function () {
  if (this.getAttribute("src")=="img/close.svg" || this.getAttribute("src")=="img/close-modo-noct.svg")
  {
    if(document.documentElement.getAttribute("data-theme")=="light")
        this.setAttribute("src", "img/burger.svg");
    else
      this.setAttribute("src", "img/burger-modo-noct.svg");
  } else
  {
    if(document.documentElement.getAttribute("data-theme")=="light")
    this.setAttribute("src", "img/close.svg");
    else
      this.setAttribute("src", "img/close-modo-noct.svg");
  }
});

//cambiar iamgenes modo nocturno

function cambiarFotos() {

  let logo = document.getElementById("loguito");
  let camara = document.getElementById("camara");
  let rollo = document.getElementById("filmIcon");

  if (logo.src.match("img/logo-mobile-modo-noct.svg") || camara.src.match("img/camara-modo-noc.svg") || rollo.src.match("img/pelicula-modo-noc.svg")){
  logo.src="img/logo-mobile.svg";
  camara.src="img/camara.svg";
  rollo.src="img/pelicula.svg";
}else{
  logo.src="img/logo-mobile-modo-noct.svg";
  camara.src="img/camara-modo-noc.svg";
  rollo.src="img/pelicula-modo-noc.svg";
}
};