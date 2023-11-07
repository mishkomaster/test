"use strict";
document.addEventListener('DOMContentLoaded', siteCode);
let movies = [];
//////////////////////////////// WORKING WITH DATA AND APPLY //////////////////////////////////
async function siteCode() {
    const data = await loadData();
    movies = data;
    fillGenres(movies);
    displayMovies(movies);
    const nameSort = document.getElementById('sort-name');
    nameSort.addEventListener('click', sortByName);
    const idSort = document.getElementById('sort-id');
    idSort.addEventListener('click', sortByid);
    const yearSort = document.getElementById('sort-year');
    yearSort.addEventListener('click', sortByYear);
    const oscarSort = document.getElementById('sort-year');
    oscarSort.addEventListener('click', sortByOscar);
    const applyFilterButton = document.getElementById('apply-filter');
    applyFilterButton.addEventListener('click', applyGenreFilter);
    const nameFilter = document.getElementById('name-filter');
    nameFilter.addEventListener('input', applyNameFilter);
    const actorFilter = document.getElementById('actor-filter');
    actorFilter.addEventListener('input', applyActorFilter);
}
//////////////////////////////// SORT //////////////////////////////////////////////////////////
const nameSorter = (first, second) => first.movie_name.localeCompare(second.movie_name);
const idSorter = (first, second) => first.id - second.id;
const yearSorter = (first, second) => first.release_date - second.release_date;
const oscarSorter = (first, second) => second.oscars?.wins.length - first.oscars?.wins.length;
const sortByName = () => {
    const sortedMovies = movies.toSorted(nameSorter);
    displayMovies(sortedMovies);
};
const sortByid = () => {
    const sortedMovies = movies.toSorted(idSorter);
    displayMovies(sortedMovies);
};
const sortByYear = () => {
    const sortedMovies = movies.toSorted(yearSorter);
    displayMovies(sortedMovies);
};
const sortByOscar = () => {
    const sortedMovies = movies.toSorted(oscarSorter);
    displayMovies(sortedMovies);
};
//////////////////////////////// FILTER ////////////////////////////////////////////////////////
//by genre
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
    const oscar = oscarElement.value.toLowerCase(); // Convert the value to lowercase
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
//////////////////////////////// TO GET THE DATA FROM URI //////////////////////////////////////
const loadData = async () => {
    const dataUri = "https://raw.githubusercontent.com/KichoX/movies-json/main/BezArray.json";
    const response = await fetch(dataUri);
    if (!response.ok) {
        throw new Error("The data is not there");
    }
    const data = await response.json();
    return data;
};
/////////////////////////////// LOOP ALL THE MOVIES ///////////////////////////////////////////
function displayMovies(moives) {
    const container = document.getElementById("movie-container");
    container.innerHTML = "";
    for (const movie of moives) {
        const movieRow = generateMovieRow(movie);
        container.appendChild(movieRow);
    }
}
/////////////////////////////// GENERATE FOR EACH MOVIE ///////////////////////////////////////////
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
    plotCell.addEventListener("click", () => {
        const modal = document.getElementById("plot-details");
        modal.classList.remove("hidden");
        const modalHeader = document.querySelector("#plot-details-content h2");
        modalHeader.innerText = `Plot for: ${movie.movie_name}`;
        const plotParagraph = document.getElementById("movie-details-plot");
        plotParagraph.innerText = movie.plot;
    });
    row.appendChild(plotCell);
    /////////////////
    // ACTORS CELL //
    const actorsCell = document.createElement("div");
    actorsCell.classList.add("movie-data", "movie-actors");
    if (movie.actors && movie.actors.length > 0) {
        const actorCount = movie.actors.length;
        actorsCell.innerHTML = `The movie has  ${actorCount} ${actorCount === 1 ? 'Actor' : 'Actors'}`;
    }
    else {
        actorsCell.innerHTML = "No Oscars";
    }
    actorsCell.addEventListener("click", () => {
        const modal = document.getElementById("movie-details");
        modal.classList.remove("hidden");
        const modalHeader = document.querySelector("#movie-details-content h2");
        modalHeader.innerText = `Selected Actors for ${movie.movie_name}`;
        const actorList = document.getElementById("movie-details-actor-list");
        actorList.innerHTML = "";
        for (const actor of (movie.actors || []).toSorted((a, b) => a.name.localeCompare(b.name))) {
            const actorItem = document.createElement("li");
            actorItem.innerText = `${actor.name} (${actor.role})`;
            actorList.appendChild(actorItem);
        }
    });
    row.appendChild(actorsCell);
    //////////////
    //Oscars CELL //
    const oscarsCell = document.createElement("div");
    oscarsCell.classList.add("movie-data", "movie-oscars");
    if (movie.oscars && movie.oscars.wins && movie.oscars.wins.length > 0) {
        const oscarCount = movie.oscars.wins.length;
        oscarsCell.innerHTML = `${oscarCount} ${oscarCount === 1 ? 'Oscar' : 'Oscars'}`;
    }
    else {
        oscarsCell.innerHTML = "No Oscars";
    }
    oscarsCell.addEventListener("click", () => {
        const modal = document.getElementById("oscars-details");
        modal.classList.remove("hidden");
        const modalHeader = document.querySelector("#oscars-details-content h2");
        modalHeader.innerText = `Selected Oscars for ${movie.movie_name}`; // Use backticks for the template literal
        const oscarsList = document.getElementById("movie-details-oscar-list"); // Update the ID to "movie-details-oscar-list"
        oscarsList.innerHTML = "";
        if (movie.oscars) {
            for (const nomination of movie.oscars.nominations) {
                const nominationItem = document.createElement("li");
                nominationItem.innerHTML = `<strong>Nomination for : ${nomination.category}-</strong>`;
                const nomineeList = document.createElement("ul");
                for (const nominee of nomination.nominees) {
                    const nomineeItem = document.createElement("li");
                    nomineeItem.innerHTML = `${nominee.actor_name} (${nominee.role})`;
                    nomineeList.appendChild(nomineeItem);
                }
                nominationItem.appendChild(nomineeList);
                oscarsList.appendChild(nominationItem);
            }
            if (movie.oscars.wins && movie.oscars.wins.length > 0) {
                const winsItem = document.createElement("li");
                winsItem.innerHTML = `<strong>Wins:</strong>`;
                const winList = document.createElement("ul");
                for (const win of movie.oscars.wins) {
                    const winItem = document.createElement("li");
                    winItem.innerHTML = `${win.winner.actor_name} (${win.winner.role}) - ${win.category}`;
                    winList.appendChild(winItem);
                }
                winsItem.appendChild(winList);
                oscarsList.appendChild(winsItem);
            }
            else {
                // No Oscars wins
                const noOscarsWins = document.createElement("li");
                noOscarsWins.innerText = "No Oscars wins for this movie.";
                oscarsList.appendChild(noOscarsWins);
            }
        }
        else {
            // No Oscars information available
            const noOscarsInfo = document.createElement("li");
            noOscarsInfo.innerText = "No Oscars information available for this movie.";
            oscarsList.appendChild(noOscarsInfo);
        }
    });
    row.appendChild(oscarsCell);
    //////////////
    // // RATING //
    // const ratingCell = document.createElement("div");
    // ratingCell.classList.add("movie-data", "movie-rating");
    // ratingCell.innerHTML = movie.rating.toString();
    // row.appendChild(ratingCell);
    // //////////////
    return row;
};
// Click outsite to close pop-up //
if (document) {
    document.addEventListener('click', (event) => {
        const actorsModal = document.getElementById('movie-details');
        if (actorsModal && event.target === actorsModal) {
            actorsModal.classList.add('hidden');
        }
        const oscarsModal = document.getElementById('oscars-details');
        if (oscarsModal && event.target === oscarsModal) {
            oscarsModal.classList.add('hidden');
        }
        const plotModal = document.getElementById('plot-details');
        if (plotModal && event.target === plotModal) {
            plotModal.classList.add('hidden');
        }
    });
}
