
//id de producto
let productoID = localStorage.getItem("content");

//Array global
let productosArray = [];

//Manejo de DOM
let imagenCentral = document.getElementById("imagen-producto-grande");
let imagenMuestra1 = document.getElementById("imagen-muestra-1");
let imagenMuestra2 = document.getElementById("imagen-muestra-2");
let nombreProducto = document.getElementById("nombre-producto");
let precioProducto = document.getElementById("precio-producto");
let botonMas = document.getElementById("boton-mas");
let cantidadMostrar = document.getElementById("cantidad-mostrar");
let botonMenos = document.getElementById("boton-menos");
let botonAñadirCarrito = document.getElementById("boton-añadir-carrito1");
let pestañaDescripcion = document.getElementById("pestaña-descripcion-producto");
let pestañaDetalle = document.getElementById("pestaña-detalle-producto");
let contenedorDetalleDescripcion = document.getElementById("contenedor-descripcion-detalle");
let productRel1 = document.getElementById("card-relacionados-1");
let productRel2 = document.getElementById("card-relacionados-2");


//Función para traer la info de productos
const fetchProductos = async () => {
    const resp = await fetch('../data/producto.json')
    const data = await resp.json();
    productosArray = data;
    buscarProducto()
    console.log(productosArray);
    console.log(productoID);
    setTimeout(() => {
        llenarCardsRelacionados();
    }, 2500);
}



//Evento para activar el fetch
window.onload = fetchProductos;

//Eventos de cantidad de productos a comprar
botonMas.onclick = () => {
    if (parseInt(cantidadMostrar.innerText) < 10) {
        cantidadMostrar.innerText = parseInt(cantidadMostrar.innerText) + 1;
    }
}
botonMenos.onclick = () => {
    if (parseInt(cantidadMostrar.innerText) > 1 && parseInt(cantidadMostrar.innerText) < 11) {
        cantidadMostrar.innerText = parseInt(cantidadMostrar.innerText) - 1;
    }
}



//Función para dar contenido al html producto
function llenarElementos ({id, title, price, description, details, images}) {
    nombreProducto.innerHTML = title;
    nombreProducto.dataset.id = id
    precioProducto.innerHTML = `S/${price}`;
    contenedorDetalleDescripcion.innerHTML = description;
    imagenCentral.src = `../assets/images/${images[0]}`;
    images[1] ? imagenMuestra1.src = `../assets/images/${images[1]}` : imagenMuestra1.style.display = "none";
    images[2] ? imagenMuestra2.src = `../assets/images/${images[2]}` : imagenMuestra2.style.display = "none";

    //Eventos para cambiar entre descripción y detalle
    pestañaDescripcion.onclick = () => {
        contenedorDetalleDescripcion.innerHTML = description;
    };
    pestañaDetalle.onclick = () => {
         
        contenedorDetalleDescripcion.innerHTML = details;
    };

    //Eventos para el cambio entre imagenes del producto
    imagenMuestra1.onclick = () => {
        let cambioImg = imagenCentral.src;
        imagenCentral.src = imagenMuestra1.src;
        imagenMuestra1.src = cambioImg;
    }
    imagenMuestra2 ? imagenMuestra2.onclick = () => {
        let cambioImg = imagenCentral.src
        imagenCentral.src = imagenMuestra2.src;
        imagenMuestra2.src = cambioImg; 
    } : "";
}

//Función para buscar el producto buscado
function buscarProducto () {

    let productoBuscado = productosArray.filter((el) => el.id == productoID);
    let obj = productoBuscado[0];
    llenarElementos(obj);
}

//Función para generar id de productos relacionados
function obtenerProductRelacionados (i) {
    let productos = [...productosArray];
    let excluir = productos.map((item) => {
        if (item.id == productoID) {
            let elementoBorrar = productos.indexOf(item);
            productos.splice(elementoBorrar, 1)
        }
    })
    let limiteId = excluir.length;
    let relacionadoId = Math.round(Math.random() * (limiteId - 1)) + i;
    let relacionadoObtenido = productos.filter((el) => el.id == relacionadoId);
    let productoRelacionado = relacionadoObtenido[0];

    return productoRelacionado;
}

//Función para llenar las cards de productos relacionados
function llenarCardsRelacionados () {
    let cardRelacionados1 = obtenerProductRelacionados(1);
    let cardRelacionados2 = obtenerProductRelacionados(2) || obtenerProductRelacionados(1);
    
    document.getElementById("img-relacionado-1").src = `../assets/images/${cardRelacionados1.images[0]}`;
    document.getElementById("nombre-relacionado-1").innerHTML = cardRelacionados1.title;
    document.getElementById("img-relacionado-2").src = `../assets/images/${cardRelacionados2.images[0]}`;
    document.getElementById("nombre-relacionado-2").innerHTML = cardRelacionados2.title;

    productRel1.onclick = () => {
        mirarProductoRelacionado(cardRelacionados1);
    }
    productRel2.onclick = () => {
        mirarProductoRelacionado(cardRelacionados2);
    }
}

function mirarProductoRelacionado(producto) {
    let idRelacionado = producto.id;
    localStorage.removeItem("content");
    localStorage.setItem("content", idRelacionado);
    document.location.reload();
}

const eventBtnProduct = () => {
    const btnCurrent  = nombreProducto;
    const idProduct = parseInt(btnCurrent.dataset.id);
    const product = productosArray[idProduct - 1];
    console.log(btnCurrent)
    console.log(idProduct)
    console.log(product)
    console.log(productosArray);

    
    if (idProduct) {
        addToCart(product);
    }
}

const addToCart = (product) => {
    const toastLive = document.getElementById('liveToast')
     const toast = new bootstrap.Toast(toastLive)
    toast.show(); 

    const listCart = JSON.parse(localStorage.getItem('products-cart')) || [];
    const {isProductInCart,indexProduct,quantity} = verifyProductInCart(product.id, listCart);
    const cantidadCliente = parseInt(cantidadMostrar.innerText);
    
    if(isProductInCart){
        listCart[indexProduct] = {...product, quantity: quantity + cantidadCliente};
    }else{
        listCart.push({...product, quantity: cantidadCliente});
    }
    localStorage.setItem('products-cart',JSON.stringify(listCart));
    
}

const verifyProductInCart = (id, listCart) => {
    let isProductInCart = false;
    let indexProduct = -1;
    let quantity = 0;
    console.log('listCart',listCart)
    listCart.forEach((item,index) =>{ 
       console.log(item.id, id)
        if(item.id == id){
            isProductInCart = true;
            console.log('index',index)
            indexProduct = index;
            quantity = item.quantity;
        }
    });
    return {isProductInCart,indexProduct,quantity};
}

botonAñadirCarrito.addEventListener("click", eventBtnProduct);