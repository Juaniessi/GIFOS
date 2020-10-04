let [stage1, stage2, stage3] = Array.from(document.querySelectorAll("span.number"));
let startBtn = document.getElementById("start-btn");
let video = document.getElementById("gif-capture");
let createTitle = document.getElementById("create-title");
let crSubTitle = document.getElementById("create-subtitle");
let counter = document.getElementById("counter")

startBtn.addEventListener("click", recordProcess);
let cont = 0;

function recordProcess(){

	switch (cont) {
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
		cont++;
		recordProcess();
	},

// errorCallback
	function(err) {
		alert("Debes dar permiso para grabar");
		console.log("Ocurrió el siguiente error: " + err);
		cont = 0;

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
	cont++;

}

function thirdStage(){
	// Iniciar grabación
	counter.classList.add("counter");
	counter.classList.remove("hidden");
	counter.children[0].textContent	 = "00:00:00"
	startBtn.textContent = "FINALIZAR";
	cont++;
}

function fourthStage() {
	//Agregar evento para repetir captura y
	//Resetear todos los botones al estado correspondiente
	startBtn.textContent = "SUBIR GIFO";
	counter.children[0].textContent = "REPETIR CAPTURA";
	counter.children[0].classList.add("special-hover");
	
	cont++;

}

function fifthStage() {
	counter.classList.add("hidden");
	counter.classList.remove("counter");
	startBtn.classList.add("hidden");
	stage2.classList.remove("isCurrent");
	stage3.classList.add("isCurrent");
}