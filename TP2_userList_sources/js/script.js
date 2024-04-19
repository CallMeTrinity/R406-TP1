let allUsers = [];
let currentPage = 1;
let usersPerPage = 9;

async function fetchData(url) {
    const response = await fetch(url);
    try {
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

async function populateUsers(stateFilter = null, sortOption = 'none') {
    if (allUsers.length === 0) {
        const dataAPI = await fetchData('https://randomuser.me/api/?results=99&nat=BR');
        if (dataAPI && dataAPI.results) {
            allUsers = dataAPI.results;
        } else {
            console.log('Aucun utilisateur trouvé');
            return;
        }
    }

    let filteredUsers = stateFilter ? allUsers.filter(user => user.location.state === stateFilter) : allUsers;

    if (sortOption === 'name') {
        filteredUsers.sort((a, b) => a.name.last.localeCompare(b.name.last));
    } else if (sortOption === 'first-name') {
        filteredUsers.sort((a, b) => a.name.first.localeCompare(b.name.first));
    }
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const usersToDisplay = filteredUsers.slice(start, end);

    const userContainer = document.getElementById('user-list');
    userContainer.innerHTML = '';

    usersToDisplay.forEach((user, index) => {
        const element =
            `<div class="p-2 col-4">
                <div class="user border-1 p-2 rounded flex flex-col items-center" data-index="${index}">
                    <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}"
                        class="user-img rounded-full w-1/2"/>
                    <p class="user-name font-bold text-black">${user.name.first} ${user.name.last}</p>
                    <p class="user-adress">${user.location.street.name}, ${user.location.street.number}</p>
                    <p class="user-adress text-xs text-center">${user.location.city}, ${user.location.state} - CEP: ${user.location.postcode}</p>
                </div>
            </div>`;
        userContainer.insertAdjacentHTML('beforeend', element);
    });

    setupPagination(filteredUsers.length);
    return filteredUsers;
}

function setupPagination(totalUsers) {
    const pageCount = Math.ceil(totalUsers / usersPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.setAttribute('data-page', `${i}`);
        pageButton.className = 'mx-1 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300';
        pageButton.onclick = async() => {
            currentPage = i;
            populateUsers();
            await updateUserDisplayed();

        };
        paginationContainer.appendChild(pageButton);
    }
    const pageBtns = document.querySelectorAll('[data-page]');
    pageBtns.forEach(btn => {
        if (btn.textContent === currentPage.toString()){
            btn.classList.add('current')
        }
    })

}

async function updateUserDisplayed() {
    const s = document.getElementById('number-displayed');
    const users = document.querySelectorAll('.user');
    s.textContent = `Exibindo ${currentPage * usersPerPage - usersPerPage + 1} - ${Math.max(currentPage * usersPerPage, users.length)} de ${allUsers.length} itens`;
}

function setupFilterListeners() {

    const stateCheckboxes = document.querySelectorAll('#state-list input[type="checkbox"]');
    stateCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async (event) => {
            let stateFilter = event.target.checked ? event.target.nextSibling.textContent.trim() : null;
            const filteredUsers = await populateUsers(stateFilter);
            await setupEventListeners(filteredUsers);
            await updateUserDisplayed();
        });
    });
}


async function setupEventListeners(users) {
    const userCards = document.querySelectorAll('.user');
    userCards.forEach(userCard => {
        userCard.addEventListener('click', () => {
            const index = userCard.getAttribute('data-index'); // Récupère l'index de la carte cliquée
            const user = users[index];
            if (user) {
                fillAndShowModal(user);
            }
        });
    });
}
function fillAndShowModal(user) {
    const modalBody = document.querySelector('#userModal .modal-body');
    modalBody.innerHTML = `
<div class="flex justify-between">
  <div class="modal-user-info space-y-2">
    <h5 class="text-lg font-semibold">${user.name.title}. ${user.name.first} ${user.name.last}</h5>
    <p><strong>Email :</strong> ${user.email}</p>
    <p><strong>Genre :</strong> ${user.gender}</p>
    <p><strong>Date de naissance :</strong> ${new Date(user.dob.date).toLocaleDateString()}</p>
    <p><strong>Âge :</strong> ${user.dob.age}</p>
    <p><strong>Téléphone :</strong> ${user.phone}</p>
    <p><strong>Cellulaire :</strong> ${user.cell}</p>
    <p><strong>Adresse :</strong> ${user.location.street.name}, ${user.location.city}, ${user.location.state}, CEP: ${user.location.postcode}</p>
    <p><strong>Localisation :</strong> Latitude ${user.location.coordinates.latitude}, Longitude ${user.location.coordinates.longitude}</p>
    <p><strong>Fuseau horaire :</strong> ${user.location.timezone.description} (GMT${user.location.timezone.offset})</p>
  </div>
  <div class="modal-user-picture w-1/4 mt-4">
    <img src="${user.picture.large}" alt="Photo de ${user.name.first} ${user.name.last}" class="rounded-lg w-full" />
  </div>
</div>`;

    document.getElementById('userModal').style.display = "block";
    const closeBtns = document.querySelectorAll('[data-close]');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => document.getElementById('userModal').style.display = "none")
    })
}


document.querySelector('#order-by').addEventListener('change', async function () {
    const sortOption = this.value;
    const filteredUsers = await populateUsers(null, sortOption);
    await setupEventListeners(filteredUsers);
    await updateUserDisplayed();
});

document.addEventListener('DOMContentLoaded', async () => {
    const users = await populateUsers();
    setupFilterListeners(users);
    await setupEventListeners(users);
    await updateUserDisplayed();
});
