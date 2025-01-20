import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Mypage from './pages/mypage'; // 회원관리 페이지 import
import CommunityMain from './pages/CommunityMain';
import DiseaseSearchResult from './pages/DiseaseSearchResult';
import DrugSearchResult from './pages/DrugSearchResult';
import Secession from './pages/Secession'; //빨간 표시 무시
import FADsearch from './pages/FADsearch';
import Signup from './pages/signup';
import './assets/fonts/FontSet.css';
import './styles/common.css';

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
        <Route path="/secession" element={<Secession />} />
        <Route path="/FADsearch" element={<FADsearch />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
