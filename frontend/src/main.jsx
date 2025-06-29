import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import {Toaster} from "sonner";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
              <Toaster position='top-right' richColors={true} closeButton={true} />
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<App />} />
                    </Route>
                </Routes>

                <Route path="/login" element={<Login />} />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);
