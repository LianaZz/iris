let temperatura = 0
let pulso = 0
let anterior = 0
let inicio = 0
let lectura = 0
let bpm = 0

radio.setGroup(1)
basic.showString("IRIS SENSOR")

// --- BOTÓN A: medir temperatura ---
input.onButtonPressed(Button.A, function () {
    temperatura = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P1)
    basic.showString("TEMP:")
    basic.showNumber(temperatura)

    if (temperatura > 37) {
        radio.sendString("FIEBRE")
    } else {
        radio.sendString("TEMP OK")
    }
})

// --- BOTÓN B: medir pulso ---
input.onButtonPressed(Button.B, function () {
    pulso = 0
    anterior = 0
    inicio = input.runningTime()
    basic.showString("MIDIENDO")

    while (input.runningTime() - inicio < 5000) {
        lectura = pins.analogReadPin(AnalogPin.P0)
        if (lectura > 600 && anterior <= 600) {
            pulso += 1
        }
        anterior = lectura
        basic.pause(10)
    }

    bpm = pulso * 12
    basic.showString("BPM:")
    basic.showNumber(bpm)

    if (bpm > 100) {
        radio.sendString("ALTO")
    } else if (bpm < 60) {
        radio.sendString("BAJO")
    } else {
        radio.sendString("NORMAL")
    }
})
