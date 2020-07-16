"use strict";
const maxCardsOnPage = 8; // Максимальное количество карточек на одной странице (поменять если нужно)
const maxDigitButtons = 7; // Максимальное количество кнопок-цифр для переключения на другую страницу

const filterBlock = document.querySelector(".dropdown-menu"),
    changePageParent = document.querySelector(".pagination"),
    previousButton = document.querySelector(".page-previous"),
    nextButton = document.querySelector(".page-next");

// База данных
let heroesData = {};
let heroesDataPages = []; // Список карточек, состоящий из элементов равных количеству страниц в коллекции


const updateDigitButtons = () => {
    /* Обновляет количество кнопок для переключения страниц, в зависимости от текущей коллекции */
    const digitButtons = document.querySelectorAll(".page-digital");

    changePageParent.style.display = "";

    if (heroesDataPages.length <= 1) {
        changePageParent.style.display = "none";
        return;
    }

    for (let page = 1; page <= maxDigitButtons; page++) {
        digitButtons[page - 1].style.display = (page > heroesDataPages.length ? "none" : "inline");
    }
};
const renderPageCards = page => {
    sessionStorage.setItem("currentPage", page);

    const cardList = document.querySelectorAll(".card-class");

    // Скрываем текущие карточки (чтобы в последствии не было лишних карточек на странице)
    cardList.forEach(card => card.style.display = "none");

    // Загрузка карточек из базы данных карточек по страницам
    heroesDataPages[page].forEach((hero, index) => {
        const card = cardList[index];

        card.querySelector(".card-img-top").src = hero.photo;
        card.querySelector(".card-title").textContent = hero.name;

        card.querySelector(".card-text").innerHTML = `
			<b>Actor:</b> ${hero.actors}</br>
			<b>Species:</b> ${hero.species}</br>
			<b>Gender:</b> ${hero.gender}</br>
			<b>Days of life:</b> ${hero.birthDay ? hero.birthDay : "xxxx"}-${hero.deathDay ? hero.deathDay : "xxxx"}</br>
			<b>Status:</b> ${hero.status}</br>
		`;
        // Показываем карточку
        card.style.display = "inline-block";
    });

    updateDigitButtons();

};
const updateCardsList = filter => {

    heroesDataPages = [
        []
    ];

    const addHero = hero => {
        if (heroesDataPages[heroesDataPages.length - 1].length < maxCardsOnPage) {
            heroesDataPages[heroesDataPages.length - 1].push(hero);
        } else {
            heroesDataPages.push([]);
            heroesDataPages[heroesDataPages.length - 1].push(hero);
        }
    };

    heroesData.forEach(hero => {
        /* Если страница не заполнена, то добавляем на неё карточку из базы данных,
        иначе увеличиваем количество страниц и при следующей итерации помещаем новую карточку на новую страницу
        */

        let newHero;
        if (filter && filter !== "All movies") {
            if (hero.movies && hero.movies.indexOf(filter) !== -1) {
                newHero = hero;
            } else {
                return;
            }
        } else {
            newHero = hero;
        }
        addHero(newHero);

    });

    renderPageCards(0);
};
const handlers = () => {
    const changePageHandler = () => {

        changePageParent.addEventListener("click", event => {

            event.preventDefault();

            const target = event.target;
            if (target.disabled) {
                return;
            }

            let currentPage;
            try {
                currentPage = +sessionStorage.getItem("currentPage");
                if (!currentPage) throw new Error("undefined current page id");
            } catch (error) {
                currentPage = 0;
            }

            /* Кнопки previous и next */
            if (target.closest(".page-previous")) {
                if (currentPage > 0) {
                    currentPage--;
                    renderPageCards(currentPage);
                    sessionStorage.setItem("currentPage", currentPage);
                }
            }
            if (target.closest(".page-next")) {
                if (currentPage < heroesDataPages.length - 1) {
                    currentPage++;
                    renderPageCards(currentPage);
                    sessionStorage.setItem("currentPage", currentPage);
                }

            }
            /* Переключением по цифрам */
            if (target.closest(".page-digital") && target.classList.contains("page-link")) {
                let selectedPage = +target.textContent - 1;
                if (selectedPage < heroesDataPages.length) { // Если такая страница есть в коллекции
                    renderPageCards(selectedPage);
                    currentPage = selectedPage;
                    sessionStorage.setItem("currentPage", currentPage);
                }
            }

            /* 	Общие проверки для установления/удаления disabled на кнопках next и previous */

            // currentPage - текущая страница (после переключения на новую)
            if (currentPage === heroesDataPages.length - 1) {
                nextButton.classList.add("disabled");
            } else {
                nextButton.classList.remove("disabled");
            }

            if (currentPage <= 0) {
                previousButton.classList.add("disabled");
            } else {
                previousButton.classList.remove("disabled");
            }


        });
    };
    const heroFilterHandler = () => {

        const getMoviesFromDB = () => {
            /* Получает все уникальные фильмы из базы данных (не повторяющиеся)
             и сортирует результат */
            const movies = [];
            heroesData.forEach(hero => {
                if (hero.movies) {
                    hero.movies.forEach(movie => {
                        if (movies.indexOf(movie) === -1) {
                            movies.push(movie);
                        }
                    });
                }
            });
            return movies.sort();
        };

        getMoviesFromDB().forEach(
            movie => filterBlock.insertAdjacentHTML("beforeend", `<a class="dropdown-item" href="#">${movie}</a>`));

        filterBlock.addEventListener("click", event => {
            const target = event.target;

            if (target.classList.contains("dropdown-item")) {
                updateCardsList(target.textContent);
            }
        });

    };

    heroFilterHandler();
    changePageHandler();
};
const loadHeroes = () => {
    fetch("./dbHeroes.json")
        .then(response => {
            if (response.status !== 200) {
                throw new Error("invalid server response status");
            }
            return response.json();
        })
        .then(data => {
            heroesData = data;
            updateCardsList();
            handlers();
        })
        .catch(error => console.error(error));
};

loadHeroes();