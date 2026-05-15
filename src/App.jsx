import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Sayfa Parçaları (Components)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Ana Bölümler
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Contact from './components/Contact';
import FAQ from './components/FAQ';

// Alt Sayfalar
import Events from './components/Events';
import Team from './components/team';
import Tuzuk from './components/Tuzuk';

// Admin Paneli ve Giriş
import Login from './components/Login';
import Admin from './components/Admin';

// Sadeleştirilmiş Ana Sayfa Düzeni
const MainLayout = () => {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      {/* Teknoloji Yığını ve İş Birlikleri buradan kaldırıldı */}
      <FAQ />
      <Contact />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/etkinlikler" element={<Events />} />
        <Route path="/yonetim-kurulu" element={<Team />} />
        <Route path="/tuzuk" element={<Tuzuk />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;