let productosOferta = [];
let botonSideMenu = document.getElementById("boton-side-menu");
let botonCart = document.querySelector('.cart');
let contenedorSideMenu = document.getElementById("contenedor-side-menu");
const cartPrice = document.querySelector('.carrito-price');
let productOferta1 = document.getElementById("card-oferta-1"); 
let productOferta2 = document.getElementById("card-oferta-2"); 
let productOferta3 = document.getElementById("card-oferta-3"); 
let productOferta4 = document.getElementById("card-oferta-4");
let opcionesCatalog = document.querySelectorAll(".categoria-catalogo"); 

//Eventos
document.addEventListener('DOMContentLoaded',e => paintInit());
document.addEventListener('DOMContentLoaded',e => fetchDataIndex());
console.log(opcionesCatalog)
opcionesCatalog.forEach((item) => {
    item.addEventListener("click", (e) => {
        localStorage.setItem("categoria", e.target.dataset.id)
    })
})

window.addEventListener("click", (e) => {
    if(botonSideMenu.contains(e.target)) {
        contenedorSideMenu.style.animationName === "deslizar-derecha" ? contenedorSideMenu.style.animationName = "deslizar-izquierda" : contenedorSideMenu.style.animationName = "deslizar-derecha";
    } else if (!contenedorSideMenu.contains(e.target)) {
        if (contenedorSideMenu.style.animationName === "deslizar-derecha") {
            contenedorSideMenu.style.animationName = "deslizar-izquierda"
        }
    }
})

botonCart.addEventListener('click',()=> redeirectToCart())

const redeirectToCart = () => {
    const url =  window.location.href.split('/');
    console.log(url)
    var bicho = url.pop();
    console.log(bicho)
    window.location.href = '/views/shopingCart.html';
}

const paintInit = () => {
    const dataCart = JSON.parse(localStorage.getItem('products-cart'));
    if (dataCart != null) {
        if(dataCart.length > 0){
            const amount = getAmountCart(dataCart);
            paintAmountCart(amount)
        }
    }

}

const paintAmountCart = (amount) => {
    cartPrice.textContent = 'S/.'+ amount.toFixed(2);
}

const getAmountCart = (products) => {
    let amount = 0;
    products.forEach(({quantity,price}) => {
        amount += Number(quantity)*Number(price);
    });

    return amount
}

const fetchDataIndex = async() => {
    try {
        

        const response  = await fetch('../data/producto.json');
        const data = await response.json();
        productosOferta = data;


        productOferta1.addEventListener("click", () => {
            let productID = productOferta1.dataset.id;
            localStorage.setItem("content", productID)
            window.location.href = "../views/product.html"
        })
        productOferta2.addEventListener("click", () => {
            let productID = productOferta2.dataset.id;
            localStorage.setItem("content", productID)
            window.location.href = "../views/product.html"
        })
        productOferta3.addEventListener("click", () => {
            let productID = productOferta3.dataset.id;
            localStorage.setItem("content", productID)
            window.location.href = "../views/product.html"
        })
        productOferta4.addEventListener("click", () => {
            let productID = productOferta4.dataset.id;
            localStorage.setItem("content", productID)
            window.location.href = "../views/product.html"
        })
       
        

    } catch (error) {
        console.error(error);
    }
}