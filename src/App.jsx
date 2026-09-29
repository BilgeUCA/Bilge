import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import UniversitiesPage from './pages/UniversitiesPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import ORTPrepPage from './pages/ORTPrepPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import SitemapPage from './pages/SitemapPage';
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
        <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage key="signin" mode="signin" />} />
        <Route path="/signup" element={<LoginPage key="signup" mode="signup" />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<LegalPage doc="terms" />} />
        <Route path="/privacy" element={<LegalPage doc="privacy" />} />
        <Route path="/cookies" element={<LegalPage doc="cookies" />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
