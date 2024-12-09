import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Scene } from './components/Scene'
import { EmbedPage } from './pages/Embed'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = isMobile ? {
    width: '100vw',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    overflow: 'hidden'
  } : {
    width: '390px',
    height: '844px',
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    backgroundColor: '#000'
  };

  return (
    <BrowserRouter>
      <div style={containerStyle}>
        <Routes>
          <Route path="/:username" element={<Scene />} />
          <Route path="/embed" element={<EmbedPage />} />
          <Route path="/" element={<Navigate to="/thomscoder" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
