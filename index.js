const name = document.querySelector('#name');
const secondName = document.querySelector('#secondName');
const email = document.querySelector('#email');
const city = document.querySelector('#city');
const age = document.querySelector('#age');
const btn = document.querySelector('.btn');
const users = document.querySelector('.users');
const clear = document.querySelector('.clear');

// Объект для localStorage, забирает информацию по ключу 'users'
const storage = JSON.parse(localStorage.getItem('users')) || {};

// Функция установки слушателей на HTML узлы
function setListeners() {
  const del = document.querySelectorAll('.delete');
  const change = document.querySelectorAll('.change');
  let clicked;

  del.forEach((n) => {
    n.addEventListener('click', () => {
      clicked = n.getAttribute('data-delete');

      const outer = document.querySelector(`[data-out="${clicked}"]`);
      outer.remove();
      delete storage[clicked];
      localStorage.setItem('users', JSON.stringify(storage));
    });
  });

  change.forEach((n) => {
    n.addEventListener('click', () => {
      clicked = n.getAttribute('data-change');
      delete storage[clicked];
      const outer = document.querySelector(`[data-out="${clicked}"]`);
      const outinf = outer.querySelector('.user-info');
      const par = outinf.querySelectorAll('p');

      name.value = par[0].innerText;
      secondName.value = par[1].innerText;
      email.value = par[2].innerText;
      city.value = par[3].innerText;
      age.value = par[4].innerText;

    });
  });
}

// Функция очистки хранилища localStorage по ключу `users`
function clearLocalStorage() {
  window.location.reload();
  localStorage.removeItem('users');
}

// Функция создания карточки
function createCard({ name, secondName, email, city, age }) {
  return `
    <div data-out=${email} class="user-outer">
        <div class="user-info">
            <p>${name}</p>
            <p>${secondName}</p>
            <p>${email}</p>
            <p>${city}</p>
            <p>${age}</p>
        </div>
        <div class="menu">
            <button data-delete=${email} class="delete">Удалить</button>
            <button data-change=${email} class="change">Изменить</button>
        </div>
    </div>
  `;
}

// Функция обновления карточки
function rerenderCard(storage) {
  users.innerHTML = '';

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
  */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
  */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]
    const [email, userData] = user;


    const div = document.createElement('div');
    div.className = 'user';
    div.innerHTML = createCard(userData);
    users.append(div);
    name.value = ''
    secondName.value = ''
    email.value = ''
    city.value = ''
    age.value = ''
  });
}

// Функция получения данных из хранилища localStorage по ключу `users`
function getData(e) {
  e.preventDefault();
  const data = {};

  data.name = name.value || '';
  data.secondName = secondName.value || '';
  data.email = email.value || '';
  data.city = city.value || '';
  data.age = age.value || '';

  const key = data.email;
  storage[key] = data;

  localStorage.setItem('users', JSON.stringify(storage));
  

  rerenderCard(JSON.parse(localStorage.getItem('users')));

  return data;
}

// Экземпляр объекта, наблюдающий за DOM-элементом и запускающий колбэк в случае изменений
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      setListeners();
    }
  });
});

observer.observe(users, {
  childList: true,
});

btn.addEventListener('click', getData);
clear.addEventListener('click', clearLocalStorage);

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')));
