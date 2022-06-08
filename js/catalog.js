//Global
let products = [];

// Listas
const listProducts = document.querySelector('.products-list');

//Botones
const btnShopingCart = document.querySelector('.cart');

//Templates
const toastLive = document.getElementById('liveToast')
const templateProduct = document.getElementById('template-product').content;
const fragment = document.createDocumentFragment();

//Eventos
document.addEventListener('DOMContentLoaded',e => fetchData());
btnShopingCart.addEventListener('click',() => redeirectToCart());
listProducts.addEventListener('click',e => eventBtnProduct(e));


const fetchData = async() => {
    try {

        const response  = await fetch('../data/producto.json');
        const data = await response.json();
        products = data;
        console.log(data)
        paintProducts(data);
        let viewButtons = document.querySelectorAll(".btn-view")
       
        viewButtons.forEach((el) => {
            el.addEventListener("click", (o) => {
                // localStorage.clear();
                let getProduct = (products.filter((elem) => elem.id == o.target.dataset.id));
                let productID = getProduct[0].id;
                localStorage.setItem("content", productID)
                window.location.replace("../views/product.html");
                
            })
        })

    } catch (error) {
        console.error(error);
    }
}

const paintProducts = (productsList) => {
    console.log('productsList',productsList)
    productsList.forEach( (product) => {
        const templateProduct = paintProduct(product);
        fragment.appendChild(templateProduct);
    });

    listProducts.appendChild(fragment)

}

const paintProduct = ({id,images,title,price}) => {

    templateProduct.querySelector('img').setAttribute('src',`../assets/images/${images[0]}`);
    templateProduct.querySelector('.product-title').textContent = title;
    templateProduct.querySelector('.product-price').textContent = price;
    templateProduct.querySelector('.btn-view').dataset.id = id;
    templateProduct.querySelector('.bi-basket-fill').dataset.id = id;
    templateProduct.querySelector('.bi-basket-fill path').dataset.id = id;
    templateProduct.querySelector('.btn-add').dataset.id = id;

    const clone = templateProduct.cloneNode(true);
    return clone;
}

const eventBtnProduct = (e) => {
    const btnCurrent  = e.target;
    const idProduct = btnCurrent.dataset.id;
    const product = products[idProduct - 1];

    if (idProduct) {
        addToCart(product);
    }
}

const addToCart = (product) => {
    const toast = new bootstrap.Toast(toastLive)
    toast.show();

    const listCart = JSON.parse(localStorage.getItem('products-cart')) || [];
    const {isProductInCart,indexProduct,quantity} = verifyProductInCart(product.id, listCart);
  
    if(isProductInCart){
        listCart[indexProduct] = {...product,quantity:quantity + 1};
    }else{
        listCart.push({...product,quantity:1});
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

const redeirectToCart = () => {
    const url =  window.location.href.split('/');
    url.pop();
    const urlBase = url.join('/');
    window.location.href = urlBase +'/shopingCart.html';
}
