// Traigo los productos en el carrito desde el almacenamiento local
let productosEnCarrito = localStorage.getItem("productosEnCarrito");

// Convierto la cadena JSON a un objeto JavaScript
productosEnCarrito = JSON.parse(productosEnCarrito);

// Elementos HTML del DOM
const carritoVacio = document.querySelector("#carritoVacio");
const carritoProducto = document.querySelector("#carritoProducto");
const carritoAcciones = document.querySelector("#carritoAcciones");
const botonVaciarCarrito = document.querySelector("#vaciarCarrito");
const totalCompra = document.querySelector("#total");
const botonComprar = document.querySelector("#comprar");

// Botones para eliminar productos del carrito
let botonesEliminarProducto = document.querySelectorAll(".carrito-producto-eliminar");

// Función que carga los productos comprados en el carrito
function cargaDeProductosComprados() {
    // Si hay productos en el carrito, entra en el condicional
    if (productosEnCarrito && productosEnCarrito.length != 0) {

        // Mostrar productos en el carrito y remover el menaje de carrito vacio
        carritoVacio.classList.add("disabled");
        carritoProducto.classList.remove("disabled");
        carritoAcciones.classList.remove("disabled");

        // Vacio el contenido del contenedor donde van a estar los productos del carrito
        carritoProducto.innerHTML = "";

        // Itero sobre los productos que están en el carrito
        productosEnCarrito.forEach(producto => {

            // Así como creo las cartas de productos en main.js, acá creo las cartas del carrito de los productos comprados
            const div = document.createElement("div");
            div.classList.add("carrito-producto");

            div.innerHTML = `
        <img class="carrito-producto-imagen" src="${producto.img}">
        <div class="carrito-producto-nombre">
            <small>titulo</small>
            <h3 class="fw-bold">${producto.titulo}</h3>
        </div>
        <div class="carrito-producto-cantidad">
            <small>Cantidad</small>
            <p>${producto.cantidad}</p>
        </div>
        <div class="carrito-producto-precio">
            <small>Precio </small>
            <p>$${producto.precio}</p>
        </div>
        <div class="cantidad-producto-subtotal">
            <small>Subtotal</small>
             <p>$${producto.precio * producto.cantidad}</p>
        </div>
        <button class="carrito-producto-eliminar" id="${producto.id}">
            <i class="bi bi-trash3-fill"></i>
        </button>
        `;

            carritoProducto.append(div); // Agrego el producto al contenedor
        });
    } else {

        // En caso que no haya productos en el carrito, mostrar mensaje de carrito vacío
        carritoVacio.classList.remove("disabled");
        carritoProducto.classList.add("disabled");
        carritoAcciones.classList.add("disabled");

    }

    // Llamo a la función que va a calcular el total de la compra
    totalPagar();

    // Actualizo los eventos de los botones eliminar producto (que sería el botón del tacho al final)
    actualizarBotonesEliminar();
};

// Llamo a la función para cargar productos comprados
cargaDeProductosComprados();

// Función que actualiza los eventos de los botones eliminar producto (que sería el botón del tacho al final)
function actualizarBotonesEliminar() {
    botonesEliminarProducto = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminarProducto.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Función que elimina un producto del carrito
function eliminarDelCarrito(e) {

    const idBoton = e.currentTarget.id;

    // indico que busque al producto por índice en base al id del producto
    const indexProductosEnCarrito = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    // Elimino el producto del arreglo de productos en el carrito que coincida con el id encontrado dentro del índice de productos encontrados
    productosEnCarrito.splice(indexProductosEnCarrito, 1);

    // Vuelvo a cargar los productos en el carrito
    cargaDeProductosComprados();

    // Actualizo el almacenamiento local con la nueva información del carrito
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
}

// Evento para vaciar todo el carrito
botonVaciarCarrito.addEventListener("click", VaciarCarrito);

// Función que vacía todo el carrito
function VaciarCarrito() {

    // Al hacer click sobre el botón, que se muestre un mensaje de advertencia
    Swal.fire({
        title: "Estás seguro?",
        text: "Una vez borrado, ya no podrás comprar los productos!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#eddddd",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero borrarlo"
    }).then((result) => {
        // En caso que quiero borrar el carrito
        if (result.isConfirmed) {
            Swal.fire({
                title: `Carrito Vaciado <i class="bi bi-emoji-frown"></i>`,
                icon: "success"
            });

            // Se borran todos los productos del carro y se sobre escribe los productos del almacenamiento local
            productosEnCarrito.length = 0;
            localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
            cargaDeProductosComprados();
        }
    });
}

// Función que calcula y muestra el total a pagar en el carrito
function totalPagar() {

    // Calculo el total de la compra en base a la suma del precio total de cada producto en el carrito
    let calculoDeLaCompra = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    // Que se muestre el total de la compra en la interfaz del usuario
    totalCompra.innerText = `$${calculoDeLaCompra}`;
}

// Agregar evento para realizar la compra final con todos los productos ya seleccionados
botonComprar.addEventListener("click", comprarCarrito);

// Función que simula el proceso de compra
function comprarCarrito() {

    // Calculo el total de la compra
    calculoDeLaCompra = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);

    // En caso que la compra supere los 35 mil, se muestra un mensaje de envío gratis y si no, sólo un mensaje de que la compra se hizo con éxito
    if (calculoDeLaCompra > 35000) {
        Swal.fire({
            position: "center",
            icon: "success",
            title: `<p class="text-success">Felicitaciones el envío es gratis! El monto total de $${calculoDeLaCompra}.<br>
            Gracias por su compra!</p><i class="bi bi-emoji-laughing"></i>`,
            footer: '<p class="text-primary fw-bold">Para más detalles revise su email</p>',
            showConfirmButton: false,
            timer: 4000
        });
    } else {
        Swal.fire({
            position: "center",
            icon: "success",
            title: `<p class="text-success">La venta se ha realizado con éxito por un monto total de $${calculoDeLaCompra}.<br>
        Gracias por su compra!</p><i class="bi bi-emoji-laughing"></i>`,
            footer: '<p class="text-primary fw-bold">Para más detalles revise su email</p>',
            showConfirmButton: false,
            timer: 4000
        })
    };

    // Vacio el carrito después de realizar la compra
    productosEnCarrito.length = 0;
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));

    // Actualizo la interfaz del carrito donde se vuelve a mostrar mensaje de carrito vacío
    carritoVacio.classList.remove("disabled");
    carritoProducto.classList.add("disabled");
    carritoAcciones.classList.add("disabled");
}