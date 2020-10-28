let [stage1, stage2, stage3] = Array.from(document.querySelectorAll("span.number"));
let startBtn = document.getElementById("start-btn");
let video = document.getElementById("gif-capture");
let createTitle = document.getElementById("create-title");
let crSubTitle = document.getElementById("create-subtitle");
let counter = document.getElementById("counter");
let reDoButton = counter.children[0];
let gifBlob = null;
let myGifosArray = JSON.parse(localStorage.getItem("myGifos"));

if (myGifosArray === null){
	myGifosArray = [];
}

let favGifosArray = JSON.parse(localStorage.getItem("favGifs"));

if (favGifosArray === null){
	favGifosArray = [];
}

let favsCtn = document.getElementById("favsCtn");
let recorder;
let gif;

startBtn.addEventListener("click", recordProcess);
let stageCont = 0;

function recordProcess(){

	switch (stageCont) {
		case 0:
			firstStage();
			break;
		case 1:
			secondStage();
			break;
		case 2:
			thirdStage();
			break;
		case 3:
			fourthStage();
			break;
		case 4:
			fifthStage();
			break;
		default:
			break;
	}
}

function firstStage(){
	stage1.classList.add("isCurrent");
	startBtn.classList.add("hidden");
	createTitle.innerHTML = "¿Nos das acceso <br> a tu cámara?"
	crSubTitle.innerHTML = "El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO."

	navigator.getUserMedia = (navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia || 
	navigator.msGetUserMedia);
	
	navigator.getUserMedia ({
		video: true,
		audio: false
	},
	
	// successCallback
	function (localMediaStream) {
		video.srcObject = localMediaStream;
		stageCont++;
		recordProcess();
	},

// errorCallback
	function(err) {
		alert("Debes dar permiso para grabar");
		console.log("Ocurrió el siguiente error: " + err);
		stageCont = 0;

	});
}

function secondStage(){

	video.classList.remove("hidden");
	startBtn.classList.remove("hidden");
	startBtn.textContent = "GRABAR";
	createTitle.classList.add("hidden");
	crSubTitle.classList.add("hidden");
	stage1.classList.remove("isCurrent");
	stage2.classList.add("isCurrent");
	stageCont++;
}

function thirdStage(){
	// Iniciar grabación

	navigator.mediaDevices.getUserMedia({
		video: true
	}).then(async function(stream) {
		recorder = RecordRTC(stream, {
			type: 'gif',
			frameRate: 1,
			quality: 10,
			width: 360,
			hidden: 240,
			onGifRecordingStarted: function() {
			 console.log('started')
			}
		});
		recorder.startRecording();
		stoppedFlag = false;
		timerSet = setInterval(setTimer, 1000); //arranca a correr el timer
	});
	
	counter.classList.add("counter");
	counter.classList.remove("hidden");

	startBtn.textContent = "FINALIZAR";
	stageCont++;
}

function fourthStage() {
	//Agregar evento para repetir captura y
	//Resetear todos los botones al estado correspondiente
	recorder.stopRecording(onStop);
	
	gif = recorder.getBlob();

	gifBlob = gif;

	startBtn.textContent = "SUBIR GIFO";
	reDoButton.textContent = "REPETIR CAPTURA";
	reDoButton.classList.add("special-hover");
	
	reDoButton.addEventListener('click', () => {
		stageCont = 1;
		reDoButton.classList.remove('special-hover');
		counter.classList.add("hidden");
		reDoButton.textContent = '';
		recordProcess();
	})

	stageCont++;

}

async function fifthStage() {

	awaitUploadAnimation();
	
	let form = new FormData();
	form.append('file', gif, 'newGif.gif');

	let resp = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
		method: 'POST',
		body: form,
		json: true
});
	let data = await resp.json();

	cambiarACheckd ();

	myGifosArray.push(data.data.id);

	localStorage.setItem('myGifos', JSON.stringify(myGifosArray));

	counter.classList.add("hidden");
	counter.classList.remove("counter");
	startBtn.classList.add("hidden");
	stage2.classList.remove("isCurrent");
	stage3.classList.add("isCurrent");

	//descargar gifo recien creado
	
	let downloadMyGif = document.getElementById("gifDownload");
	downloadMyGif.addEventListener("click", downloadCreatedGif);
}

function onStop() {
	//Generar el archivo para subir
	stoppedFlag = true;
}

//cambiar imagen a checked


function cambiarACheckd (){
	let imagenDeCarga = document.querySelector(".girar");
	imagenDeCarga.setAttribute("src", "img/check.svg");
	imagenDeCarga.style.animation="none";
	let btnUploaded = document.getElementById("btnUploaded");//me triago la botonera
	btnUploaded.classList.remove("hidden");
	btnUploaded.classList.add("btnUploaded");

}; 


//función que coloca icono de upload
async function awaitUploadAnimation(){
	createOverlay = document.querySelector("#create-overlay");
	createOverlay.classList.remove("hidden");
	createOverlay.classList.add("create-overlay");
}

// Timer para el grabador

