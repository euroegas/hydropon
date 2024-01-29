# hydropon
Project for Bluetooth Control of an hydroponic System

This project controls a small hydroponic system using a raspberry pi pico W. 

The pico microproccessor is controled from a web page (boot.html) over a bluetooth connection.

3 equipments can be controled:

- Light - ws 2812 addressable LEDs
- Pump
- Fan

  Each equipment can be programed to be on/off for the 24 hours of the day. The Light have two modes:
  - Vegetal - for growing phase
  - Flower - for fruit and flower phase
 
  Powering the System.

  If the equipments are low power feed them from VBUS (pin 40) and GND (pin 38), and use a power source for the Raspberry Pi Pico W taking in account the power needs of the equipment. If you feed separatelly the equipments (light, pump and fan), just interconnect the ground (pin 38).
  The lights are controlled by GP22 (pin 29)
  The pum is controled by GP15 (pin 20) - use a transistor like in https://electronics.stackexchange.com/questions/379729/choosing-a-transistor-for-my-raspberry-pi-5v-fan
  The fan is controlled bu GP16 (pin21) - use a transistor like in https://electronics.stackexchange.com/questions/379729/choosing-a-transistor-for-my-raspberry-pi-5v-fan

  Installation

- Install the firmware of your Raspberry Pi Pico as described in the site:

  https://projects.raspberrypi.org/en/projects/getting-started-with-the-pico/3

- in file pico/ws2812.py set the variable NUM_LEDS to the number of LEDS of your light system

- copy all files (python files) of the folder "pico" to the Raspberry Pi Pico W

- copy the files in the main folder to your local device, or to a web server.

Execution

With a browser supporting Bluetooth (all the recent browsers supports) open the file boot.html

Enjoy

