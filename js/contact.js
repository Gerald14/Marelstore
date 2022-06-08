
//Botones
const btnShopingCart = document.querySelector('.cart');
//Eventos
btnShopingCart.addEventListener('click',() => redeirectToCart());

const redeirectToCart = () => {
    const url =  window.location.href.split('/');
    url.pop();
    const urlBase = url.join('/');
    window.location.href = urlBase +'/shopingCart.html';
}