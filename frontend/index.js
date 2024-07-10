const apiKey = `af7edb53`;
let dataReq = `http://www.omdbapi.com/?apikey=${apiKey}&t=`;
let posterReq = `http://img.omdbapi.com/?apikey=${apiKey}&`;

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
        event.preventDefault(); // Prevent form submission
        alert('Search field is required!');
      }
    else{
        const movieInfo = await fetchMovieData(dataReq + searchQuery);

        if (movieInfo) {
            const display = document.getElementById('display');
            display.innerHTML = ''; // Clear previous results

            // Create a new division for the movie result
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie-result');

            // Create the poster element
            const posterImg = document.createElement('img');
            posterImg.src = movieInfo.Poster;
            posterImg.alt = movieInfo.Title + ' Poster';
            posterImg.classList.add('movie-poster');

            // Create the info element
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('movie-info');
            infoDiv.innerHTML = `
                <h2>${movieInfo.Title}</h2>
                <p><strong>Year:</strong> ${movieInfo.Year}</p>
                <p><strong>Genre:</strong> ${movieInfo.Genre}</p>
                <p><strong>Director:</strong> ${movieInfo.Director}</p>
                <p><strong>Plot:</strong> ${movieInfo.Plot}</p>
            `;

            // Append poster and info to the movie result division
            movieDiv.appendChild(posterImg);
            movieDiv.appendChild(infoDiv);

            // Append the movie result division to the display
            display.appendChild(movieDiv);
    }}
});
