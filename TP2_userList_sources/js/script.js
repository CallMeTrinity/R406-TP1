async function fetchData(url) {
    const response = await fetch(url);
    try {
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function populateUsers() {
    const dataAPI = await fetchData('https://randomuser.me/api/?results=25');
    if (dataAPI && dataAPI.results) {
        const userContainer = document.getElementById('user-list');
        // Vide le container avant d'ajouter de nouveaux utilisateurs
        userContainer.innerHTML = '';

        dataAPI.results.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('p-2', 'col-4');

            const userInfoDiv = document.createElement('div');
            userInfoDiv.classList.add('user', 'border-1', 'p-2', 'rounded', 'flex', 'flex-col', 'items-center');

            // Ajoute l'image
            const img = document.createElement('img');
            img.src = user.picture.thumbnail;
            img.alt = user.name.first + " " + user.name.last;
            img.classList.add('user-img', 'rounded-full', 'w-1/2');

            // Ajoute le nom
            const name = document.createElement('p');
            name.classList.add('user-name', 'font-bold', 'text-black');
            name.textContent = user.name.first + " " + user.name.last;

            // Ajoute l'adresse
            const address = document.createElement('p');
            address.classList.add('user-adress');
            address.textContent = `${user.location.street.number} ${user.location.street.name}`;

            const city = document.createElement('p');
            city.classList.add('user-adress', 'text-xs', 'text-center');
            city.textContent = `${user.location.city}, ${user.location.state} - CEP: ${user.location.postcode}`;

            // Assemble les éléments
            userInfoDiv.appendChild(img);
            userInfoDiv.appendChild(name);
            userInfoDiv.appendChild(address);
            userInfoDiv.appendChild(city);

            userDiv.appendChild(userInfoDiv);

            // Ajoute le nouvel élément dans le container
            userContainer.appendChild(userDiv);
        });
    } else {
        console.log('Aucun utilisateur trouvé');
    }
}

document.addEventListener('DOMContentLoaded', populateUsers);
