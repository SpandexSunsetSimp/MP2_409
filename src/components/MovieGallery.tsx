import React, { useState, useEffect, useMemo } from 'react';
import { fetchPopularMovies, fetchMovieGenres } from '../api';
import { MovieListItem, Genre } from '../types';
import { MovieCard } from './MovieCard';
import './MovieGallery.css';

export function MovieGallery() {
  const [allMovies, setAllMovies] = useState<MovieListItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError(null);
        if (currentPage === 1) {
            const genresResponse = await fetchMovieGenres();
            setGenres(genresResponse);
        }
        const moviesResponse = await fetchPopularMovies(currentPage);
        setAllMovies(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMovies = moviesResponse.results.filter(movie => movie.poster_path && !existingIds.has(movie.id));
            return [...prev, ...newMovies];
        });
        setTotalPages(moviesResponse.total_pages);
      } catch (err) {
        setError('Failed to load movie data or genres. Check your API key or network connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [currentPage]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(genreId)) {
        newSet.delete(genreId);
      } else {
        newSet.add(genreId);
      }
      return newSet;
    });
  };

  const filteredMovies = useMemo(() => {
    if (selectedGenreIds.size === 0) {
      return allMovies;
    }
    const selectedIdsArray = Array.from(selectedGenreIds);
    return allMovies.filter(movie =>
      selectedIdsArray.every(genreId => movie.genre_ids.includes(genreId))
    );
  }, [allMovies, selectedGenreIds]);

  const loadMoreMovies = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading && allMovies.length === 0) return <div className="loading">Loading movies...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-gallery-view">
      <h2>Popular Movies</h2>
      <div className="genre-filters">
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => handleGenreToggle(genre.id)}
            className={selectedGenreIds.has(genre.id) ? 'active' : ''}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No movies found for the selected genres. Try removing some filters or loading more movies.</p>
        )}
      </div>
      {!loading && currentPage < totalPages && (
        <button onClick={loadMoreMovies} className="load-more-button">Load More</button>
      )}
      {loading && allMovies.length > 0 && <div className="loading-small">Loading more...</div>}
    </div>
  );
}