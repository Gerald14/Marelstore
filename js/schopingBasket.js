// Listas
const listProductsCart = document.querySelector('.cart-products');
const summaryCart = document.querySelector('.cart-summary');

//Botones
// const btnShopingCart = document.querySelector('.cart');

//Templates
const templateProductCart = document.getElementById('template-product-cart').content;
const templateSumaryCart = document.getElementById('template-summary-cart').content;
const fragment = document.createDocumentFragment();

//Eventos
document.addEventListener('DOMContentLoaded',e => paintInitCart());

const paintInitCart = () => {
    const productsCart = JSON.parse(localStorage.getItem('products-cart'))||[];
   
    if(productsCart.length>0){
        const {total,amount} = getSummary(productsCart);
       
        paintCartProducts(productsCart);
        paintSummary(total,amount);
    }
    
}

const paintCartProducts = (products) => {
    products.map((product)=>{
        const tmp = paintProduct(product);
        fragment.appendChild(tmp);
    })
    listProductsCart.appendChild(fragment)
}

const paintProduct = ({id,title,images,price,quantity}) => {
    templateProductCart.querySelector('img').setAttribute('src',`../assets/images/${images[0]}`);
    templateProductCart.querySelector('.product-title').textContent = title;
    templateProductCart.querySelector('.product-price').textContent = price;
    templateProductCart.querySelector('.btn-view').dataset.id = id;
    templateProductCart.querySelector('.btn-add').dataset.id = id;

    const clone = templateProductCart.cloneNode(true);
    return clone;
}

const paintSummary = (total=0,amount=0) => {
    templateSumaryCart.querySelector('.total').textContent = total;
    templateSumaryCart.querySelector('.amount').textContent = amount;

    const clone = templateSumaryCart.cloneNode(true);
    summaryCart.appendChild(clone)
}

const getSummary = (products) => {
    let amount = 0,total = 0;
    products.forEach(({quantity,price}) => {
        total += Number(quantity);
        amount += Number(quantity)*Number(price);
    });

    return {amount,total}
}
