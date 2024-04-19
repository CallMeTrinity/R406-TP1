async function fetchData(url) {
    const response = await fetch(url);
    try {
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

async function populateUsers() {
    const dataAPI = await fetchData('https://randomuser.me/api/?results=25');
    if (dataAPI && dataAPI.results) {
        const userContainer = document.getElementById('user-list');

        userContainer.innerHTML = '';

        dataAPI.results.forEach(user => {
            const element =
                `<div class="p-2 col-4">
                    <div class="user  border-1 p-2 rounded flex flex-col items-center">
                        <img src="${user.picture.thumbnail}" alt="${user.name.first} ${user.name.last}"
                             class="user-img rounded-full w-1/2"/>
                        <p class="user-name font-bold text-black">${user.name.first} ${user.name.last}</p>
                        <p class="user-adress">${user.location.street.number} ${user.location.street.name}</p>
                        <p class="user-adress text-xs text-center">${user.location.city}, ${user.location.state} - CEP: ${user.location.postcode}</p>
                    </div>
                </div>`
            userContainer.insertAdjacentHTML('afterbegin', element);
        });
    } else {
        console.log('Aucun utilisateur trouvé');
    }
}

document.addEventListener('DOMContentLoaded', populateUsers);
