"use strict";

const API_URL = "https://dummyjson.com"; // URL de base de l'API

async function fetchData(url) {
  const response = await fetch(url);
  try {
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let categoriesBtn;
  try {
    const jsonData = await fetchData(`${API_URL}/products/categories`);
    const listCategory = document.getElementById("categoryList");

    jsonData.forEach((category) => {
      const element = `<button class="btn btn-outline-secondary text-start" type="button" data-category="${category}">${category}</button>`;
      listCategory.insertAdjacentHTML("afterbegin", element);
      categoriesBtn = document.querySelectorAll("[data-category]");
    });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }

  categoriesBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      let deleteBtn;
      try {
        const category = btn.getAttribute("data-category");
        const products = await fetchData(
          `${API_URL}/products/category/${category}`
        );
        const productList = document.getElementById("productList");
        productList.innerHTML = "";
        console.log(products.products);

        products.products.forEach((product) => {
          const element = `<li class="list-group-item d-flex justify-content-between">${product.title} <i class="bi bi-trash del-prod" data-id=${product.id}></i></li>`;
          productList.insertAdjacentHTML("afterbegin", element);
        });
        deleteBtn = document.querySelectorAll("[data-id]");
        deleteBtn.forEach((btn) => {
            console.log(btn)
            btn.addEventListener("click", async () => {
              try {
                const id = btn.getAttribute("data-id");
                fetch(`${API_URL}/products/${id}`, {
                  method: "DELETE",
                })
                  .then((res) => res.json())
                  .then(console.log);
              } catch (error) {
                console.error("Error fetching or processing data:", error);
              }
            });
          });
    
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    });
  });

  
});
