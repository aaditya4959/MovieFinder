const apiKey = `af7edb53`;
let dataReq = `http://www.omdbapi.com/?apikey=${apiKey}&t=`;
let posterReq = `http://img.omdbapi.com/?apikey=${apiKey}&`;

async function fetchMovieData (url){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data);
    }catch{
        console.error('There has been a problem with your fetch operation:', error);
    }
}



document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    const searchQuery = document.getElementById('search').value;
    // document.getElementById('searchResult').textContent = `You searched for: ${searchQuery}`;
    fetchMovieData(dataReq+searchQuery);
});




