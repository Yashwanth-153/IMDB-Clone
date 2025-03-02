import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = "8643af21";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    const res = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
    setMovie(res.data);
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>{movie.Title}</h2>
      <img src={movie.Poster} alt={movie.Title} className="img-fluid" />
      <p><strong>Year:</strong> {movie.Year}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
    </div>
  );
}

export default MovieDetails;
