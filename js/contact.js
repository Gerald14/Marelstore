let contenedorSideMenu = document.getElementById("contenedor-side-menu");

//Botones
const btnShopingCart = document.querySelector('.cart');
//Eventos
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

const redeirectToCart = () => {
    const url =  window.location.href.split('/');
    url.pop();
    const urlBase = url.join('/');
    window.location.href = urlBase +'/shopingCart.html';
}