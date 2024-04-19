async function fetchData(url) {
    const response = await fetch(url);
    try {
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

async function populateUsers() {
    const dataAPI = await fetchData('https://randomuser.me/api/?results=27&nat=BR');
    console.log("=>(script.js:12) dataAPI", dataAPI);
    let users = [];
    if (dataAPI && dataAPI.results) {
        const userContainer = document.getElementById('user-list');

        userContainer.innerHTML = '';

        dataAPI.results.forEach(user => {
            const element =
                `<div class="p-2 col-4">
                    <div class="user border-1 p-2 rounded flex flex-col items-center">
                        <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}"
                             class="user-img rounded-full w-1/2"/>
                        <p class="user-name font-bold text-black">${user.name.first} ${user.name.last}</p>
                        <p class="user-adress">${user.location.street.name}, ${user.location.street.number}</p>
                        <p class="user-adress text-xs text-center">${user.location.city}, ${user.location.state} - CEP: ${user.location.postcode}</p>
                    </div>
                </div>`
            userContainer.insertAdjacentHTML('afterbegin', element);

            users.push(user);
        });
        return users
    } else {
        console.log('Aucun utilisateur trouvé');
    }
}

function fillAndShowModal(user) {
    const modalBody = document.querySelector('#userModal .modal-body');
    modalBody.innerHTML = `
        <div class="modal-user-info">
            <h5 class="modal-title">${user.name.title}. ${user.name.first} ${user.name.last}</h5>
            <p><strong>Email :</strong> ${user.email}</p>
            <p><strong>Genre :</strong> ${user.gender}</p>
            <p><strong>Date de naissance :</strong> ${new Date(user.dob.date).toLocaleDateString()}</p>
            <p><strong>Âge :</strong> ${user.dob.age}</p>
            <p><strong>Téléphone :</strong> ${user.phone}</p>
            <p><strong>Cellulaire :</strong> ${user.cell}</p>
            <p><strong>Adresse :</strong> ${user.location.street}, ${user.location.city}, ${user.location.state}, CEP: ${user.location.postcode}</p>
            <p><strong>Localisation :</strong> Latitude ${user.location.coordinates.latitude}, Longitude ${user.location.coordinates.longitude}</p>
            <p><strong>Fuseau horaire :</strong> ${user.location.timezone.description} (GMT${user.location.timezone.offset})</p>
        </div>
        <div class="modal-user-picture">
            <img src="${user.picture.large}" alt="Photo de ${user.name.first} ${user.name.last}" class="img-fluid rounded" />
        </div>`;
    document.getElementById('userModal').style.display = "block";
}


async function updateUserDisplayed() {
    const s = document.getElementById('number-displayed');
    const users = document.querySelectorAll('.user');
    const current = users.length;
    const total = 27;
    s.textContent = `Exibindo ${current} de ${total} itens`;
}


document.addEventListener('DOMContentLoaded', async () => {
    const users = await populateUsers();
    const userCards = document.querySelectorAll('.user');
    for(let i = 0; i < users.length; i++){
        userCards[i].addEventListener('click', () => {
            if (userCards[i]) {
                fillAndShowModal(users[i])
            }
        });
    }
    await updateUserDisplayed();
});
