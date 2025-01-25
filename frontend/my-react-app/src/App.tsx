import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // 메인 페이지
import Login from './pages/Login'; // 로그인 페이지
import Mypage from './pages/MemberInfo'; // 회원관리 페이지 import
import CommunityMain from './pages/CommunityMain'; // 커뮤니티 메인 페이지
import PDCcommu from './pages/PDCcommu'; // 시각장애 커뮤니티 페이지
import BLDcommu from './pages/BLDcommu'; // 청각장애 커뮤니티 페이지
import VIcommu from './pages/VIcommu'; // 시각장애 커뮤니티 페이지
import HIcommu from './pages/HIcommu'; // 청각장애 커뮤니티 페이지
import SIcommu from './pages/SIcommu'; // 언어장애 커뮤니티 페이지
import FDcommu from './pages/FDcommu'; // 안면장애 커뮤니티 페이지
import IODcommu from './pages/IODcommu'; // 내부기관장애 커뮤니티 페이지
import MDcommu from './pages/MDcommu'; // 정신적장애 커뮤니티 페이지
import DiseaseSearchResult from './pages/DiseaseSearchResult'; // 질병 검색 결과 페이지
import DrugSearchResult from './pages/DrugSearchResult'; // 의약품 검색 결과 페이지
import DiseaseDetail from './pages/DiseaseDetail'; // 질병 상세 페이지
import DrugDetail from './pages/DrugDetail'; // 의약품 상세 페이지
import Secession from './pages/Secession'; // 회원 탈퇴 페이지
import FADsearch from './pages/FADsearch'; // 의약품 허위광고 탐색 검색 페이지
import Signup from './pages/signup'; // 회원가입 페이지
import ForgotPassword from './pages/forgotpw'; // 비밀번호 찾기 페이지
import WritePost from './pages/writepost'; // 게시글 작성 페이지
import FADresult from './pages/FADresult'; // 의약품 허위광고 탐색 결과 페이지
import './assets/fonts/FontSet.css'; // 폰트 설정
import './styles/common.css'; // 공통 스타일 설정
import MemberInfo from './pages/MemberInfo';

function App() {
  return (
    <Router>
      <div role="application" aria-label="메인 애플리케이션">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/MemberInfo" element={<MemberInfo />} /> {/* 회원관리 페이지 */}
            <Route path="/community-main" element={<CommunityMain />} />
            <Route path="/PDCcommu" element={<PDCcommu />} />
            <Route path="/BLDcommu" element={<BLDcommu />} />
            <Route path="/VIcommu" element={<VIcommu />} />
            <Route path="/HIcommu" element={<HIcommu />} />
            <Route path="/SIcommu" element={<SIcommu />} />
            <Route path="/FDcommu" element={<FDcommu />} />
            <Route path="/IODcommu" element={<IODcommu />} />
            <Route path="/MDcommu" element={<MDcommu />} />
            <Route path="/DiseaseSearchResult" element={<DiseaseSearchResult />} />
            <Route path="/DrugSearchResult" element={<DrugSearchResult />} />
            <Route path="/DiseaseDetail" element={<DiseaseDetail />} />
            <Route path="/DrugDetail" element={<DrugDetail />} />
            <Route path="/secession" element={<Secession />} />
            <Route path="/FADsearch" element={<FADsearch />} />
            <Route path="/FADresult" element={<FADresult />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpw" element={<ForgotPassword />} />
            <Route path="/writepost" element={<WritePost />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
