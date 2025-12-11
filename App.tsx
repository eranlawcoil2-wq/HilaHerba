import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import KnowledgeCenter from './pages/KnowledgeCenter';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Main unified page */}
          <Route path="/knowledge" element={<KnowledgeCenter />} />
          <Route path="/contact" element={<Contact />} />
          {/* Old routes redirect to new structure */}
          <Route path="/plants" element={<Navigate to="/knowledge" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;