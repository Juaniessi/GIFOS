
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

  }
  else if(document.documentElement.getAttribute("data-theme")=="dark")
  {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleLink.textContent="Modo Nocturno";
  }
    
};

let trans = () => {
  document.documentElement.classList.add("themeTransition");
  window.setTimeout( () => {
    document.documentElement.classList.remove("themeTransition")
  }, 500)
}
