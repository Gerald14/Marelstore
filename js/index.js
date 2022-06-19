let botonSideMenu = document.getElementById("boton-side-menu");
let botonCart = document.querySelector('.cart');
let contenedorSideMenu = document.getElementById("contenedor-side-menu");
const cartPrice = document.querySelector('.carrito-price');
let hola = document.querySelector(".contenedor-icono-carrito")

//Eventos
document.addEventListener('DOMContentLoaded',e => paintInit());

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