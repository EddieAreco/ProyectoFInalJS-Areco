// Selecciono elementos del DOM y declaro variables

const card = document.querySelector("#cardsProductos"); // Contenedor de productos en el DOM
const botonesAside = document.querySelectorAll(".boton-categoria"); // Botones de categoría
const tituloPrincipal = document.querySelector("#titulo-principal"); // Título principal de cada categoría
let botonesComprar = document.querySelectorAll(".comprar"); // Botones de compra en los productos
const numeroCarrito = document.querySelector("#numero-carrito"); // Número de productos en el carrito

let inputBusqueda = document.querySelector("#inputBusqueda");// Input de búsqueda para después filtrar los productos

let carrito; // Variable para almacenar el carrito de compras

// Obtener el carrito almacenado en el LocalStorage
let productosEnElCarritoEnLocalStorage = localStorage.getItem("productosEnCarrito");

let stockProducto = 0; // Variable para el stock de productos

let data; // Variable para almacenar los datos de productos

let productosFiltradosPorId; // Variable para almacenar productos filtrados por categoría

let filtrosPrecio = {}; // Objeto para almacenar productos filtrados por precio

const selectOrdenar = document.querySelector("#ordenarProductos"); // Acceso a etiqueta select para ordenar productos

const aplicarFiltro = document.querySelector("#aplicarFiltro"); // Botón para ejecutar los filtros

const limpiar = document.querySelector("#limpiar"); // Botón para limpiar los filtros elegidos

// Función para agregar productos al DOM
function agregarProductos(productosSeleccionados) {

    card.innerHTML = ""; // Limpiar el contenido existente en el contenedor

    // Iterar sobre los productos seleccionados y crear elementos HTML para cada uno que van a ser las cartas de productos que va a ver el usuario
    productosSeleccionados.forEach(producto => {
        const div = document.createElement("div");
        div.className = ("productos");
        // Estructura HTML de cada carta de producto
        div.innerHTML = `
            <img src="${producto.img}" class="w-75 rounded mx-auto my-auto d-block imagen-producto mb-3" alt="${producto.titulo}">
               <div class="tarjeta-producto row">
                 <h5 class="producto fw-bolder d-block col-10 mt-2">${producto.titulo}</h5>
                 <i id="${producto.id}" class="comprar bi bi-plus-square-fill col-1 mt-1 me-2 h4"></i>
                 <p class="precio fw-bolder d-block col-12">$ ${producto.precio}</p>
                 <small id="smallProducto_${producto.id}" class="mt-1 col-12">10% off pagando en efectivo</small>
                 <h6 id="textoSinStock_${producto.id}" class="text-center text-warning disabled">Producto no disponible</h6>
               </div>
        `;

        card.append(div); // Agrego el producto al contenedor
    });

    crearBotonesComprar(); // Llamo a la función para crear eventos en los botones de compra para que pueda comprar

}

// Función asincrónica para obtener datos de productos desde un archivo JSON que este caso sería data.json
async function traerPublicaciones() {
    const response = await fetch("./data/data.json");
    data = await response.json(); // Almaceno los datos en la variable 'data'

    // Verifico si hay un carrito en el localStorage
    productosEnElCarritoEnLocalStorage = localStorage.getItem("productosEnCarrito");

    // Verificar si hay datos de carrito en el LocalStorage
    if (productosEnElCarritoEnLocalStorage) {
        // Si hay datos, parsear y asignar al carrito
        carrito = JSON.parse(productosEnElCarritoEnLocalStorage);
    }

    // Actualizar el stock de los productos según el estado del carrito
    actualizarStockEnProductos();
    aumentarNumeroCarrito();

    agregarProductos(data); // Llamo a la función para agregar productos al DOM
}

traerPublicaciones(); // Llamo a la función para obtener datos al cargar la página

// Función para actualizar el stock de productos según el carrito
function actualizarStockEnProductos() {
    if (data && carrito) {
        // Iteración sobre los productos y actualizo el stock según el carrito
        data.forEach(producto => {
            // Verificar si el producto está en el carrito
            if (producto.id in carrito) {
                // Actualizar el stock del producto restando la cantidad en el carrito
                producto.stock -= carrito[producto.id].cantidad;
            }
        });
    }
}

// Verificar si la página actual es la página de inicio
const isIndexPage = window.location.pathname.includes("index.html");
if (isIndexPage) {
    // Llamo a la función para actualizar el stock solo en la página index.html
    actualizarStockEnProductos();
}

// Asignar eventos a los botones de categoría
botonesAside.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesAside.forEach(boton => {
            boton.classList.remove("active");

            e.currentTarget.classList.add("active");

            if (e.currentTarget.id !== "ofertas") {

                const tituloPrincipalPorCategoria = data.find(producto => producto.categoria.id === e.currentTarget.id);
                // Cambio el titulo segun la categoria en la que esté posicionado el usuario
                tituloPrincipal.innerText = tituloPrincipalPorCategoria.categoria.nombre;

                // Filtro productos por categoría
                productosFiltradosPorId = data.filter(producto => producto.categoria.id === e.currentTarget.id);
                // Agrego al DOM el resultado de los producto filtrados
                agregarProductos(productosFiltradosPorId);
            } else {
                // Filtro productos por precio para que aparezcan en la sección de ofertas
                productosFiltradosPorId = data.filter(producto => producto.precio <= 1000);
                tituloPrincipal.innerText = "Ofertas";
                // Agrego al DOM el resultado de los producto filtrados
                agregarProductos(productosFiltradosPorId);
            }
        });
    });
});

