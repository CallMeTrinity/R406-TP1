"use strict";

const API_URL = 'https://dummyjson.com/product'; // URL de base de l'API


async function fetchData(){
    await fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log("=>(TP_api.js:11) products", data);
            const productList = document.getElementById('productList');
            const categoryList = document.getElementById('categoryList');

            data.products.forEach(product => {
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