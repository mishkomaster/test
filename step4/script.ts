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


type MovieSorter = (first: Movie, second: Movie) => number;
document.addEventListener('DOMContentLoaded', siteCode);
let movies: Movie[] = [];

const idSorter: MovieSorter = (first, second) => first.id - second.id;
const nameSorter: MovieSorter = (first, second) => first.movie_name.localeCompare(second.movie_name);
const directorSorter : MovieSorter = (first, second) => first.director.localeCompare(second.director);
const yearSorter : MovieSorter = (first, second) => first.release_date - second.release_date;
const oscarSorter : MovieSorter = (first, second) =>  second.oscars?.wins.length! - first.oscars?.wins.length!;


async function siteCode() {
    const data = await loadData();
    movies = data;

    fillGenres(movies);
    
    displayMovies(movies);

    
    const idSort = document.getElementById('sort-id') as HTMLElement;
    const nameSort = document.getElementById('sort-name') as HTMLElement;
    const directorSort = document.getElementById('sort-director') as HTMLElement;
    const yearSort = document.getElementById('sort-year') as HTMLElement;
    const oscarSort = document.getElementById('sort-oscar') as HTMLElement;
    

    idSort.addEventListener('click', () => sortByid(idSort));
    nameSort.addEventListener('click', () => sortByName(nameSort));
    directorSort.addEventListener('click', () => sortByDirector(directorSort));
    yearSort.addEventListener('click', () => sortByYear(yearSort));
    oscarSort.addEventListener('click', () => sortByOscar(oscarSort));


    
  const applyFilterButton = document.getElementById('apply-filter')!;
  applyFilterButton.addEventListener('click', applyGenreFilter);

  const nameFilter = document.getElementById('name-filter') as HTMLInputElement;
  nameFilter.addEventListener('input', applyNameFilter);

  const actorFilter = document.getElementById('actor-filter') as HTMLInputElement;
  actorFilter.addEventListener('input', applyActorFilter);

    
}


//////////////////////////////// SORT DATA /////////////////////////////////////

function updateSortArrow(element: HTMLElement, isAscending: boolean) {
    const arrows = Array.from(element.querySelectorAll('.sort-arrow')) as HTMLElement[];
    for (const arrow of arrows) {
        arrow.style.display = 'none';
    }

    const arrow = isAscending ? element.querySelector('.sort-arrow.up') as HTMLElement : element.querySelector('.sort-arrow.down') as HTMLElement;
    if (arrow) {
        arrow.style.display = 'inline';
        arrow.innerHTML = isAscending ? '&#8593;' : '&#8595;'; 
        arrow.style.color = isAscending ? 'green' : 'red'; 
    }
}

const sortByName = (element: HTMLElement) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);

    const sortedMovies = movies.toSorted(nameSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
}

const sortByDirector = (element: HTMLElement) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);

    const sortedMovies = movies.toSorted(directorSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
}

const sortByid = (element: HTMLElement) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);

    const sortedMovies = movies.toSorted(idSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
};

const sortByYear = (element: HTMLElement) => {
    const isAscending = !element.classList.contains('asc');
    updateSortArrow(element, isAscending);
    element.classList.toggle('asc', isAscending);

    const sortedMovies = movies.toSorted(yearSorter);
    if (!isAscending) {
        sortedMovies.reverse();
    }
    displayMovies(sortedMovies);
};

const sortByOscar = (element: HTMLElement) => {
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
const fillGenres = (movies: Movie[]) => {
    const filter = document.getElementById('genre-filter') as HTMLSelectElement;
  
    const genres = new Set<string>();
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
  }



  const applyGenreFilter = () => {
    const genreElement = document.getElementById('genre-filter') as HTMLSelectElement;
    const selectedGenre = genreElement.value;
  
    const oscarElement = document.getElementById('oscar-filter') as HTMLSelectElement;
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
  }
  
  
  //by name
  const applyNameFilter = () => {
    const nameFilter = document.getElementById('name-filter') as HTMLInputElement;
    const searchQuery = nameFilter.value.toLowerCase();
  
    let filteredMovies = movies;
  
    if (searchQuery.trim() !== '') {
      filteredMovies = filteredMovies.filter(movie => movie.movie_name.toLowerCase().includes(searchQuery));
    }
  
    displayMovies(filteredMovies);
  }
  
  const applyActorFilter = () => {
    const actorFilter = document.getElementById('actor-filter') as HTMLInputElement;
    const searchQuery = actorFilter.value.toLowerCase();
  
    let filteredMovies = movies;
  
    if (searchQuery.trim() !== '') {
      filteredMovies = filteredMovies.filter(movie => movie.actors.some(actor => actor.name.toLowerCase().includes(searchQuery)));
    }
  
    displayMovies(filteredMovies);
  }



////////////////////////////////////////load data//////////////////////////////
const loadData = async () => {
    const dataUri = "https://raw.githubusercontent.com/KichoX/movies-json/main/BezArray.json";
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
    plotCell.addEventListener("click", () => {
        const modal = document.getElementById("plot-details")!;
        modal.classList.remove("hidden");

        const modalHeader = document.querySelector("#plot-details-content h2")! as HTMLHeadingElement;
        modalHeader.innerText = `Plot for: ${movie.movie_name}`;

        const plotParagraph = document.getElementById("movie-details-plot")!;
        plotParagraph.innerText = movie.plot;
    });
    row.appendChild(plotCell);


// ACTORS CELL //
const actorsCell = document.createElement("div");
actorsCell.classList.add("movie-data", "movie-actors");


if (movie.actors && movie.actors.length > 0) {
  const actorCount = movie.actors.length;
  actorsCell.innerHTML = `The movie has  ${actorCount} ${actorCount === 1 ? 'Actor' : 'Actors'}`;
  } else {
      actorsCell.innerHTML = "No Oscars";
  }


actorsCell.addEventListener("click", () => {
    const modal = document.getElementById("movie-details")!;
    modal.classList.remove("hidden");

    const modalHeader = document.querySelector("#movie-details-content h2")! as HTMLHeadingElement;
    modalHeader.innerText = `Selected Actors for ${movie.movie_name}`;

    const actorList = document.getElementById("movie-details-actor-list")! as HTMLUListElement;
      actorList.innerHTML = "";
      for (const actor of (movie.actors || []).slice().sort((a, b) => a.name.localeCompare(b.name))) {
          const actorItem = document.createElement("li");
          actorItem.innerText = `${actor.name} (${actor.role})`;
          actorList.appendChild(actorItem);
      }
})
row.appendChild(actorsCell);
//////////////


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

//////////////////////////////////////////////////////////////


if (document) {
    document.addEventListener('click', (event) => {
      const actorsModal = document.getElementById('movie-details');
      if (actorsModal && event.target === actorsModal) {
        actorsModal.classList.add('hidden');
      }

      const plotModal = document.getElementById('plot-details');
      if(plotModal && event.target === plotModal){
        plotModal.classList.add('hidden');
      }
    });
  }