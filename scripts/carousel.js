let carousel = document.querySelector(".carousel");

async function doSearchTrending(){ //función que hace la búsqueda de los gif en trending
    try {
        const resp = await fetch(`https://api.giphy.com/v1/gifs/trending?&api_key=${apiKey}&limit=10`);
        const respParsed = await resp.json();

        respParsed.data.forEach(gif=>{    //recorre el array completo y llena las tarjetas "n" veces con fillinfGifCard
            fillingGifCardTrend(gif, carousel)}
            ) 
    } catch (error) {
        console.log(error);
    }
};

doSearchTrending();

//función que rellena las tyerjetas de gifs clonando el nodo

function fillingGifCardTrend(gif, contenedor){ 
    
    let gifCardTemplateClone= gifCardTemplate.cloneNode(true);

    let trueGif = gifCardTemplateClone.children[0];
    trueGif.src=gif.images.fixed_height.url; //gif es el data[x]

    let gifAlt = gifCardTemplateClone.children[0];
    gifAlt.alt=gif.title;

    let gifTitle = gifCardTemplateClone.children[1].children[0].children[0];
    gifTitle.textContent=gif.title;

    let gifUserName = gifCardTemplateClone.children[1].children[0].children[1];
    gifUserName.textContent=gif.username;

    //FALTA HACER EVENT LISTENERS
    let gifFav = gifCardTemplateClone.children[1].children[1].children[0];
    gifFav.id = gif.id; //le meto como id el id del gif
    gifFav.addEventListener("click", addToFavourites);

    let gifDownload = gifCardTemplateClone.children[1].children[1].children[1];
    let gifExpandIcon = gifCardTemplateClone.children[1].children[1].children[2];
    gifExpandIcon.addEventListener('click', () => {
        fullscreenView();
        gifExpandIcon.classList.add('hidden');
    });
    gifCardTemplateClone.addEventListener('click', fullscreenView);
    //FALTA BANDA, SEGUIR... Seguir más
    
    contenedor.appendChild(gifCardTemplateClone);
};


//botones de movimiento
let carrouselScroll = 0;
let carouselWraper = document.getElementById("carouselWraper");
let leftBtn = document.getElementById("leftBtn");
let rightBtn = document.getElementById("rightBtn");

leftBtn.addEventListener("mousedown", () => {
    carrouselScroll = (carrouselScroll < -180) ? carrouselScroll + 180 : 0;
    carousel.style.marginLeft = `${carrouselScroll}px`;
});

rightBtn.addEventListener("mousedown", () => {
    const width = carousel.offsetWidth;
    const ctnWidth = carousel.parentElement.offsetWidth;
    carrouselScroll = (carrouselScroll > -(width - ctnWidth - 180)) ? carrouselScroll - 180 : -(width - ctnWidth);
    carousel.style.marginLeft = `${carrouselScroll}px`;
}
); 