import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import UniversitiesPage from './pages/UniversitiesPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import ORTPrepPage from './pages/ORTPrepPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/universities/:id" element={<UniversityDetailPage />} />
        <Route path="/ort-prep" element={<ORTPrepPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