let s = 0;
let stoppedFlag = false;
let timerSet = 0;

function setTimer() {
  if (stoppedFlag == true) {
    clearInterval(timerSet)
    s = 0;
  }
  else {
    let timeValue = new Date(s * 1000).toISOString().substr(11, 8)
    reDoButton.textContent = timeValue;
    s++;
  }
};

//sección mis GIFOS

let ctnOfMyGifos = document.getElementById("ctnOfMyGifos");
let emptyMessage = document.getElementById("emptyFavsSection"); //llamo a la sección favortios vacia
let emptyMessage2 = document.getElementById("emptyMygifos"); //llamo a la sección mis gifos vacia

//botones de ver más

let moreFavBtn = document.getElementById("moreFavBtn");
moreFavBtn.addEventListener("click", () => {doSearchMyGifs(favGifosArray, favsCtn, moreFavBtn)});

let moreMyGifBtn = document.getElementById("moreMyGifBtn");
moreMyGifBtn.addEventListener("click", () => {doSearchMyGifs(myGifosArray ,ctnOfMyGifos ,moreMyGifBtn)});

let contadorOfViewMore = 0

async function doSearchMyGifs(arrayDeGifs, container, button){ //función que hace la búsqueda	
	try {
		let arrayCortado = arrayDeGifs.slice(12*contadorOfViewMore, 12*contadorOfViewMore+12); //corto array de 12 en 12 y estringifico
		let gifosString = arrayCortado.toString(); 

		if (arrayDeGifs.length === 1){
			const resp = await fetch(`https://api.giphy.com/v1/gifs/${gifosString}?&api_key=${apiKey}`);
			const respParsed = await resp.json();
			const gif =respParsed.data;
			fillingGifCard(gif, container)
		}else if(arrayDeGifs.length > 1){
			const resp = await fetch(`https://api.giphy.com/v1/gifs?ids=${gifosString},?&api_key=${apiKey}`);
			const respParsed = await resp.json();
			respParsed.data.forEach(gif=>{    
				fillingGifCard(gif, container)}
			)						
		}

		contadorOfViewMore++

        if(arrayDeGifs.length === 0 || arrayDeGifs === null) { // if para mostrar el mensaje de sección vacía
			emptyMessage.classList.remove("hidden");
			emptyMessage.classList.add("emptySection");
			emptyMessage2.classList.remove("hidden");
			emptyMessage2.classList.add("emptySection");
        }else{
			emptyMessage.classList.add("hidden");
			emptyMessage.classList.remove("emptySection");
			emptyMessage2.classList.add("hidden");
			emptyMessage2.classList.remove("emptySection");
		}
		if(arrayCortado.length < 12){ 
			button.classList.add('hidden');
		}else{
			button.classList.remove('hidden');
		}
    } catch (error) {
        console.log(error);
    }
};

//agregar a favoritos

function addToFavourites(){	
	favGifosArray.push(this.id);
	localStorage.setItem('favGifs', JSON.stringify(favGifosArray));
}

//borrar un gif creado por nosotros

function deleteMyGifo() {
	myGifosArray = myGifosArray.filter((gifo) => gifo != this.id);
	localStorage.setItem("myGifos", JSON.stringify(myGifosArray));
	const gifCard = this.parentElement.parentElement.parentElement.parentElement;
	removeGifCardFromDOM(gifCard);
}

//quitar un gif de la lista de favoritos o "mis gifos"

function removeGifCardFromDOM(gifCard) {
	const ctn = gifCard.parentElement.parentElement;
	if(!ctn.classList.contains("carousel-ctn") && !ctn.classList.contains("searchTitleResult")){ //no borrar si esta en el carousel
		gifCard.remove()
	};
	if (ctn.children.length === 0) {
		ctn.parentElement.classList.add("hidden");
		ctn.parentElement.nextElementSibling.classList.add("hidden");
	};
}

//quitar un gif de favoritos

function removeFromFav() {
	favGifosArray = favGifosArray.filter((gifo) => gifo != this.id);
	localStorage.setItem("favGifs", JSON.stringify(favGifosArray));
	const gifCard = this.parentElement.parentElement.parentElement.parentElement;
	removeGifCardFromDOM(gifCard);
}

//boton compartir de gifo creado

let shareBtn = document.getElementById("gifShare");
shareBtn.addEventListener("click", copyToClipboard);

function copyToClipboard() { //Copia al cortapapeles el link del gif en Giphy.	
	let gifoId = myGifosArray[myGifosArray.length-1]; //variable que es igual al id del ultimo gif creado
	var input = document.createElement('input');
	document.body.appendChild(input)
	input.value = `https://giphy.com/gifs/${gifoId}`;
	input.select();
	document.execCommand("copy");
	input.remove();
	alert("Link copiado al portapeles.");
  }

  //funcion para descargar GIFS recien creados

function downloadCreatedGif() {
	const a = document.createElement('a');
	const file = gifBlob;
	a.download = `${this.dataset.title}.gif`;
	a.href = window.URL.createObjectURL(file);
	a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
	a.click()
}

