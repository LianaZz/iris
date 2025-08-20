let temperatura = 0
let pulso = 0
let anterior = 0
let lectura = 0
let bpm = 0
let inicio = 0
let ultimoLatido = 0

radio.setGroup(1)
basic.showString("IRIS SENSOR")

// ---- BOTÓN A -> Medir Temperatura ----
input.onButtonPressed(Button.A, function () {
    dht11_dht22.queryData(
        DHTtype.DHT11,
        DigitalPin.P1,
        true,
        false,
        true
    )

    temperatura = dht11_dht22.readData(dataType.temperature)
    basic.showString("TEMP:")
    basic.showNumber(temperatura)

    // Enviar por radio
    radio.sendString("TEMP:" + temperatura)

    if (temperatura > 37.5) {
        radio.sendString("FIEBRE")
    } else {
        radio.sendString("TEMP OK")
    }
})

// ---- BOTÓN B -> Medir Pulso ----
input.onButtonPressed(Button.B, function () {
    pulso = 0
    anterior = 0
    inicio = input.runningTime()
    ultimoLatido = 0

    basic.showString("MIDIENDO")

    while (input.runningTime() - inicio < 5000) {
        lectura = pins.analogReadPin(AnalogPin.P0)

        // Detectar subida + filtrar latidos muy seguidos
        if (lectura > 600 && anterior <= 600) {
            if (input.runningTime() - ultimoLatido > 300) {
                pulso += 1
                ultimoLatido = input.runningTime()

                // 💓 Mostrar corazón cada vez que late
                basic.showIcon(IconNames.Heart)
                basic.pause(150)
                basic.clearScreen()
            }
        }
        anterior = lectura
        basic.pause(10)
    }

    // Calcular BPM
    bpm = pulso * 12
    basic.showString("BPM:")
    basic.showNumber(bpm)

    // Enviar por radio
    radio.sendString("BPM:" + bpm)
    if (bpm > 100) {
        radio.sendString("ALTO")
    } else if (bpm < 60) {
        radio.sendString("BAJO")
    } else {
        radio.sendString("NORMAL")
    }
})
