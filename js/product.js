

let productoID = localStorage.getItem("content");
let productosArray = [];

let imagenCentral = document.getElementById("imagen-producto-grande");
let imagenMuestra1 = document.getElementById("imagen-muestra-1");
let imagenMuestra2 = document.getElementById("imagen-muestra-2");
let nombreProducto = document.getElementById("nombre-producto");
let precioProducto = document.getElementById("precio-producto");
let botonMas = document.getElementById("boton-mas");
let cantidadMostrar = document.getElementById("cantidad-mostrar");
let botonMenos = document.getElementById("boton-menos");
let botonAñadirCarrito = document.getElementById("boton-añadir-carrito");
let pestañaDescripcion = document.getElementById("pestaña-descripcion-producto");
let pestañaDetalle = document.getElementById("pestaña-detalle-producto");
let contenedorDetalleDescripcion = document.getElementById("contenedor-descripcion-detalle");


const fetchProductos = async () => {
    
    const resp = await fetch('../data/productos.json')
    const data = await resp.json();
    productosArray = data;
    //let productoBuscadoArr = productosArray.filter((el) => el.id == productoID);
    buscarProducto()
    console.log(productosArray);
    console.log(productoID);
    //console.log(productoBuscado);
    //buscarProducto();
}
window.onload = fetchProductos;


function llenarElementos ({title, price, description, details, images}) {
    nombreProducto.innerHTML = title;
    precioProducto.innerHTML = `$${price}`;
    contenedorDetalleDescripcion.innerHTML = description;
    pestañaDescripcion.onclick = () => {
        contenedorDetalleDescripcion.innerHTML = description;
    };
    pestañaDetalle.onclick = () => {
        contenedorDetalleDescripcion.innerHTML = details;
    };
    imagenCentral.src = `../assets/images/${images[0]}`;
    images[1] ? imagenMuestra1.src = `../assets/images/${images[1]}` : imagenMuestra1.style.display = "none";
    images[2] ? imagenMuestra2.src = `../assets/images/${images[2]}` : imagenMuestra2.style.display = "none";

    imagenMuestra1.onclick = () => {
        let cambioImg = imagenCentral.src;
        imagenCentral.src = imagenMuestra1.src;
        imagenMuestra1.src = cambioImg;
    }
}

function buscarProducto () {

    let productoBuscado = productosArray.filter((el) => el.id == productoID);
    let obj = productoBuscado[0];
    llenarElementos(obj);
}

