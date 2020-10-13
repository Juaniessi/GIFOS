let [stage1, stage2, stage3] = Array.from(document.querySelectorAll("span.number"));
let startBtn = document.getElementById("start-btn");
let video = document.getElementById("gif-capture");
let createTitle = document.getElementById("create-title");
let crSubTitle = document.getElementById("create-subtitle");
let counter = document.getElementById("counter");
let reDoButton = counter.children[0];
let myGifosArray = JSON.parse(localStorage.getItem("myGifos"));

if (myGifosArray === null){
	myGifosArray = [];
}

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
		setTimer(); //ver que onda con este timer
	});
	
	counter.classList.add("counter");
	counter.classList.remove("hidden");
	reDoButton.textContent	 = "00:00:00"
	startBtn.textContent = "FINALIZAR";
	stageCont++;
}

function fourthStage() {
	//Agregar evento para repetir captura y
	//Resetear todos los botones al estado correspondiente
	recorder.stopRecording(onStop);
	
	gif = recorder.getBlob();

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

	console.log(data.data);

	myGifosArray.push(data.data.id);

	localStorage.setItem('myGifos', JSON.stringify(myGifosArray));

	counter.classList.add("hidden");
	counter.classList.remove("counter");
	startBtn.classList.add("hidden");
	stage2.classList.remove("isCurrent");
	stage3.classList.add("isCurrent");
}

function onStop() {
	//Generar el archivo para subir
	console.log('Supercalifragilisticuespialidoso');
}


//cambiar imagen a checked
function cambiarACheckd (){
	let imagenDeCarga = document.querySelector(".girar");
	imagenDeCarga.setAttribute("src", "img/check.svg");
	imagenDeCarga.style.animation="none";
}; 


//función que coloca icono de upload
async function awaitUploadAnimation(){
	createOverlay = document.querySelector("#create-overlay");
	createOverlay.classList.remove("hidden");
	createOverlay.classList.add("create-overlay");


//creamos el titulo
//creamos la imagen
}

// Timer para el grabador

let s = 0;
let stoppedFlag = false;

let timerSet = setInterval(setTimer, 1000);

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

let gifosString = myGifosArray.toString();
let ctnOfMyGifos = document.getElementById("ctnOfMyGifos");

//(`https://api.giphy.com/v1/gifs/${gifosString}?&api_key=${apiKey}`)

async function doSearchMyGifs(gifosString){ //función que hace la búsqueda
    try {
        if (myGifosArray.length == 1){
			const resp = await fetch(`https://api.giphy.com/v1/gifs/${gifosString}?&api_key=${apiKey}`);
			const respParsed = await resp.json();
			respParsed.data.forEach( gif=>{    
				fillingGifCardMygifos(gif, ctnOfMyGifos)}
				) 
		}else if(myGifosArray.length > 1){
			const resp = await fetch(`https://api.giphy.com/v1/gifs?ids=${gifosString}?&api_key=${apiKey}`);
			const respParsed = await resp.json();+
			respParsed.data.forEach( gif=>{    
				fillingGifCardMyGifos(gif, ctnOfMyGifos)}
				) 
		}
        
    } catch (error) {
        console.log(error);
    }
};

doSearchMyGifs(gifosString);

function fillingGifCardMyGifos(gif, contenedor){ 
    
    let gifCardTemplateClone= gifCardTemplate.cloneNode(true);

    let trueGif = gifCardTemplateClone.children[1].children[0];
    trueGif.src=gif.images.fixed_height.url; //gif es el data[x]

    let gifAlt = gifCardTemplateClone.children[1].children[0];
    gifAlt.alt=gif.title;

    let gifTitle = gifCardTemplateClone.children[0].children[0];
    gifTitle.textContent=gif.title;

    let gifUserName = gifCardTemplateClone.children[0].children[1];
    gifUserName.textContent=gif.username;

    //FALTA HACER EVENT LISTENERS
	let gifErase = gifCardTemplateClone.children[2].children[0].children[0];
	gifErase.classList.remove("fa-heart");
	gifErase.classList.add("fa-trash-alt");
    gifErase.id = gif.id; //le meto como id el id del gif
    gifErase.addEventListener("click", addToFavourites);

    let gifDownload = gifCardTemplateClone.children[2].children[1];
    let gifExpand = gifCardTemplateClone.children[2].children[2];
    //FALTA BANDA, SEGUIR... Seguir más
    
    contenedor.appendChild(gifCardTemplateClone);
};