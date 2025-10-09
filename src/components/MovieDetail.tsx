import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetail, fetchPopularMovies, TMDB_IMAGE_BASE_URL } from '../api';
import { MovieDetailData, MovieListItem } from '../types';
import './MovieDetail.css';

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [popularMovieIds, setPopularMovieIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPopularMoviesForNav() {
      try {
        const response = await fetchPopularMovies();
        setPopularMovieIds(response.results.map(m => m.id));
      } catch (err) {
        console.error('Failed to load popular movies for navigation:', err);
      }
    }
    loadPopularMoviesForNav();
  }, []);

  useEffect(() => {
    async function loadMovieDetail() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const movieId = parseInt(id);
        const movieData = await fetchMovieDetail(movieId);
        setMovie(movieData);
        if (popularMovieIds.length > 0) {
            setCurrentIndex(popularMovieIds.indexOf(movieId));
        }
      } catch (err) {
        setError('Movie not found. Check if the ID is valid or if your API key is correct.');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }
    loadMovieDetail();
  }, [id, popularMovieIds]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (currentIndex === -1 || popularMovieIds.length === 0) return;

    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < popularMovieIds.length) {
      navigate(`/movie/${popularMovieIds[newIndex]}`);
    }
  };

  const posterUrl = movie?.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Poster';
  const backdropUrl = movie?.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
    : '';

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return null;

  return (
    <div className="movie-detail-view" style={{ backgroundImage: backdropUrl ? `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${backdropUrl})` : 'none' }}>
      <div className="detail-content">
        <img src={posterUrl} alt={movie.title} className="detail-poster" />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10</p>
          {movie.runtime && <p><strong>Runtime:</strong> {movie.runtime} minutes</p>}
          <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          <h3>Overview</h3>
          <p>{movie.overview}</p>
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button onClick={() => handleNavigate('prev')} disabled={currentIndex <= 0}>
          &larr; Previous
        </button>
        <button onClick={() => handleNavigate('next')} disabled={currentIndex >= popularMovieIds.length - 1}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
}