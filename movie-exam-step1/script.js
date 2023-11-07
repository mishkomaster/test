"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
////////////////////////////////     LOAD DATA      /////////////////////////////////////////
document.addEventListener('DOMContentLoaded', siteCode);
let movies = [];
function siteCode() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield loadData();
        movies = data;
        displayMovies(movies);
    });
}
const loadData = () => __awaiter(void 0, void 0, void 0, function* () {
    const dataUri = "https://raw.githubusercontent.com/KichoX/movies-json/main/5311.json";
    const response = yield fetch(dataUri);
    if (!response.ok) {
        throw new Error("The data is not there");
    }
    const data = yield response.json();
    return data;
});
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
