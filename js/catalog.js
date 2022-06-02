//Global
let products = [];

// Listas
const listProducts = document.querySelector('.products-list');

//Templates
const templateProduct = document.getElementById('template-product').content;
const fragment = document.createDocumentFragment();
//Eventos
document.addEventListener('DOMContentLoaded',e => fetchData());


const fetchData = async() => {
    try {

        const response  = await fetch('../../data/productos.json');
        const data = await response.json();
        products = data;
        console.log(data)
        paintProducts(data);

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