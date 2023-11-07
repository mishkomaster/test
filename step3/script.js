"use strict";
document.addEventListener('DOMContentLoaded', siteCode);
let movies = [];
const idSorter = (first, second) => first.id - second.id;
const nameSorter = (first, second) => first.movie_name.localeCompare(second.movie_name);
const directorSorter = (first, second) => first.director.localeCompare(second.director);
const yearSorter = (first, second) => first.release_date - second.release_date;
const oscarSorter = (first, second) => second.oscars?.wins.length - first.oscars?.wins.length;
async function siteCode() {
    const data = await loadData();
    movies = data;
    fillGenres(movies);
    displayMovies(movies);
    const idSort = document.getElementById('sort-id');
    const nameSort = document.getElementById('sort-name');
    const directorSort = document.getElementById('sort-director');
    const yearSort = document.getElementById('sort-year');
    const oscarSort = document.getElementById('sort-oscar');
    idSort.addEventListener('click', () => sortByid(idSort));
    nameSort.addEventListener('click', () => sortByName(nameSort));
    directorSort.addEventListener('click', () => sortByDirector(directorSort));
    yearSort.addEventListener('click', () => sortByYear(yearSort));
    oscarSort.addEventListener('click', () => sortByOscar(oscarSort));
    const applyFilterButton = document.getElementById('apply-filter');
    applyFilterButton.addEventListener('click', applyGenreFilter);
    const nameFilter = document.getElementById('name-filter');
    nameFilter.addEventListener('input', applyNameFilter);
    const actorFilter = document.getElementById('actor-filter');
    actorFilter.addEventListener('input', applyActorFilter);
}
function updateSortArrow(element, isAscending) {
    const arrows = Array.from(element.querySelectorAll('.sort-arrow'));
    for (const arrow of arrows) {
        arrow.style.display = 'none';
    }
    const arrow = isAscending ? element.querySelector('.sort-arrow.up') : element.querySelector('.sort-arrow.down');
    if (arrow) {
        arrow.style.display = 'inline';
        arrow.innerHTML = isAscending ? '&#8593;' : '&#8595;';
        arrow.style.color = isAscending ? 'green' : 'red';
    }
}
const sortByName = (element) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);
    const sortedMovies = movies.toSorted(nameSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
};
const sortByDirector = (element) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);
    const sortedMovies = movies.toSorted(directorSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
};
const sortByid = (element) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);
    const sortedMovies = movies.toSorted(idSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
};
const sortByYear = (element) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);
    const sortedMovies = movies.toSorted(yearSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
};
const sortByOscar = (element) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);
    const sortedMovies = movies.toSorted(oscarSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////FILTER DATA////////////////////////////////
const fillGenres = (movies) => {
    const filter = document.getElementById('genre-filter');
    const genres = new Set();
    for (const movie of movies) {
        for (const genre of movie.genre) {
            genres.add(genre);
        }
    }
    for (const genre of genres) {
        const option = document.createElement('option');
        option.value = genre;
        option.innerHTML = genre;
        filter.appendChild(option);
    }
};
const applyGenreFilter = () => {
    const genreElement = document.getElementById('genre-filter');
    const selectedGenre = genreElement.value;
    const oscarElement = document.getElementById('oscar-filter');
    const oscar = oscarElement.value.toLowerCase();
    let filteredMovies = movies;
    //by oscars yes/no
    if (selectedGenre !== "all") {
        filteredMovies = filteredMovies.filter(movie => movie.genre.includes(selectedGenre));
    }
    if (oscar !== "all") {
        filteredMovies = filteredMovies.filter(movie => {
            if (oscar === "yes") {
                return movie.oscars && movie.oscars.wins.length > 0;
            }
            return !movie.oscars || movie.oscars.wins.length === 0;
        });
    }
    displayMovies(filteredMovies);
};
//by name
const applyNameFilter = () => {
    const nameFilter = document.getElementById('name-filter');
    const searchQuery = nameFilter.value.toLowerCase();
    let filteredMovies = movies;
    if (searchQuery.trim() !== '') {
        filteredMovies = filteredMovies.filter(movie => movie.movie_name.toLowerCase().includes(searchQuery));
    }
    displayMovies(filteredMovies);
};
const applyActorFilter = () => {
    const actorFilter = document.getElementById('actor-filter');
    const searchQuery = actorFilter.value.toLowerCase();
    let filteredMovies = movies;
    if (searchQuery.trim() !== '') {
        filteredMovies = filteredMovies.filter(movie => movie.actors.some(actor => actor.name.toLowerCase().includes(searchQuery)));
    }
    displayMovies(filteredMovies);
};
////////////////////////////////////////load data//////////////////////////////
const loadData = async () => {
    const dataUri = "https://raw.githubusercontent.com/KichoX/movies-json/main/BezArray.json";
    const response = await fetch(dataUri);
    if (!response.ok) {
        throw new Error("The data is not there");
    }
    const data = await response.json();
    return data;
};
////////////////////////////////     DISPLAY  DATA    /////////////////////////////////////////////////
function displayMovies(moives) {
    const container = document.getElementById("movie-container");
    container.innerHTML = "";
    for (const movie of moives) {
        const movieRow = generateMovieRow(movie);
        container.appendChild(movieRow);
    }
}
const generateMovieRow = (movie) => {
    const row = document.createElement("div");
    row.classList.add("movie-row");
    // ID CELL //
    const idCell = document.createElement("div");
    idCell.classList.add("movie-data", "movie-id");
    idCell.innerHTML = movie.id.toString();
    row.appendChild(idCell);
    //////////////
    // NAME CELL //
    const nameCell = document.createElement("div");
    nameCell.classList.add("movie-data", "movie-name");
    nameCell.innerHTML = movie.movie_name;
    row.appendChild(nameCell);
    //////////////
    // DIRECTOR CELL //
    const directorCell = document.createElement("div");
    directorCell.classList.add("movie-data", "movie-director");
    directorCell.innerHTML = movie.director;
    row.appendChild(directorCell);
    //////////////
    // RELESE YEAR //
    const relaseCell = document.createElement("div");
    relaseCell.classList.add("movie-data", "movie-relese");
    relaseCell.innerHTML = movie.release_date.toString();
    row.appendChild(relaseCell);
    //////////////
    // GENRE//
    const genreCell = document.createElement("div");
    genreCell.classList.add("movie-data", "movie-genre");
    genreCell.innerHTML = movie.genre.join(" / ");
    row.appendChild(genreCell);
    //////////////
    // PLOT CELL //
    const plotCell = document.createElement("div");
    plotCell.classList.add("movie-data", "movie-plot");
    const plotText = movie.plot.length > 30 ? movie.plot.substring(0, 30) + "..." : movie.plot;
    plotCell.innerHTML = plotText;
    row.appendChild(plotCell);
    // ACTORS CELL //
    const actorsCell = document.createElement("div");
    actorsCell.classList.add("movie-data", "movie-actors");
    const actorList = document.createElement("ul");
    actorList.id = "movie-details-actor-list";
    for (const actor of movie.actors) {
        const actorItem = document.createElement("li");
        actorItem.innerText = `${actor.name} (${actor.role})`;
        actorList.appendChild(actorItem);
    }
    actorsCell.appendChild(actorList);
    row.appendChild(actorsCell);
    /////////////////
    //Oscars CELL //
    const oscarsCell = document.createElement("div");
    oscarsCell.classList.add("movie-data", "movie-oscars");
    if (movie.oscars && movie.oscars.wins) {
        const numOscars = movie.oscars.wins.length;
        oscarsCell.innerHTML = numOscars.toString();
    }
    else {
        oscarsCell.innerHTML = "0";
    }
    row.appendChild(oscarsCell);
    return row;
};
//////////////////////////////////////////////////////////////
