var fs = require('fs');
var txt = "N° Lugares 2 VNE 400 Km/h Envergadura 7,11 m Vel. Máxima 283 Km/h Comprimento 4,88 m Vel. Cruzeiro 253 Km/h Largura da cabine 0,97 m Vel. Estol c/ flape 56 Km/h Área alar 8,18 m2 Vel. Estol s/ flape 83 Km/h Alongamento 6,18 Razão de subida 4 m/s Perfis RAF-48 Dist. Decolagem 107 m Peso vazio 218 Kg Alcance Km Peso máximo 408 Kg Autonomia h Carga útil 190 Kg Motor VW 2100 III Carga alar máxima 49,88 Kg/m2 Potencia 65 hp Peso / Potencia 6,28 Kg/hp Material Mat. Composto "

var plane = {
    "name": "KR-2S",
    "seatCount": 0,
    "wingspan": 0,
    "length": 0,
    "cabinLength": 0,
    "wingArea": 0,
    "aspectRatio": 0,
    "weightEmpty": 0,
    "weightCargo": 0,
    "weightWingCargo": 0,
    "horsepower": 0,
    "VNE": 0,
    "speedMax": 0,
    "speedCruise": 0,
    "speedStallNoFlap": 0,
    "speedStallFlap": 0,
    "rateOfClimb": 0,
    "takeoffDistance": 0,
    "range": 0,
    "autonomy": 0,
    "motor": "VW 2100",
    "material": "composity"
}

var planeKeys = Object.keys(plane);

var i = 3;

var arr = txt.split(" ").forEach(function (item, index) {
    var number = parseFloat(item.replace(",", "."));
    if (!isNaN(number)) {
        if ((i + 1) % 2 == 0) {
            plane[planeKeys[Math.floor(i / 2)]] = number;
            i++;
        } else {
            //plane[planeKeys[Math.floor(i / 2) + Math.floor(planeKeys.length / 2)]] = number;
            i++;
        }
    }
});

fs.writeFileSync("planes.json", JSON.stringify(plane, null, 4));
