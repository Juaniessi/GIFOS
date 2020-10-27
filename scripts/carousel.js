let carousel = document.querySelector(".carousel");
if (localStorage.getItem("favGifs") === null){
    localStorage.setItem("favGifs", "[]");
}

async function doSearchTrending(){ //función que hace la búsqueda de los gif en trending
    try {
        const resp = await fetch(`https://api.giphy.com/v1/gifs/trending?&api_key=${apiKey}&limit=10`);
        const respParsed = await resp.json();

        respParsed.data.forEach(gif=>{    //recorre el array completo y llena las tarjetas "n" veces con fillinfGifCard
            fillingGifCard(gif, carousel)}
            ) 
    } catch (error) {
        console.log(error);
    }
};

doSearchTrending();

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