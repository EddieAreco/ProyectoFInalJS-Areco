// Crear un mapa Leaflet con una vista centrada donde está la sucursal y un nivel de zoom inicial de 15
let map = L.map('map').setView([-31.434667427258436, -64.22360880344506], 15)

// Agrego una capa de OpenStreetMap al mapa para que el usuario pueda ver un estilo de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://wwww.openstreetmap.org/copyright">Openstreetmap</a> contributors'
}).addTo(map);
// VER SI PUEDO CAMBIAR EL TIPO O ESTILO DE MAPA (TILE)

// Creo un marcador en una ubicación específica que sería donde está ubicada la sucural y luego lo agrego al mapa
let marcador = L.marker([-31.434667427258436, -64.22360880344506]).addTo(map);

// Defino las coordenadas del área de zona de envío
let zonaDeEnvio = [
    [-31.440229, -64.223743],
    [-31.439507, -64.216551],
    [-31.433675, -64.215353],
    [-31.427285, -64.216587],
    [-31.425877, -64.21995],
    [-31.429056, -64.226818],
    [-31.436476, -64.228099]
];

// Convierto las coordenadas en una figura geométrica para que se pueda visualizar en el mapa y le configuro un color
const polygon = L.polygon(zonaDeEnvio,
    { color: 'orange' }
).addTo(map);


// Agrego unos mensajes especiales que aparezcan si el cliente clickea sobre el mapa
marcador.bindPopup("<b>Hola cliente!</b><br><h6>Esta es la ubicación del local</h6>");
polygon.bindPopup("<h6>Esta es la zona donde hacemos envios</h6>");

// Obtener el elemento del botón de búsqueda por dirección en el DOM
let busquedaDireccion = document.querySelector("#busquedaDireccion");
busquedaDireccion.addEventListener("click", geocodificarDireccion);

// Función para verificar si unas coordenadas están dentro de la zona de envío
function estaEnZonaDeEnvio(coordenadas) {

    // Utilizo la función de Leaflet para comprobar si las coordenadas están dentro del polígono
    // Se obtienen las coordenadas máximas y mínimas de la zona de envío para hacer la comprobación de estas con las coordenadas que ingrese el usuario

    const latitudZonaMinima = zonaDeEnvio.reduce((min, coord) => Math.min(min, coord[0]), Infinity);
    const latitudZonaMaxima = zonaDeEnvio.reduce((max, coord) => Math.max(max, coord[0]), -Infinity);
    const longitudZonaMinima = zonaDeEnvio.reduce((min, coord) => Math.min(min, coord[1]), Infinity);
    const longitudZonaMaxima = zonaDeEnvio.reduce((max, coord) => Math.max(max, coord[1]), -Infinity);

    // Coordenadas del cliente
    const latitudCliente = coordenadas[0];
    const longitudCliente = coordenadas[1];

    // Comparo las coordenadas del cliente a ver si están dentro de la zona de envío

    return (
        latitudCliente >= latitudZonaMinima &&
        latitudCliente <= latitudZonaMaxima &&
        longitudCliente >= longitudZonaMinima &&
        longitudCliente <= longitudZonaMaxima
    );
}

// Función que realiza la geocodificación de una dirección ingresada por el usuario a coordenadas
function geocodificarDireccion() {
    // Defino en una variable la dirección ingresada por el usuario desde el elemento de entrada en el DOM

    const direccion = document.getElementById("direccion").value;

    // Uso a la API de geocodificación de Google Maps
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': direccion }, function (results, status) {
        if (status === 'OK') {

            // Extraigo las coordenadas (latitud y longitud) de los resultados de geocodificación
            const latitud = results[0].geometry.location.lat();
            const longitud = results[0].geometry.location.lng();

            // Centro el mapa en las coordenadas obtenidas
            map.setView([latitud, longitud], 15);

            // Coloco un marcador en la posición de dirección ingresada por el cliente
            marcador.setLatLng([latitud, longitud]);

            // Comparo si las coordenadas que obtuvimos del domicilio del cliente están dentro de la zona de envío
            const estaEnZonaDeEnvioResultado = estaEnZonaDeEnvio([latitud, longitud]);

            // Muestra un mensaje según si está o no en la zona de envío
            if (estaEnZonaDeEnvioResultado) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `<p class="text-success">Su domicilio está dentro de nuestra zona de reparto!</p><i class="bi bi-emoji-laughing"></i>`,
                    showConfirmButton: false,
                    timer: 4000
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: '<p class="text-secundary">Lo sentimos, no hacemos envíos hasta ahí</p><i class="bi bi-emoji-frown"></i>',
                    footer: '<p class="text-primary fw-bold">Pero lo puedes retirar por nuestro local!</p>',
                    showConfirmButton: false,
                    timer: 5000
                });
            }

            // Muestra un mensaje si la dirección no fue encontrada
        } else {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: '<p class="text-secundary">Dirección no encontrada</p>',
                footer: '<p class="text-primary fw-bold">Vuelva a intentarlo</p>',
                showConfirmButton: false,
                timer: 5000
            });
        }
    });
}
