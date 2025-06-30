import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from "sonner";
import App from './App.jsx';
import DashboardWrapper from './components/DashboardWrapper.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';
import Login from './pages/Login.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
              <Toaster position='top-right' richColors={true} closeButton={true} />
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<App />} >
                            <Route index element={<DashboardWrapper />} />
                        </Route>
                    </Route>

                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);