// Función para crear eventos en botones de compra
function crearBotonesComprar() {

    // Obtener botones de compra después de agregar productos al DOM
    botonesComprar = document.querySelectorAll(".comprar");

    botonesComprar.forEach(boton => {
        // Asignar eventos de click a los botones de compra
        boton.addEventListener("click", agregarProductoAlCarrito);
    });
}
// Verificar nuevamente si hay datos de carrito en el LocalStorage
if (productosEnElCarritoEnLocalStorage) {
    // Si hay datos, parsear y asignar al carrito
    carrito = JSON.parse(productosEnElCarritoEnLocalStorage);
    // Aumentar el número de productos en el carrito en la interfaz
    aumentarNumeroCarrito();
} else {
    // Si no hay datos, inicializar el carrito como un array vacío
    carrito = [];
}

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(e) {

    // Luego de clickear el botón de compra, le pido que almacene el id del producto clickeado
    const idParaCadaBoton = e.currentTarget.id;

    // Encontrar el producto correspondiente en los datos en base al id del producto
    const productoAgregadoAlCarrito = data.find(producto => producto.id === idParaCadaBoton);
    // Luego de encontrar el producto, le asigno el stock del mismo a stockProducto
    stockProducto = productoAgregadoAlCarrito.stock;

    // Obtener elementos HTML relacionados con el producto a los cuales luego voy a dejar dentro de la carta de producto o remover
    const smallProducto = document.getElementById(`smallProducto_${idParaCadaBoton}`);
    const textoSinStock = document.getElementById(`textoSinStock_${idParaCadaBoton}`);
    const botonesComprar = e.currentTarget;

    // Verificar si hay stock disponible
    if (stockProducto !== 0) {
        // Verificar si el producto ya está en el carrito
        if (carrito.some(producto => producto.id === idParaCadaBoton)) {
            //Verificar si el producto ya esta en el carrito según el id
            const indexDelCarrito = carrito.findIndex(producto => producto.id === idParaCadaBoton);
            // Incrementar la cantidad del producto en el carrito en caso que esté
            carrito[indexDelCarrito].cantidad++;
            productoAgregadoAlCarrito.stock = productoAgregadoAlCarrito.stock - 1;
            // Actualizar el stock
            stockProducto = productoAgregadoAlCarrito.stock;

            // Mostrar tostada de producto agregado al carrito
            Toastify({
                text: `${productoAgregadoAlCarrito.titulo} fue agregado al carrito`,
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "var(--clr-mainlight)",
                    borderRadius: "2rem",
                },
                offset: {
                    x: `.6rem`,
                    y: `2.5rem`
                },
                onClick: function () { }
            }).showToast();

            actualizarStockEnProductos();

        } else {
            // Le agrego la propiedad cantidad al producto agregado al producto
            productoAgregadoAlCarrito.cantidad = 1;
            productoAgregadoAlCarrito.stock = productoAgregadoAlCarrito.stock - 1;
            // Actualizar el stock
            stockProducto = productoAgregadoAlCarrito.stock;
            // Agregar nuevo producto al carrito si es que no está almacenado
            carrito.push(productoAgregadoAlCarrito);

            // Mostrar tostada de producto agregado al carrito
            Toastify({
                text: `${productoAgregadoAlCarrito.titulo} fue agregado al carrito`,
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "var(--clr-mainlight)",
                    borderRadius: "2rem",
                },
                offset: {
                    x: `.6rem`,
                    y: `2.5rem`
                },
                onClick: function () { }
            }).showToast();

        }

    } else {
        // En caso que el stock sea 0, desactivo elementos relacionados con el producto sin stock y que se muestre producto no disponible
        smallProducto.classList.add("disabled");
        textoSinStock.classList.remove("disabled");
        botonesComprar.classList.add("disabled");

        // Debido a que el stock es 0, le aviso al usuario que el producto no se agregó al carrito
        Toastify({
            text: `${productoAgregadoAlCarrito.titulo} NO fue agregado al carrito`,
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "var(--clr-red)",
                borderRadius: "2rem",
            },
            offset: {
                x: `.6rem`,
                y: `2.5rem`
            },
            onClick: function () { }
        }).showToast();

        actualizarStockEnProductos();
    }

    aumentarNumeroCarrito(); // Actualizar el número de productos en el carrito

    actualizarStockEnProductos(); // Actualizar el stock de productos

    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito)); // Almacenar el carrito en el LocalStorage
}

