export interface TMDBListResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface MovieListItem {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    overview: string;
}

export interface MovieDetailData extends MovieListItem {
    genres: {
        id: number;
        name: string;
    }[];
    runtime: number | null;
    tagline: string | null;
    backdrop_path: string | null;
}

export interface Genre {
    id: number;
    name: string;
}

export interface GenreListResponse {
    genres: Genre[];
}