const movies = [
    {
        id: 1,
        title: "Stranger Things",
        year: 2016,
        rating: "TV-14",
        genre: "Sci-Fi",
        description: "A group of young friends uncover a mysterious world of secret experiments, strange forces and unexpected heroes.",
        image: "https://picsum.photos/seed/stranger/500/750"
    },
    {
        id: 2,
        title: "The Witcher",
        year: 2019,
        rating: "TV-MA",
        genre: "Fantasy",
        description: "A monster hunter struggles to find his place in a dangerous world where people can be more wicked than beasts.",
        image: "https://picsum.photos/seed/witcher/500/750"
    },
    {
        id: 3,
        title: "Wednesday",
        year: 2022,
        rating: "TV-14",
        genre: "Mystery",
        description: "A clever and morbid student investigates a supernatural mystery while navigating life at an unusual academy.",
        image: "https://picsum.photos/seed/wednesday/500/750"
    },
    {
        id: 4,
        title: "Dark",
        year: 2017,
        rating: "TV-MA",
        genre: "Thriller",
        description: "A missing child exposes a mystery that spans generations and reveals connections between four families.",
        image: "https://picsum.photos/seed/dark/500/750"
    },
    {
        id: 5,
        title: "Money Heist",
        year: 2017,
        rating: "TV-MA",
        genre: "Crime",
        description: "A mastermind recruits a crew for an ambitious heist while staying several steps ahead of the authorities.",
        image: "https://picsum.photos/seed/heist/500/750"
    },
    {
        id: 6,
        title: "The Crown",
        year: 2016,
        rating: "TV-MA",
        genre: "Drama",
        description: "A sweeping drama following the reign, relationships and responsibilities of a young monarch.",
        image: "https://picsum.photos/seed/crown/500/750"
    },
    {
        id: 7,
        title: "Peaky Blinders",
        year: 2013,
        rating: "TV-MA",
        genre: "Crime",
        description: "A powerful family builds an empire in post-war Birmingham while facing rivals, politics and dangerous enemies.",
        image: "https://picsum.photos/seed/peaky/500/750"
    },
    {
        id: 8,
        title: "Black Mirror",
        year: 2011,
        rating: "TV-MA",
        genre: "Sci-Fi",
        description: "A collection of thought-provoking stories exploring technology, society and the darker side of human behavior.",
        image: "https://picsum.photos/seed/blackmirror/500/750"
    }
];

const popularRow = document.getElementById("popular-row");
const myListRow = document.getElementById("my-list-row");
const emptyList = document.getElementById("empty-list");
const modal = document.getElementById("movie-modal");
const searchPanel = document.getElementById("search-panel");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const toast = document.getElementById("toast");

let myList = JSON.parse(localStorage.getItem("netflixMyList") || "[]");
let selectedMovie = null;

function getMovie(id) {
    return movies.find(movie => movie.id === Number(id));
}

function isInList(id) {
    return myList.includes(Number(id));
}

function saveList() {
    localStorage.setItem("netflixMyList", JSON.stringify(myList));
}

function createMovieCard(movie) {
    const card = document.createElement("article");
    card.className = "movie-card";
    card.dataset.id = movie.id;

    card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" loading="lazy">
        <div class="card-overlay">
            <h3>${movie.title}</h3>
            <small>${movie.year} • ${movie.genre}</small>
        </div>
        <div class="card-actions">
            <button class="add-btn" aria-label="${isInList(movie.id) ? "Remove from" : "Add to"} My List">
                ${isInList(movie.id) ? "✓" : "+"}
            </button>
        </div>
    `;

    card.addEventListener("click", event => {
        if (event.target.closest(".add-btn")) {
            toggleMyList(movie.id);
            return;
        }
        openModal(movie);
    });

    return card;
}

function renderPopular() {
    popularRow.innerHTML = "";
    movies.forEach(movie => popularRow.appendChild(createMovieCard(movie)));
}

function renderMyList() {
    myListRow.innerHTML = "";
    const selected = myList.map(getMovie).filter(Boolean);

    emptyList.style.display = selected.length ? "none" : "block";
    selected.forEach(movie => myListRow.appendChild(createMovieCard(movie)));
}

function toggleMyList(id) {
    id = Number(id);

    if (isInList(id)) {
        myList = myList.filter(movieId => movieId !== id);
        showToast("Removed from My List");
    } else {
        myList.push(id);
        showToast("Added to My List");
    }

    saveList();
    renderPopular();
    renderMyList();

    if (selectedMovie && selectedMovie.id === id) {
        updateModalListButton();
    }
}

function openModal(movie) {
    selectedMovie = movie;
    document.getElementById("modal-image").src = movie.image;
    document.getElementById("modal-image").alt = movie.title;
    document.getElementById("modal-title").textContent = movie.title;
    document.getElementById("modal-meta").textContent =
        `${movie.year} • ${movie.rating} • ${movie.genre}`;
    document.getElementById("modal-description").textContent = movie.description;

    updateModalListButton();
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    selectedMovie = null;
}

function updateModalListButton() {
    const button = document.getElementById("modal-list-btn");
    button.textContent = isInList(selectedMovie.id) ? "✓ Remove from My List" : "＋ My List";
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function openSearch() {
    searchPanel.classList.add("active");
    searchInput.focus();
    renderSearchResults("");
}

function closeSearch() {
    searchPanel.classList.remove("active");
}

function renderSearchResults(query) {
    const value = query.trim().toLowerCase();
    const results = value
        ? movies.filter(movie =>
            `${movie.title} ${movie.genre}`.toLowerCase().includes(value)
        )
        : movies;

    searchResults.innerHTML = "";

    if (!results.length) {
        searchResults.innerHTML = "<p>No movies or shows found.</p>";
        return;
    }

    results.forEach(movie => searchResults.appendChild(createMovieCard(movie)));
}

document.querySelector(".search-toggle").addEventListener("click", openSearch);
document.getElementById("close-search").addEventListener("click", closeSearch);
searchInput.addEventListener("input", event => renderSearchResults(event.target.value));

document.getElementById("modal-close").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
        closeSearch();
    }
});

document.getElementById("modal-list-btn").addEventListener("click", () => {
    if (selectedMovie) toggleMyList(selectedMovie.id);
});

document.getElementById("play-btn").addEventListener("click", () => {
    if (selectedMovie) showToast(`Playing ${selectedMovie.title}...`);
});

document.querySelectorAll(".carousel-btn").forEach(button => {
    button.addEventListener("click", () => {
        const row = document.getElementById(button.dataset.target);
        const amount = row.clientWidth * 0.8 * Number(button.dataset.direction);
        row.scrollBy({ left: amount, behavior: "smooth" });
    });
});

document.getElementById("email-form").addEventListener("submit", event => {
    event.preventDefault();

    const input = document.getElementById("email-input");
    const message = document.getElementById("form-message");

    if (!input.checkValidity()) {
        message.textContent = "Please enter a valid email address.";
        return;
    }

    message.textContent = "Great! Your membership journey can start here.";
    input.value = "";
});

document.querySelector(".sign-in").addEventListener("click", () => {
    showToast("Sign-in page coming next!");
});

renderPopular();
renderMyList();
