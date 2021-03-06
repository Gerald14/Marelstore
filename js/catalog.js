//Global
let products = [];

// Listas
const listProducts = document.querySelector('.products-list');
let contenedorSideMenu = document.getElementById("contenedor-side-menu");
const cartPrice = document.querySelector('.carrito-price');
let opcionesCatalog = document.querySelectorAll(".categoria-catalogo");

//Botones
const btnShopingCart = document.querySelector('.cart');
let btnSideMenu = document.getElementById("boton-side-menu");
const btnFilter = document.querySelector('.btn-filter');

//Templates
const toastLive = document.getElementById('liveToast')
const templateProduct = document.getElementById('template-product').content;
const fragment = document.createDocumentFragment();

//Eventos
document.addEventListener('DOMContentLoaded',e => fetchData());
opcionesCatalog.forEach((item) => {
    item.addEventListener("click", (e) => {
        localStorage.setItem("categoria", e.target.dataset.id)
    })
})
btnShopingCart.addEventListener('click',() => redeirectToCart());
listProducts.addEventListener('click',e => eventBtnProduct(e));
btnFilter.addEventListener('click', ()=> filterProducts());


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

const  filterProducts = () => {
    const list_filter = document.querySelectorAll('.filter__check')
    
    list_filter.forEach((filter,index)=>{
        console.log(index)
        if(filter.checked && index > 0){
            const newList = getListByCategoryId(index)
            cleanDivByClass('.products-list');
            paintProducts(newList);
            if(index==0){
                cleanDivByClass('.products-list');
                paintProducts(products);
            }
            
        }
    })
    let viewButtons = document.querySelectorAll(".btn-view")
       
        viewButtons.forEach((el) => {
            el.addEventListener("click", (o) => {
                // localStorage.remove("content")
                let getProduct = (products.filter((elem) => elem.id == o.target.dataset.id));
                let productID = getProduct[0].id;
                localStorage.setItem("content", productID)
                
                window.location.href = "../views/product.html"
                
            })
        })
}

const getListByCategoryId = (index) => {
    return products.filter(product => product.category==index)
}

const cleanDivByClass = (classDiv) =>{
    const list = document.querySelector(classDiv)
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

const updateCart = () => {
    const dataCart = JSON.parse(localStorage.getItem('products-cart'));
        if ( dataCart != null) {
            if(dataCart.length > 0){
                console.log('pintar')
                const amount = getAmountCart(dataCart);
                paintAmountCart(amount)
            }
        }
}
 
const fetchData = async() => {
    try {
        const dataCart = JSON.parse(localStorage.getItem('products-cart'));
        if ( dataCart != null) {
            if(dataCart.length > 0){
                console.log('pintar')
                const amount = getAmountCart(dataCart);
                paintAmountCart(amount)
            }
        }

        const response  = await fetch('../data/producto.json');
        const data = await response.json();
        products = data;
        paintProducts(data);

        let categoryId = localStorage.getItem("categoria") || "";
        
        if ( categoryId) {
            const productosCategory = getListByCategoryId(parseInt(categoryId));
            cleanDivByClass('.products-list');
            paintProducts(productosCategory);
            if(categoryId==0){
                cleanDivByClass('.products-list');
                paintProducts(products);
            }
            localStorage.setItem("categoria", "")
        }

        let viewButtons = document.querySelectorAll(".btn-view")
       
        viewButtons.forEach((el) => {
            el.addEventListener("click", (o) => {
                // localStorage.remove("content")
                let getProduct = (products.filter((elem) => elem.id == o.target.dataset.id));
                let productID = getProduct[0].id;
                localStorage.setItem("content", productID)
                
                window.location.href = "../views/product.html"
                
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
    templateProduct.querySelector('.product-price').textContent = 'S/.'+price.toFixed(2);
    templateProduct.querySelector('.btn-view').dataset.id = id;
    templateProduct.querySelector('.bi-basket-fill').dataset.id = id;
    templateProduct.querySelector('.bi-basket-fill path').dataset.id = id;
    templateProduct.querySelector('.btn-add').dataset.id = id;
    templateProduct.querySelector('.bi-eye').dataset.id = id;
    templateProduct.querySelector('.bi-eye path').dataset.id = id;

    const clone = templateProduct.cloneNode(true);
    return clone;
}


const eventBtnProduct = (e) => {
    const btnCurrent  = e.target;
    const classBtn  = e.target.classList;
    const idProduct = btnCurrent.dataset.id;
    const product = products[idProduct - 1];

    if (idProduct && (classBtn.contains('btn-add') || classBtn.contains('bi-basket-fill') || classBtn.contains('btn-add-path')) ) {
        addToCart(product);
        updateCart();
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
    
    listCart.forEach((item,index) =>{ 
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