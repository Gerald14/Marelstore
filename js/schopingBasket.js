// Listas
const listProductsCart = document.querySelector('.cart-products');
const summaryCart = document.querySelector('.cart-summary');
let contenedorSideMenu = document.getElementById("contenedor-side-menu");
const cartPrice = document.querySelector('.carrito-price');
let opcionesCatalog = document.querySelectorAll(".categoria-catalogo");

//Templates
const templateProductCart = document.getElementById('template-product-cart').content;
const templateSumaryCart = document.getElementById('template-summary-cart').content;
const fragment = document.createDocumentFragment();
//Botones
// const btnShopingCart = document.querySelector('.cart');
let btnSideMenu = document.getElementById("boton-side-menu");
let botonEnviarWp = templateSumaryCart.querySelector(".btn-complete");



//Eventos
document.addEventListener('DOMContentLoaded',e => paintInitCart());
listProductsCart.addEventListener('click',e => deleteProduct(e))
summaryCart.addEventListener('click',e => clearCart(e))
opcionesCatalog.forEach((item) => {
    item.addEventListener("click", (e) => {
        localStorage.setItem("categoria", e.target.dataset.id)
    })
})

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

const clearCart = (e) => {
    console.log(e.target.classList)
    const classBtn = e.target.classList;
    console.log(classBtn)
    if(classBtn.contains('btn-complete')){
        const listCartWp = JSON.parse(localStorage.getItem('products-cart')) || [];
        let totalWp = 0;
        let productosWp = "";
        for (let i = 0; i < listCartWp.length; i++) {
            const element = `[${listCartWp[i].title} x ${listCartWp[i].quantity}] `;
            productosWp = productosWp + element;
        }
        for (let i = 0; i < listCartWp.length; i++) {
            const elementWp = listCartWp[i].price * listCartWp[i].quantity;
            totalWp = totalWp + elementWp;
        }
        window.location.href = `https://wa.me/+51997523677?text=Hola%21%20Quiero%20adquirir%20estos%20productos%3A%0D%0A${productosWp}%20%7C%20%0D%0APrecio%20total%20%3D%20${totalWp}%20soles`;
        localStorage.setItem('products-cart',JSON.stringify([]))

    }
}

const paintInitCart = () => {
    const productsCart = JSON.parse(localStorage.getItem('products-cart'))||[];
   
    if(productsCart.length>0){
        const {total,amount} = getSummary(productsCart);
        paintAmountCart(amount)
        paintCartProducts(productsCart);
        paintSummary(total,amount);
    }else{
        paintSummary()
        paintMessageEmpty()
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
    templateProductCart.querySelector('.product-cart-price').textContent = 'precio: S/.'+price.toFixed(2);
    templateProductCart.querySelector('.product-cart-quantity').textContent ='cantidad: '+ quantity;
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

const paintAmountCart = (amount) => {
    cartPrice.textContent = 'S/.'+ amount.toFixed(2);
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

const getAmountCart = (products) => {
    let amount = 0;
    products.forEach(({quantity,price}) => {
        amount += Number(quantity)*Number(price);
    });

    return amount
}

const paintMessageEmpty = () => {
    const div = document.createElement('div');
    div.className = 'cart-empty';
    div.textContent = 'El carrito esta vacio';
    listProductsCart.appendChild(div);
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
    const classBtn = e.target.classList;
    
    if(classBtn.contains('btn-close')){
        const idProduct = btnDelete.dataset.id;

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: "Seguro desea elminar este producto de su carrito!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
    
              const newListCart = deleteProductById(idProduct,listCart);
               // Pinta el summary actualizado
              const {total, amount} = getSummary(newListCart);
              cleanDivByClass('.cart-summary');
              paintSummary(total,amount);
              // Pinta la lista actualizada
              cleanDivByClass('.cart-products');
              paintCartProducts(newListCart);
              localStorage.setItem('products-cart',JSON.stringify(newListCart));
              updateCart();
              swalWithBootstrapButtons.fire(
                'Eliminado!',
                'Su producto fue eliminado del carrito.',
                'success'
              )
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Tu producto sigue en el carrito 😄',
                'error'
              )
            }
          })
    }
    
}

const msgSweetAlertToDelete = ()=>{
    
}

function cleanDivByClass(classDiv){
    const list = document.querySelector(classDiv)
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

const deleteProductById = (id,arr) => arr.filter(item => item.id!=id);







