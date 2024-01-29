
async function inicializaEstado() {
	
	await window.sendDevice.writeValue(
              new TextEncoder().encode("GetStatus"))
}

function bleInit()
{
  window.connected = false;
  var uartTx =   '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
  var uartRx = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
  //var carUartTx
  //var carSsidPass
  let decoder = new TextDecoder('utf-8');
  let encoder = new TextEncoder('utf-8');
  console.log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: ['device_information', '6e400001-b5a3-f393-e0a9-e50e24dcca9e', ]})
  .then(device => {
    console.log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    console.log('Getting Device Information Service...');
    return server.getPrimaryService('6E400001-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase());
  })
  .then(service => {
  return Promise.all([
    service.getCharacteristic(uartTx)
      .then(characteristic => {
		myCharacteristic = characteristic;
		return myCharacteristic.startNotifications().then(_ => {
			console.log('> Notifications started');
			myCharacteristic.addEventListener('characteristicvaluechanged',
			handleNotifications);
	 
		});
	  }),
    service.getCharacteristic(uartRx)
      .then(carUartRx => {
		  window.sendDevice = carUartRx; 
		  window.connected = true;
		  alert("Connecção Estabelecida");
		  inicializaEstado();
		  document.getElementById("inicial").hidden = true;
		  document.getElementById("principal").hidden = false;
       })
    ]);
  });
 
}

function escreveBotoes(chave, valor) {
	console.log("Vou tratar: ", chave);
	var bloco = document.getElementById(chave);
	var botoes = bloco.getElementsByTagName("button");
	for (i = 0; i < botoes.length; i++) {
		if (valor[i] == "off") {
			botoes[i].classList.remove("btn-success");
			botoes[i].classList.add("btn-danger");
		} else {
			botoes[i].classList.remove("btn-danger");
			botoes[i].classList.add("btn-success");		
			
		}
	} 
	
}

function trataChave( chave, valor) {
	
  //console.log("Chave: "+chave+"\n");
  //console.log("Valor: "+valor+"\n");
  if (chave == "light" || chave == "pump" || chave == "fan") escreveBotoes(chave, valor); 
  else if (chave == "modo") {
	  console.log("Vou tratar o modo\n");
	  var getSelectedValue = document.querySelector( 'input[name="optradio"]:checked'); 
	  if (valor == "vegetal") {
		if (getSelectedValue == "vegetal") return;
		 // check flower
		 document.getElementById("flower").checked = false;
		 document.getElementById("vegetal").checked = true;
	  }  
	  if (valor == "flower") {
		if (getSelectedValue == "flower") return;
		 // check vegetal
		 document.getElementById("flower").checked = true;
		 document.getElementById("vegetal").checked = false;		 
	  }  
	  
	  
  }
	
}

function handleNotifications(event) {
  let value = event.target.value;
  decoder = new TextDecoder('utf-8')
  valor = decoder.decode(value);
  //console.log("Recebi:\n"+valor);
  var obj = JSON.parse(valor);
  trataChave(Object.keys(obj)[0], obj[Object.keys(obj)[0]]);
  
}


