import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import FloatingButtons from './FloatingButtons';
import AccessibilityModal from '../AccessibilityModal';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  const handleZoom = (zoomType: string) => {
    const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
    if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
    if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
  };

  return (
    <div className="app-container" style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' 
    }}>
      <Header 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onNavigate={navigate}
      />

      <main className="main-content" role="main">
        {children}
      </main>

      <Footer />

      <FloatingButtons 
        onZoomIn={() => handleZoom('in')}
        onZoomOut={() => handleZoom('out')}
        onAccessibilityToggle={() => setIsModalOpen(true)}
        onNavigate={navigate}
      />

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Layout;