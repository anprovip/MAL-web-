import './App.css';
import { AnimeItem } from './components/AnimeItem';
import { Gallery } from './components/Gallery';
import { HomePage } from './components/HomePage';
import { MangaHomePage } from './components/MangaHomePage';
import { MangaItem } from './components/MangaItem';
import { RecommendationsAnime } from './components/RecommendationsAnime';
import { RecommendationsManga } from './components/RecommendationsManga';
import { Register } from './components/Register';
import { useGlobalContext } from './context/global';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const global = useGlobalContext();
  console.log(global);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manga" element={<MangaHomePage />} />
          <Route path="/anime/:id" element={<AnimeItem />} />
          <Route path="/manga/:id" element={<MangaItem />} />
          <Route path="/character/:id" element={<Gallery />} />
          <Route path="/recommendations/anime" element={<RecommendationsAnime />} />
          <Route path="/recommendations/manga" element={<RecommendationsManga />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
