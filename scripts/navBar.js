//botton grabar

let createBtn = document.querySelector(".btnCrear");
createBtn.addEventListener("click", ()=>{
    intro.classList.add("hidden");
    id.classList.add("hidden");
    trending.classList.add("hidden");
    recordGif.classList.remove("hidden");
    favs.classList.add("hidden");
    searchResult.classList.add("hidden");
    seccionGifos.classList.add("hidden");
});

//botton mis GIFOS

let seccionGifos = document.getElementById("misGifos");

let misGifosBtn = document.getElementById("misGifosBtn");
misGifosBtn.addEventListener("click", ()=>{
    intro.classList.add("hidden");
    seccionGifos.classList.remove("hidden");
    trending.classList.remove("hidden");
    recordGif.classList.add("hidden");
    favs.classList.add("hidden");
    searchResult.classList.add("hidden");
    ctnOfMyGifos.innerHTML = "";
    contadorOfViewMore = 0;
    doSearchMyGifs(myGifosArray, ctnOfMyGifos, moreMyGifBtn);
});

//botton Favoritos

let seccionFavoritos = document.getElementById("favs");

let favoritosBtn = document.getElementById("favoritos");
favoritosBtn.addEventListener("click", ()=>{
    intro.classList.add("hidden");
    id.classList.add("hidden");
    trending.classList.remove("hidden");
    recordGif.classList.add("hidden");
    favs.classList.remove("hidden");
    searchResult.classList.add("hidden");
    seccionGifos.classList.add("hidden");
    favsCtn.innerHTML = "";
    contadorOfViewMore = 0;
    doSearchMyGifs(favGifosArray, favsCtn, moreFavBtn);
});

//volver al inicio
let logo = document.getElementById("loguito");
logo.addEventListener("click", ()=>{
    intro.classList.remove("hidden");
    id.classList.remove("hidden");
    trending.classList.remove("hidden");
    recordGif.classList.add("hidden");
    favs.classList.add("hidden");
    searchResult.classList.add("hidden");
    seccionGifos.classList.add("hidden");
} );