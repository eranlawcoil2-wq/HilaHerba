import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import KnowledgeCenter from './pages/KnowledgeCenter';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { SiteProvider } from './context/SiteContext';

function App() {
  return (
    <SiteProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Main unified page */}
            <Route path="/knowledge" element={<KnowledgeCenter />} />
            <Route path="/contact" element={<Contact />} />
            {/* Admin Route */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Old routes redirect to new structure */}
            <Route path="/plants" element={<Navigate to="/knowledge" replace />} />
            <Route path="/about" element={<Navigate to="/contact" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </SiteProvider>
  );
}

export default App;