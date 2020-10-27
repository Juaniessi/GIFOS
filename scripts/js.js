const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

//variables de todas las secciones

let intro = document.getElementById("intro");
let id = document.getElementById("searchTitleResult");
let trending = document.getElementById("trending");
let recordGif = document.getElementById("recordGif");
let searchResult = document.getElementById("searchTitleResult");

//Barra de busqueda

let searchBar = document.getElementById("search-bar");
let searchBarCtn = document.getElementById("searchbarctn");

searchBar.addEventListener("keyup", autoCompletar); //al levantarse la tecla, llama a la función que busca el auto completado.

let contenedorDeSugerencias = document.getElementById("sugestionCtn"); 

async function autoCompletar(){
    
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search/tags?q=${this.value}&api_key=${apiKey}`);
            const sugerencias = await response.json();
            
            contenedorDeSugerencias.innerHTML="";

            sugerencias.data.forEach(element => { //vamos a crear un DIV y meterle adentro la imagen y el parrafo. Atención! esto agrega un id al cual hacemos referencia directamente en la hoja de estilos.
                
                let divDeSugerencias = document.createElement("div");
                divDeSugerencias.id="divDeSugerencias";
                contenedorDeSugerencias.appendChild(divDeSugerencias);
                
                let sugestionImg = document.createElement("img");
                sugestionImg.setAttribute("src","img/icon-search-active.svg");
                sugestionImg.style.width="1.25rem";
                divDeSugerencias.appendChild(sugestionImg);
                
                let sugestion = element.name; //buscamos las sugerencias una por una
                let palabraSugerida = document.createElement("p");
                divDeSugerencias.appendChild(palabraSugerida);
                palabraSugerida.textContent=sugestion;
                palabraSugerida.addEventListener("mousedown", ()=> { //agregamos evento click a la barra
                    searchBar.value=sugestion; //llenamos la barra de busqueda
                    cantClicks=0; //reiniico la cantidad de clicks para el boton "ver mas"
                    doSearch(searchBar.value);
                });
            });
        } catch (error) {
            console.log(error);
        }
};

//Función de buscar, sale con fritas

let gifCardTemplate = document.getElementById("gifCardTemplate").content.firstElementChild; //me traigo el articulo completo dentro del template
let ctnOfGif = document.getElementById("ctnOfGif");
let cantClicks = 0;


async function doSearch(search){ //función que hace la búsqueda
    try {
        let offset = 12*cantClicks;
        const resp = await fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}&limit=${12}&offset=${offset}`); //ver el limit, esta en 12
        const respParsed = await resp.json();
        
        if (cantClicks===0){
        ctnOfGif.textContent = "";
        };
        let ctnTitle = document.getElementById("searchTitle");
        ctnTitle.textContent = searchBar.value;

        searchResult.classList.remove("hidden"); //muestro la sección
        moreBtn.classList.remove("hidden");
        respParsed.data.forEach( gif=>{    //recorre el array completo y llena las tarjetas "n" veces con fillinfGifCard
            fillingGifCard(gif, ctnOfGif)}
            ) 
    } catch (error) {
        console.log(error);
    }
};

//función que rellena las tyerjetas de gifs clonando el nodo

function fillingGifCard(gif, contenedor){ 
    
    let gifCardTemplateClone= gifCardTemplate.cloneNode(true);

    let trueGif = gifCardTemplateClone.children[0];
    trueGif.src=gif.images.fixed_height.url; //gif es el data[x]

    let gifAlt = gifCardTemplateClone.children[0];
    gifAlt.alt=gif.title;

    let gifTitle = gifCardTemplateClone.children[1].children[0].children[0];
    gifTitle.textContent=gif.title;

    let gifUserName = gifCardTemplateClone.children[1].children[0].children[1];
    gifUserName.textContent=gif.username;

    //EVENT LISTENERS
    let gifFav = gifCardTemplateClone.children[1].children[1].children[0].children[0];
    gifFav.id = gif.id; //le meto como id el id del gif
    if (contenedor.classList.contains("ctnOfMyGifos")) { //El primer botón permitirá agregar/borrar favorito.
		gifFav.classList.remove("fa-heart");
		gifFav.classList.add("fa-trash-alt");
		gifFav.addEventListener("click", deleteMyGifo);
	} else { //El primer botón permitirá eliminar un gif de "Mis gifos".
        const favorites = JSON.parse(localStorage.getItem("favGifs")); //voy a localStorage y busco la lista de favoritos
        if (favorites.includes(gif.id)) {
	    		gifFav.classList.remove("far");
	    		gifFav.classList.add("fas");
	    	}
	    gifFav.addEventListener("click", addToFavourites);    
	}

    let gifDownload = gifCardTemplateClone.children[1].children[1].children[1];
    gifDownload.addEventListener("click", downloadGif);

    let gifExpandIcon = gifCardTemplateClone.children[1].children[1].children[2];
    gifExpandIcon.addEventListener('click', fullscreenView);       
    
    trueGif.addEventListener('click', fullscreenView);
    
    contenedor.appendChild(gifCardTemplateClone);
};

