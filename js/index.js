let botonSideMenu = document.getElementById("boton-side-menu");
let contenedorSideMenu = document.getElementById("contenedor-side-menu");

window.addEventListener("click", (e) => {
    if(botonSideMenu.contains(e.target)) {
        contenedorSideMenu.style.animationName === "deslizar-derecha" ? contenedorSideMenu.style.animationName = "deslizar-izquierda" : contenedorSideMenu.style.animationName = "deslizar-derecha";
    } else if (!contenedorSideMenu.contains(e.target)) {
        if (contenedorSideMenu.style.animationName === "deslizar-derecha") {
            contenedorSideMenu.style.animationName = "deslizar-izquierda"
        }
    }
})