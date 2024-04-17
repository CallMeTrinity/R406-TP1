"use strict";

const API_URL = 'https://dummyjson.com/product'; // URL de base de l'API


async function fetchData(){
    await fetch(API_URL)
        .then(response => response.json())
        .then(products => {
            console.log("=>(TP_api.js:11) products", products);
            const productList = document.getElementById('productList');
            const categoryList = document.getElementById('categoryList');

            products.products.forEach(product => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between';
                li.textContent = product.title;

                const icon = document.createElement('i');
                icon.className = 'bi bi-trash del-prod';
                icon.addEventListener('click', function() {
                    productList.removeChild(li);
                });

                li.appendChild(icon);
                productList.appendChild(li);
            });

        })
}

function update(){

}
document.addEventListener('DOMContentLoaded', () => {
    fetchData();

})