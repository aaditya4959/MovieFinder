const apiKey = `af7edb53`;
let dataReq = `http://www.omdbapi.com/?apikey=${apiKey}&s=`;
let detailReq = `http://www.omdbapi.com/?apikey=${apiKey}&i=`;

async function fetchMovieData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    const searchQuery = document.getElementById('search').value;
    if (!searchQuery) {
        alert('Search field is required!');
    } else {
        const url = new URL(window.location);
        url.searchParams.set('q', searchQuery);
        url.searchParams.set('page', 1);
        window.history.pushState({}, '', url);
        await performSearch(searchQuery, 1);
    }
});

async function performSearch(query, page) {
    const movieList = await fetchMovieData(`${dataReq}${query}&page=${page}`);
    if (movieList && movieList.Search) {
        const display = document.getElementById('display');
        display.innerHTML = ''; // Clear previous results

        for (const movie of movieList.Search) {
            const movieDetails = await fetchMovieData(detailReq + movie.imdbID);
            if (movieDetails) {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie-result');

                const posterImg = document.createElement('img');
                posterImg.src = movieDetails.Poster;
                posterImg.alt = movieDetails.Title + ' Poster';
                posterImg.classList.add('movie-poster');

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('movie-info');
                infoDiv.innerHTML = `
                    <h2>${movieDetails.Title}</h2>
                    <p><strong>Year:</strong> ${movieDetails.Year}</p>
                    <p><strong>Genre:</strong> ${movieDetails.Genre}</p>
                    <p><strong>Director:</strong> ${movieDetails.Director}</p>
                    <p><strong>Cast:</strong> ${movieDetails.Actors}</p>
                    <p><strong>Plot:</strong> ${movieDetails.Plot}</p>
                `;

                movieDiv.appendChild(posterImg);
                movieDiv.appendChild(infoDiv);
                display.appendChild(movieDiv);
            }
        }

        setupPagination(query, page, movieList.totalResults);
    }
}

function setupPagination(query, currentPage, totalResults) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Clear previous pagination

    const totalPages = Math.ceil(totalResults / 10);
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = '<<';
        prevButton.addEventListener('click', () => {
            const url = new URL(window.location);
            url.searchParams.set('q', query);
            url.searchParams.set('page', currentPage - 1);
            window.history.pushState({}, '', url);
            performSearch(query, currentPage - 1);
        });
        paginationDiv.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            const url = new URL(window.location);
            url.searchParams.set('q', query);
            url.searchParams.set('page', i);
            window.history.pushState({}, '', url);
            performSearch(query, i);
        });
        paginationDiv.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = '>>';
        nextButton.addEventListener('click', () => {
            const url = new URL(window.location);
            url.searchParams.set('q', query);
            url.searchParams.set('page', currentPage + 1);
            window.history.pushState({}, '', url);
            performSearch(query, currentPage + 1);
        });
        paginationDiv.appendChild(nextButton);
    }
}

// Handle URL parameters
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const page = parseInt(urlParams.get('page')) || 1;

    if (query) {
        document.getElementById('search').value = query;
        await performSearch(query, page);
    }
});
