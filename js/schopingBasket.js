// Listas
const listProductsCart = document.querySelector('.cart-products');
const summaryCart = document.querySelector('.cart-summary');
let contenedorSideMenu = document.getElementById("contenedor-side-menu");

//Botones
// const btnShopingCart = document.querySelector('.cart');
let btnSideMenu = document.getElementById("boton-side-menu");

//Templates
const templateProductCart = document.getElementById('template-product-cart').content;
const templateSumaryCart = document.getElementById('template-summary-cart').content;
const fragment = document.createDocumentFragment();

//Eventos
document.addEventListener('DOMContentLoaded',e => paintInitCart());
listProductsCart.addEventListener('click',e => deleteProduct(e))

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

const paintInitCart = () => {
    const productsCart = JSON.parse(localStorage.getItem('products-cart'))||[];
   
    if(productsCart.length>0){
        const {total,amount} = getSummary(productsCart);
       
        paintCartProducts(productsCart);
        paintSummary(total,amount);
    }else{
        paintSummary()
    }
    
}

const paintCartProducts = (products) => {
    products.map((product)=>{
        const tmp = paintProduct(product);
        const hr = document.createElement('hr');
        fragment.appendChild(tmp);
        fragment.appendChild(hr);
    })
    listProductsCart.appendChild(fragment)
    
}

const paintProduct = ({id,title,images,price,quantity}) => {
    templateProductCart.querySelector('img').setAttribute('src',`../assets/images/${images[0]}`);
    templateProductCart.querySelector('.product-cart-title').textContent = title;
    templateProductCart.querySelector('.product-cart-price').textContent = price;
    templateProductCart.querySelector('.product-cart-quantity').textContent = quantity;
    templateProductCart.querySelector('.btn-close').dataset.id = id;

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

const deleteProduct = (e) => {
    const listCart = JSON.parse(localStorage.getItem('products-cart'));
    const btnDelete = e.target;
    const idProduct = btnDelete.dataset.id;
    const newListCart = deleteProductById(idProduct,listCart);
    // Pinta el summary actualizado
    const {total, amount} = getSummary(newListCart);
    cleanDivByClass('.cart-summary');
    paintSummary(total,amount);
    // Pinta la lista actualizada
    cleanDivByClass('.cart-products');
    paintCartProducts(newListCart);
    localStorage.setItem('products-cart',JSON.stringify(newListCart));
}

function cleanDivByClass(classDiv){
    const list = document.querySelector(classDiv)
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}



const deleteProductById = (id,arr) => arr.filter(item => item.id!=id);
