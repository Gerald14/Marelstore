let contenedorSideMenu = document.getElementById("contenedor-side-menu");
const cartPrice = document.querySelector('.carrito-price');

//Botones
const btnShopingCart = document.querySelector('.cart');

//Eventos
document.addEventListener('DOMContentLoaded',e => paintInit());
btnShopingCart.addEventListener('click',() => redeirectToCart());
let btnSideMenu = document.getElementById("boton-side-menu");

window.addEventListener("click", (e) => {
    if(btnSideMenu.contains(e.target)) {
        contenedorSideMenu.classList.add('active');
        contenedorSideMenu.style.animationName === "deslizar-derecha" ? contenedorSideMenu.style.animationName = "deslizar-izquierda" : contenedorSideMenu.style.animationName = "deslizar-derecha";
    } else if (!contenedorSideMenu.contains(e.target)) {

        if (contenedorSideMenu.style.animationName === "deslizar-derecha") {
            contenedorSideMenu.classList.remove('active');
            contenedorSideMenu.style.animationName = "deslizar-izquierda"
        }
    }
})

const paintInit = () => {
    const dataCart = JSON.parse(localStorage.getItem('products-cart'));
        if(dataCart.length > 0){
            const amount = getAmountCart(dataCart);
            paintAmountCart(amount)
        }

}

const redeirectToCart = () => {
    const url =  window.location.href.split('/');
    url.pop();
    const urlBase = url.join('/');
    window.location.href = urlBase +'/shopingCart.html';
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