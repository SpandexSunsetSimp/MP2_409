import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { MovieList } from './components/MovieList';
import { MovieGallery } from './components/MovieGallery';
import { MovieDetail } from './components/MovieDetail';
import './App.css';

function App() {
  const basename = "/MP2_409";

  return (
    <BrowserRouter basename={basename}>
      <div className="App">
        <header>
          <h1>TMDB Movie Explorer</h1>
          <nav>
            <NavLink to="/list">Movie List</NavLink>
            <NavLink to="/gallery">Movie Gallery</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<MovieGallery />} />
            <Route path="/list" element={<MovieList />} />
            <Route path="/gallery" element={<MovieGallery />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;