// Listas
const listProductsCart = document.querySelector('.cart-products');
const summaryCart = document.querySelector('.cart-summary');
let contenedorSideMenu = document.getElementById("contenedor-side-menu");
const cartPrice = document.querySelector('.carrito-price');
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

const paintAmountCart = (amount) => {
    cartPrice.textContent = 'S/.'+ amount.toFixed(2);
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

const msgSweetAlertToDelete = ()=>{
    
}

function cleanDivByClass(classDiv){
    const list = document.querySelector(classDiv)
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

const deleteProductById = (id,arr) => arr.filter(item => item.id!=id);

//Envío a WhatsApp del carrito de compras
let botonEnviarWp = templateSumaryCart.querySelector("#completar-orden-wp");
console.log(botonEnviarWp);
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
console.log(totalWp);
console.log(productosWp);
if(productosWp.length>0){

    botonEnviarWp.href = `https://wa.me/+51997523677?text=Hola%21%20Quiero%20adquirir%20estos%20productos%3A%0D%0A${productosWp}%20%7C%20%0D%0APrecio%20total%20%3D%20${totalWp}%20soles`;
}





