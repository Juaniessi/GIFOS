
let themeToggleLink = document.querySelector("#modoNocturno");

themeToggleLink.addEventListener("click", (e) => themeToggler(e));

console.log(themeToggleLink);

function themeToggler(e) {
  e.preventDefault();
  trans();
  if(document.documentElement.getAttribute("data-theme")=="light")
  {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleLink.textContent="Modo Diurno";
    document.querySelector(".menubtn").setAttribute("src", "img/close-modo-noct.svg"); //cambio imagen a modo nocturno
  }
  else if(document.documentElement.getAttribute("data-theme")=="dark")
  {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleLink.textContent="Modo Nocturno";
    document.querySelector(".menubtn").setAttribute("src", "img/close.svg"); //cambio la imagen a modo diurno
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