// Función para aumentar el número de productos en el carrito
function aumentarNumeroCarrito() {
    // Obtener el elemento del número de productos en el carrito en el DOM
    let numeroCarrito = document.querySelector("#numero-carrito");

    // Verifico si existe un carrito
    if (carrito) {
        // Si hay un carrito, calculo el número total de productos sumando las cantidades de cada producto en el carrito
        let numero = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);

        // Actualizar el contenido del elemento en el DOM con el número calculado
        numeroCarrito.innerHTML = numero;
    }
}

// Creación del evento de búsqueda de productos
inputBusqueda.addEventListener("input", () => {

    // Le asigno a una variable el valor que se introduzca en el input
    const valorBusqueda = inputBusqueda.value.toLowerCase();

    // Accedo a todos los productos dentro del contenedor de nombre productos
    const buscarProductos = document.querySelectorAll(".productos");

    // Itero sobre todos los productos para luego proceder a la búsqueda
    buscarProductos.forEach(producto => {

        const nombreProducto = producto.querySelector(".producto").textContent.toLowerCase();;

        // COMPRUEBO SI EL NOMBRE DEL PRODUCTO CONTIENEN EL VALOR DE BUSQUEDA Y SINO NO ESTA, QUE OCULTE EL PRODUCTO
        if (nombreProducto.includes(valorBusqueda)) {
            producto.style.display = "block"; // Muestro el producto
        } else {
            producto.style.display = "none"; // Oculto el producto
        }
    });
});

// Aplicar eventos relacionados con el filtro de productos
aplicarFiltro.addEventListener("click", filtrar);

// Función para aplicar filtros a los productos
function filtrar() {

    // Obtiene el valor seleccionado en la etiqueta select
    const valorSeleccionado = selectOrdenar.value;

    // Le pido a productoFiltrados que almacene todos los productos de data
    let productosFiltrados = [...data];

    // Aplicar filtro de categoría si está definido para que si pido el filtrado, se haga sobre los productos que ya están filtados por categoría
    if (productosFiltradosPorId) {
        productosFiltrados = productosFiltradosPorId;
    } else{
        productosFiltrados = [...data];
    }

    // Filtrar por precio mínimo si está definido
    if (filtrosPrecio.minimo !== undefined) {
        productosFiltrados = productosFiltrados.filter(producto => producto.precio >= filtrosPrecio.minimo);
        // Dentro de dicho precio, le pido que los ordene del mas barato al mas caro
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    }

    // Filtrar por precio máximo si está definido
    if (filtrosPrecio.maximo !== undefined) {
        productosFiltrados = productosFiltrados.filter(producto => producto.precio <= filtrosPrecio.maximo);
        // Dentro de dicho precio, le pido que los ordene del mas barato al mas caro
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    }

    // Obtiene los productos ordenados según el filtro seleccionado
    const productosOrdenados = ordenarProductos(productosFiltrados, valorSeleccionado);

    // Actualiza la visualización de los productos
    card.innerHTML = "";

    agregarProductos(productosOrdenados);
}

// Función para ordenar productos según criterio seleccionado
function ordenarProductos(data, tipoOrden) {
    const productosOrdenados = [...data];

    switch (tipoOrden) {
        case "nombre-AZ":
            productosOrdenados.sort((a, b) => (a.titulo < b.titulo ? -1 : 1));
            break;
        case "nombre-ZA":
            productosOrdenados.sort((a, b) => (a.titulo > b.titulo ? -1 : 1));
            break;
        case "precio-ascendente":
            productosOrdenados.sort((a, b) => a.precio - b.precio);
            break;
        case "precio-descendente":
            productosOrdenados.sort((a, b) => b.precio - a.precio);
            break;
        default:
            // Por defecto, no se realiza ningún ordenamiento
            break;
    }

    return productosOrdenados;
}

// Agregar evento relacionado con el botón de limpiar filtros

limpiar.addEventListener("click", () => {
    // Vacío todos los filtros realizados y se vuelven a mostrar los productos de la base data
    card.innerHTML = "";
    precioMaximo.value = "";
    precioMinimo.value = "";
    selectOrdenar.value = "";
    inputBusqueda.value = "";
    agregarProductos(data);
})

// Obtener elementos HTML relacionados con el rango de precios
const precioMaximo = document.querySelector("#precioMaximo");
const precioMinimo = document.querySelector("#precioMinimo");

// Eventos de entrada en los campos de precio
precioMaximo.addEventListener("input", mostrarProductosPorPrecioMaximo);
precioMinimo.addEventListener("input", mostrarProductosPorPrecioMinimo);

// Función para actualizar el filtro de precio máximo
function mostrarProductosPorPrecioMaximo() {
    const valorInputPrecioMaximo = precioMaximo.value;
    filtrosPrecio.maximo = valorInputPrecioMaximo;
}

// Función para actualizar el filtro de precio mínimo
function mostrarProductosPorPrecioMinimo() {
    const valorInputPrecioMinimo = precioMinimo.value;
    filtrosPrecio.minimo = valorInputPrecioMinimo;
}



