const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

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

async function doSearch(search){ //función qu ehace la búsqueda
    try {
        const resp = await fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}&limit=${12}`); //ver el limit, esta en 12
        const respParsed = await resp.json();
        console.log(respParsed);
        
        respParsed.data.forEach( gif=>{    //recorre el array completo y llena las tarjetas "n" veces con fillinfGifCard
            fillingGifCard(gif, ctnOfGif)}
            ) 
    } catch (error) {
        console.log(error);
    }
};

function fillingGifCard(gif, contenedor){ //función que rellena las tyerjetas de gifs clonando el nodo
    
    let gifCardTemplateClone= gifCardTemplate.cloneNode(true);

    let trueGif = gifCardTemplateClone.children[1];
    trueGif.src=gif.images.fixed_height.url; //gif es el data[x]

    let gifAlt = gifCardTemplateClone.children[1];
    gifAlt.alt=gif.title;

    let gifTitle = gifCardTemplateClone.children[0].children[0];
    gifTitle.textContent=gif.title;

    let gifUserName = gifCardTemplateClone.children[0].children[1];
    gifUserName.textContent=gif.username;

    //FALTA HACER EVENT LISTENERS
    let gifFav = gifCardTemplateClone.children[2].children[0];
    let gifDownload = gifCardTemplateClone.children[2].children[1];
    let gifExpand = gifCardTemplateClone.children[2].children[2];

    //FALTA BANDA, SEGUIR... Seguir más
    
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
    imgLupa.style.color="#9CAFC3"
}

//función para cuando hago click afuera de la barra
function iconUnSwitch(){
    lupasearch.style.flexDirection="row";
    imgClose.style.display="none";
    imgLupa.style.color="#572EE5"
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
        
        textTrending.textContent = text.data.join(", "); //metemos el texto y separamos el texto

    } catch (error) {
        console.log(error);
    }
}

getTrendingTopics();

