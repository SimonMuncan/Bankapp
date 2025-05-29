import './App.css';
import WalletPage from './pages/WalletPage/WalletPage';
import TransferPage from './pages/TransferPage/TransferPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import HomePage from './pages/HomePage/HomePage';
import MainLayout from './components/MainLayout';
import DepositPage from './pages/DepositPage/DepositPage';
import Transactions from './pages/TransactionsPage/TransactionsPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />}/> 
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/transaction" element={<Transactions />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;