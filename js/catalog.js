//Global
let products = [];

// Listas
const listProducts = document.querySelector('.products-list');

//Botones
const btnShopingCart = document.querySelector('.cart');

//Templates
const templateProduct = document.getElementById('template-product').content;
const fragment = document.createDocumentFragment();

//Eventos
document.addEventListener('DOMContentLoaded',e => fetchData());
btnShopingCart.addEventListener('click',() => redeirectToCart());
listProducts.addEventListener('click',e => eventBtnProduct(e))



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

    templateProduct.querySelector('img').setAttribute('src',`../../assets/images/${images[0]}`);
    templateProduct.querySelector('.product-title').textContent = title;
    templateProduct.querySelector('.product-price').textContent = price;
    templateProduct.querySelector('.btn-view').dataset.id = id;
    templateProduct.querySelector('.btn-add').dataset.id = id;

    const clone = templateProduct.cloneNode(true);
    return clone;
}

const eventBtnProduct = (e) => {
    const btnCurrent  = e.target;
    const idProduct = btnCurrent.dataset.id;
    const product = products[idProduct - 1];
    if (btnCurrent.className.includes('btn-add')) {
        addToCart(product);
    }
}

const addToCart = (product) => {
    const listCart = JSON.parse(localStorage.getItem('products-cart')) || [];
    const {isProcustInCart,indexProduct,quantity} = verifyProductInCart(product.id, listCart);
    if(isProcustInCart){
        listCart[indexProduct] = {...product,quantity:quantity + 1};
    }else{
        listCart.push({...product,quantity:1});
    }
    localStorage.setItem('products-cart',JSON.stringify(listCart));
}

const verifyProductInCart = (id, listCart) => {
    let isProcustInCart = false;
    let indexProduct = -1;
    let quantity = 0;
    console.log('listCart',listCart)
    listCart.forEach((item,index) =>{ 
        item.id === id && (isProcustInCart = true) 
        if(isProcustInCart){
            indexProduct = index;
            quantity = item.quantity;
        }
    });
    return {isProcustInCart,indexProduct,quantity};
}

const redeirectToCart = () => {
    const url =  window.location.href.split('/')[0];
    window.location.href = url + '/views/shopingCart.html';
}
