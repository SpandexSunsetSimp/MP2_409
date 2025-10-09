import axios from 'axios';
import {
  TMDBListResponse,
  MovieListItem,
  MovieDetailData,
  GenreListResponse,
  Genre
} from './types';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const apiClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const fetchPopularMovies = async (page: number = 1): Promise<TMDBListResponse<MovieListItem>> => {
  try {
    const response = await apiClient.get<TMDBListResponse<MovieListItem>>('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<TMDBListResponse<MovieListItem>> => {
  try {
    const response = await apiClient.get<TMDBListResponse<MovieListItem>>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching movies for "${query}":`, error);
    throw error;
  }
};

export const fetchMovieDetail = async (id: number): Promise<MovieDetailData> => {
  try {
    const response = await apiClient.get<MovieDetailData>(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ID "${id}":`, error);
    throw error;
  }
};

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  try {
    const response = await apiClient.get<GenreListResponse>('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    throw error;
  }
};