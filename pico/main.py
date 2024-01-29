# Import necessary modules
from machine import Pin, Timer
from time import sleep
import ws2812 as ws
import bluetooth
from ble_simple_peripheral import BLESimplePeripheral
import json
import machine
# SuperFastPython.com
# example of using a thread timer object
import _thread as thread
 
# target task function
def task(timer):
    #print(dict(statusJson))
    tempo = rtc.datetime()
    hora = tempo[4]
    luz = statusJson['light'][hora]
    pump = statusJson['pump'][hora]
    fan = statusJson['fan'][hora]
    modo = statusJson['modo']
    if luz == "on":
        if modo == "vegetal":
            cor = (0, 0, 128)
        else:
            cor = (128, 0, 0)
        ws.pixels_fill(cor)
        ws.pixels_show()
    else:
        cor = (0, 0, 0)
        ws.pixels_fill(cor)
        ws.pixels_show()
    if pump == "on":
        #print("Vou ligar a bomba\n")
        bomba.high()
    else:
        #print("Vou desligar a bomba\n")
        bomba.low()
    if fan == "on":
        #print("Vou ligar a ventoinha\n")
        ventoinha.high()
    else:
        #print("Vou desligar a ventoinha\n")
        ventoinha.low()
    

    
    

rtc = machine.RTC()
tempo = rtc.datetime()
print(tempo)
print("---------------------")

tupla = (2023, 2, 27, 5, 13, 23, 55, 0)
rtc.datetime(tupla)
tempo = rtc.datetime()
print(tempo)



tudo = ""

fileStatus = "fistatus.json"

defaultStatus = '{"modo":"vegetal","light":["off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off"],"pump":["off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off"],"fan":["off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off"],"date":"2024-01-26T15:39:10.555Z"}'



# Create a Bluetooth Low Energy (BLE) object
ble = bluetooth.BLE()

# Create an instance of the BLESimplePeripheral class with the BLE object
sp = BLESimplePeripheral(ble)

# Create a Pin object for the onboard LED, configure it as an output
led = Pin("LED", Pin.OUT)

# Initialize the LED state to 0 (off)
led_state = 0
led.value(led_state)

def sincroniza(estado):
    # Actualização do tempo muito importante actualizá-lo com o telemóvel
    print(estado.keys())
    data = estado['date']
    print(data)
    ano = int(data[:4])
    mes = int(data[5:7])
    dia = int(data[8:10])
    hora = int(data[11:13])
    minuto = int(data[14:16])
    segundo = int(data[17:19])
    #print("Data: {}  {} {} {} {} {}".format(ano, mes, dia, hora, minuto, segundo))
    tupla = (ano, mes, dia,0 , hora, minuto, segundo, 0)
    rtc.datetime(tupla)
    tempo = rtc.datetime()
    #print("E agora o tempo é:\n")
    print(tempo)

def executa(tudo):
    global statusJson
    print("Vou executar: ", tudo)
    with open(fileStatus, "w") as f:
            f.write(tudo)
            f.close()
    statusJson = json.loads(tudo)
    sincroniza(statusJson)

def sendStatus():
    global sp
    chaves = statusJson.keys()
    for chave in chaves:
      valor = json.dumps(statusJson[chave])
      mensagem = '{"'+chave+'":'+valor+"}"
      sp.send(mensagem)


# Define a callback function to handle received data
def on_rx(data):
    global sp
    global tudo
    global led_state
    #print("Data received with len: ", len(data))  # Print the received data
    #print("Data received: ", data)  # Print the received data
    global led_state  # Access the global variable led_state
    led.value(not led_state)  # Toggle the LED state (on/off)
    led_state = 1 - led_state  # Update the LED state
    if data == b'GetStatus':
        sendStatus()
    elif data == b'++++++++++':  # Check if the received data is "toggle"
        #print("\nTudo: ", tudo);
        executa(tudo)
        tudo = ""
        led.value(0)
        #sp.send("Sim chefe\r\n")
    else:
        tudo += data.decode('utf-8')
    

def inicializa():
    try:
        f = open(fileStatus, "r")
        varJson = json.load(f)
        f.close()
        return varJson
    except OSError:  # open failed
        print("Ficheiro de Estado não existe, vou criar default")
        with open(fileStatus, "w") as f:
            f.write(defaultStatus)
            f.close()
            return json.loads(defaultStatus)
    
    
    
statusJson = inicializa()
#Inicia o sistema
sincroniza(statusJson)
bomba = Pin(15, Pin.OUT)
ventoinha = Pin(16, Pin.OUT)
Timer().init(freq=0.5, mode=Timer.PERIODIC, callback=task)


while True:
    if sp.is_connected():  # Check if a BLE connection is established
        sp.on_write(on_rx)  # Set the callback function for data reception


        
        
