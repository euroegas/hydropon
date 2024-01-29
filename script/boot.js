function onHourButtonClick() {
	//console.log(this.innerText);
	if (this.classList.contains('btn-danger')) {
		this.classList.remove("btn-danger");
		this.classList.add("btn-success");
	} else {
		this.classList.remove("btn-success");
		this.classList.add("btn-danger");		
	}

}

async function enviaAosBocados(pacotes){
	console.log("Vou iniciar envio de pacote");	
	for (i = 0; i < pacotes.length; i++) {
		await window.sendDevice.writeValue(
              new TextEncoder().encode(pacotes[i]))
	}
	await window.sendDevice.writeValue(
              new TextEncoder().encode("++++++++++"))	
	console.log("Terminei envio de pacote");	
}

function enviaStatus(data) {
	var chunksize = 20; //20 byte chunk
    var packetSize = Math.ceil( data.length / chunksize);
    var pacotes = new Array(packetSize); 	
	var start = 0;
	var end = 0;
	total = data.length;
	for(i = 0; i < packetSize; i++) {
		start = i*chunksize;
        end = start+chunksize;
		if (end > total) {
			end = total;
		}
		var pacote = data.substring(start, end);
		pacotes[i] = pacote;

    }
	enviaAosBocados(pacotes);
	
}

function onSendButtonClick() {
	var modo
	var estado = {};
	if (document.getElementById("vegetal").checked) {
			modo = "vegetal";
	} else {
		modo = "flower";
	}
	estado.modo = modo;
	var luz = Array(24).fill("off");
	var botoes = document.querySelectorAll('button.light');
	for (let i = 0; i < botoes.length; i++) {
		if (botoes[i].classList.contains("btn-success")) {
		  luz[i] = "on";
		}
	}
	estado.light = luz;
	
	var pump = Array(24).fill("off");
	botoes = document.querySelectorAll('button.pump');
	for (let i = 0; i < botoes.length; i++) {
		if (botoes[i].classList.contains("btn-success")) {
		  pump[i] = "on";
		}
	}
	estado.pump = pump;
	
	var fan = Array(24).fill("off");
	botoes = document.querySelectorAll('button.fan');
	for (let i = 0; i < botoes.length; i++) {
		if (botoes[i].classList.contains("btn-success")) {
		  fan[i] = "on";
		}
	}
	estado.fan = fan;	
	
	const currentDate = new Date();
	estado.date = currentDate;
	
	
	const estadoJSON = JSON.stringify(estado);
	enviaStatus(estadoJSON);
	
}
