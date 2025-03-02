import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import debounce from "lodash.debounce"; 
import "bootstrap/dist/css/bootstrap.min.css";

const API_KEY = "8643af21";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem("watchlist")) || []);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}&s=Avengers`)
      .then((res) => res.json())
      .then((data) => setTrending(data.Search || []));
  }, []);

  const fetchMovies = debounce((searchTerm) => {
    if (searchTerm.length > 2) {
      setLoading(true);
      fetch(`${API_URL}&s=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.Response === "True") {
            setMovies(data.Search);
            setError(null);
          } else {
            setMovies([]);
            setError("No movies found.");
          }
        })
        .catch(() => setError("Error fetching data."))
        .finally(() => setLoading(false));
    } else {
      setMovies([]);
    }
  }, 500);

  useEffect(() => {
    fetchMovies(query);
  }, [query]);

  const addToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const addToWatchlist = (movie) => {
    if (!watchlist.some((item) => item.imdbID === movie.imdbID)) {
      const updatedWatchlist = [...watchlist, movie];
      setWatchlist(updatedWatchlist);
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    }
  };

  const highlightMatch = (title) => {
    const regex = new RegExp(`(${query})`, "gi");
    return title.replace(regex, (match) => `<strong class="text-danger">${match}</strong>`);
  };

  return (
    <div className="container text-center mt-4">
      <h2 className="text-warning fw-bold">🎬 Search for Movies</h2>
      <div className="position-relative w-50 mx-auto">
        <input
          type="text"
          className="form-control shadow-sm text-center border-2"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="btn btn-danger position-absolute top-50 end-0 translate-middle-y" onClick={() => setQuery("")}>
            ❌
          </button>
        )}
        {movies.length > 0 && (
          <ul className="list-group position-absolute w-100 mt-2">
            {movies.slice(0, 5).map((movie) => (
              <li
                key={movie.imdbID}
                className="list-group-item"
                onClick={() => setQuery(movie.Title)}
                dangerouslySetInnerHTML={{ __html: highlightMatch(movie.Title) }}
              />
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="text-muted mt-3">Loading...</p>}
      {error && <p className="text-danger mt-3">{error}</p>}

      <h3 className="text-primary mt-4">🔍 Search Results</h3>
      <div className="row mt-3 justify-content-center">
        {movies.map((movie) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={movie.imdbID}>
            <div className="card shadow-lg rounded border-0">
              <img src={movie.Poster} className="card-img-top" alt={movie.Title} />
              <div className="card-body text-center">
                <h5 className="card-title text-primary">{movie.Title}</h5>
                <Link to={`/movie/${movie.imdbID}`} className="btn btn-outline-info">📄 Details</Link>
                <button className="btn btn-outline-warning ms-2" onClick={() => addToFavorites(movie)}>❤️ Favorite</button>
                <button className="btn btn-outline-success ms-2" onClick={() => addToWatchlist(movie)}>🔖 Watchlist</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-success mt-5">🔥 Trending Movies</h3>
      <div className="row mt-3 justify-content-center">
        {trending.map((movie) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={movie.imdbID}>
            <div className="card shadow-lg rounded border-0">
              <img src={movie.Poster} className="card-img-top" alt={movie.Title} />
              <div className="card-body text-center">
                <h5 className="card-title text-primary">{movie.Title}</h5>
                <Link to={`/movie/${movie.imdbID}`} className="btn btn-outline-info">📄 Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  if (!movie) return <h3 className="text-center">Loading...</h3>;

  return (
    <div className="container text-center mt-4">
      <h2 className="text-warning">{movie.Title}</h2>
      <img src={movie.Poster} className="img-fluid rounded shadow" alt={movie.Title} />
      <p className="mt-3">{movie.Plot}</p>
      <h5>⭐ {movie.imdbRating}</h5>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <Link to="/" className="btn btn-outline-primary">🔙 Back</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container d-flex justify-content-between">
          <Link className="navbar-brand text-warning fw-bold" to="/">🎬 IMDB Clone</Link>
          <div>
            <Link className="btn btn-outline-light me-2" to="/favorites">❤️ Favorites</Link>
            <Link className="btn btn-outline-light" to="/watchlist">🔖 Watchlist</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
