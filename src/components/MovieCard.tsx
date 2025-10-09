import React from 'react';
import { Link } from 'react-router-dom';
import { MovieListItem } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../api';
import './MovieCard.css';

interface MovieCardProps {
  movie: MovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img src={posterUrl} alt={movie.title} />
        <h3>{movie.title}</h3>
      </Link>
    </div>
  );
}