// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BuyerPage from './pages/BuyerPage';
import SellerPage from './pages/SellerPage';
import CarPage from './pages/CarPage';
import DealPage from './pages/DealPage';
import ReportPage from './pages/ReportPage';
import Layout from './components/Layout';
import GlobalStyles from './GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buyers" element={<BuyerPage />} />
            <Route path="/sellers" element={<SellerPage />} />
            <Route path="/cars" element={<CarPage />} />
            <Route path="/deals" element={<DealPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