//Dar vuelta los iconos

let lupasearch = document.getElementById("contenedorBusquedas");
let imgClose = document.getElementById("cerrarBusqueda");
let imgLupa = document.getElementById("lupaDeBusqueda");
let traerImput = document.getElementById("search-bar");

searchBar.addEventListener("focusin", iconSwitch);
searchBar.addEventListener("focusout", iconUnSwitch);

//función para cuando hago click adentro de la barra
function iconSwitch(){
    lupasearch.style.flexDirection="row-reverse";
    imgClose.style.display="flex";
}

//función para cuando hago click afuera de la barra
function iconUnSwitch(){
    lupasearch.style.flexDirection="row";
    imgClose.style.display="none";
    contenedorDeSugerencias.innerHTML="";
}

//evento para auto compeltar con las sugerencias

//Agrego las secciones de trending más buscadas

let textTrending = document.getElementById("trendingWords"); //me traigo el p de trending

async function getTrendingTopics() {
    try {
        const response = await fetch(`https://api.giphy.com/v1/trending/searches?&api_key=${apiKey}`);
        let text = await response.json();        
        text.data.splice(5,20); //le quitamos las ultimas 15 a data        
        /* textTrending.textContent = text.data.join(", "); //metemos el texto y separamos el texto */
        text.data.forEach(trendingWord => {
            let spanCreado = document.createElement("span");
            
            if (trendingWord==text.data[text.data.length-1]) //saca la coma al ultimo elemento
            spanCreado.textContent = trendingWord;
            else{
                spanCreado.textContent = `${trendingWord}, `; //pone comas a todos los elementos
            }

            //click a los trendings
            textTrending.appendChild(spanCreado);
            spanCreado.addEventListener("click", ()=>{
            searchBar.value = trendingWord;
            cantClicks=0; //reseteo el contador para el ver mas
            doSearch(trendingWord);
                } 
            )
        })
        
    } catch (error) {
        console.log(error);
    }
}

getTrendingTopics();

//borrar busqueda

imgClose.addEventListener('mousedown', function() { //usar mouse down porque hay un focus con lso switches
    searchBar.value="";
    /* searchBar.style.display="initial"; */
    contenedorDeSugerencias.innerHTML="";
  });

//tocar enter para buscar

searchBar.addEventListener("keyup", (e)=>{
if(e.keyCode===13 || e.keyCode===9){ //9 es para el enter de los teclados swiftkey de android
    cantClicks=0; //reseteo el contador de clicks para el ver mas
    doSearch(searchBar.value);
    }
});


//evento al boton "ver mas"

let moreBtn = document.getElementById("moreBtn");
moreBtn.addEventListener("click", ()=>{
    cantClicks=cantClicks+1;
    doSearch(traerImput.value); //traerImput.value agarra el valor dentro de la barra de busqueda
});

//Agrandar la pantalla

function fullscreenView(e) {
    let gif = this.parentElement;
    console.log(this);
    if (gif.classList.contains("gifBtns")){
        gif=gif.parentElement.parentElement
    }

    if (!gif.classList.contains('fullscreenView')) {
        gif.classList.remove('gifArticle');
        gif.id = 'fullscreenView';
        let iconClose = document.createElement('i');
        iconClose.classList.add('fas', 'fa-times', 'closeBtn');
        iconClose.addEventListener('click', (e) => {
            let gif = e.target.parentElement;
            gif.id = "";
            gif.classList.add('gifArticle');
            iconClose.classList.add("hidden"); // hice esto proque el navegador no borra el botón aveces.
            iconClose.remove();
            e.stopPropagation();
        })
        gif.appendChild(iconClose);
    }
}

//funcion para descargar GIFS

async function downloadGif() {
	const a = document.createElement('a');
	const response = await fetch(this.parentElement.parentElement.parentElement.children[0].src);
	const file = await response.blob();
	a.download = `${this.dataset.title}.gif`;
	a.href = window.URL.createObjectURL(file);
	a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
	a.click()
}