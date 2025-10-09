import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchPopularMovies, searchMovies } from '../api';
import { MovieListItem } from '../types';
import './MovieList.css';

export function MovieList() {
  const [allMovies, setAllMovies] = useState<MovieListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortProperty, setSortProperty] = useState<'title' | 'release_date'>('release_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);
        let response;
        if (searchQuery) {
          response = await searchMovies(searchQuery, currentPage);
        } else {
          response = await fetchPopularMovies(currentPage);
        }
        setAllMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError('Failed to load movies. Check your API key or network connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    const handler = setTimeout(() => {
      loadMovies();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, currentPage]);

  const displayedMovies = useMemo(() => {
    let sortedMovies = [...allMovies];

    sortedMovies.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortProperty === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortProperty === 'release_date') {
        valA = new Date(a.release_date || '1900-01-01').getTime();
        valB = new Date(b.release_date || '1900-01-01').getTime();
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
      return 0;
    });
    return sortedMovies;
  }, [allMovies, sortProperty, sortOrder]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading && allMovies.length === 0) return <div className="loading">Loading movies...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-list-view">
      <h2>Movie List</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select value={sortProperty} onChange={e => setSortProperty(e.target.value as 'title' | 'release_date')}>
          <option value="title">Sort by Title</option>
          <option value="release_date">Sort by Release Date</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul className="text-list">
        {displayedMovies.length > 0 ? (
          displayedMovies.map(movie => (
            <li key={movie.id}>
              <Link to={`/movie/${movie.id}`}>
                {movie.title} ({movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})
              </Link>
            </li>
          ))
        ) : (
          <li>No movies found matching your criteria.</li>
        )}
      </ul>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}