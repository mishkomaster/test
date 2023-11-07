interface Movie {
    id: number
    movie_name: string
    release_date: number
    genre: string[]
    oscars?: Oscars
    actors: Actor[]
    rating: number
    plot: string
    director: string
}
interface Oscars {
    nominations: Nomination[]
    wins: Win[]
}
interface Nomination {
    category: string
    nominees: Nominee[]
}
interface Nominee {
    actor_name: string
    role: string
}
interface Win {
    category: string
    winner: Winner
}
interface Winner {
    actor_name: string
    role: string
}
interface Actor {
    name: string
    role: string
}

////////////////////////////////     LOAD DATA      /////////////////////////////////////////
document.addEventListener('DOMContentLoaded', siteCode);
let movies: Movie[] = [];

async function siteCode() {
    const data = await loadData();
    movies = data;


    displayMovies(movies);

}

const loadData = async () => {
    const dataUri = "https://raw.githubusercontent.com/KichoX/movies-json/main/5311.json";
    const response = await fetch(dataUri);

    if (!response.ok) {
        throw new Error("The data is not there");
    }

    const data = await response.json();
    return data;
}

////////////////////////////////     DISPLAY  DATA    /////////////////////////////////////////////////

function displayMovies(moives: Movie[]) {

    const container = document.getElementById("movie-container")!;
    container.innerHTML = "";
    for (const movie of moives) {
        const movieRow = generateMovieRow(movie);
        container.appendChild(movieRow);
    }

}

const generateMovieRow = (movie: Movie) => {
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
    actorList.id = "movie-details-actor-list"
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
    } else {
        oscarsCell.innerHTML = "0";
    }
    row.appendChild(oscarsCell);


    return row;
}