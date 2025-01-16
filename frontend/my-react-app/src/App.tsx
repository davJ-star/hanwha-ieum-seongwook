import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Mypage from './pages/mypage'; // 회원관리 페이지 import
import CommunityMain from './pages/CommunityMain';
import DiseaseSearchResult from './pages/DiseaseSearchResult';
import DrugSearchResult from './pages/DrugSearchResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} /> {/* 회원관리 페이지 */}
        <Route path="/community-main" element={<CommunityMain />} />
        <Route path="/DiseaseSearchResult" element={<DiseaseSearchResult />} />
        <Route path="/DrugSearchResult" element={<DrugSearchResult />} />
      </Routes>
    </Router>
  );
}

export default App;
